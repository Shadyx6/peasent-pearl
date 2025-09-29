// src/context/ShopContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const LOCAL_KEY = "guestCart_v1";

const ShopContextProvider = (props) => {
  const currency = "PKR";
  const delivery_fee = 250;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categories, setCategories] = useState([]);

  // CART: use an array of items { productId, variantId, variantColor, quantity }
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // normalize quantities
      return parsed
        .map((it) => ({
          productId: String(it.productId),
          variantId: it.variantId ? String(it.variantId) : null,
          variantColor: it.variantColor || null,
          quantity: Math.max(0, Number(it.quantity) || 0),
        }))
        .filter((it) => it.productId && it.quantity > 0);
    } catch (e) {
      console.warn("Failed to parse saved cart:", e);
      return [];
    }
  });

  // -----------------------
  // Data fetching
  // -----------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, offerRes, categoryRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/offer/active`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/category/list`),
        ]);

        const productList = productRes.data.products || [];
        const activeOffers = offerRes.data.offers || [];
        const categoryList = categoryRes.data.categories || [];

        // canonicalizer: normalize + singularize for stable comparisons
        const canonical = (s) => {
          if (!s && s !== "") return "";
          let str = String(s || "").trim().toLowerCase();
          str = str.replace(/[\s\-_]+/g, " ");
          // crude singularization
          if (str.endsWith("ies")) str = str.replace(/ies$/, "y");
          else if (str.endsWith("ses")) str = str.replace(/ses$/, "s"); // keep 'ses' -> 's' safe
          else if (str.endsWith("es")) str = str.replace(/es$/, "");
          else if (str.endsWith("s")) str = str.replace(/s$/, "");
          return str;
        };

        // helper: find category doc by id or name (case-insensitive)
        const findCategoryByIdOrName = (idOrName) => {
          if (!idOrName) return null;
          // id?
          if (/^[0-9a-fA-F]{24}$/.test(String(idOrName).trim())) {
            const byId = categoryList.find((c) => String(c._id) === String(idOrName).trim());
            if (byId) return byId;
          }
          const target = canonical(idOrName);
          return categoryList.find((c) => canonical(c.name || "") === target) || null;
        };

        // helper: get product's category name/id; also include subcategory
        const findProductCategoryIdOrName = (product) => {
          if (!product) return { id: null, name: null, subcategory: null };

          // product.category may be object or string (id/name)
          if (product.category && typeof product.category === "object") {
            return { id: product.category._id || null, name: product.category.name || null, subcategory: product.subcategory || null };
          }

          if (product.category && typeof product.category === "string") {
            const val = product.category.trim();
            if (/^[0-9a-fA-F]{24}$/.test(val)) return { id: val, name: null, subcategory: product.subcategory || null };
            return { id: null, name: val, subcategory: product.subcategory || null };
          }

          if (product.categoryId) return { id: String(product.categoryId), name: product.categoryName || null, subcategory: product.subcategory || null };
          if (product.categoryName) return { id: null, name: String(product.categoryName), subcategory: product.subcategory || null };
          if (product.subcategory) return { id: null, name: product.subcategory || null, subcategory: product.subcategory || null };

          return { id: null, name: null, subcategory: product.subcategory || null };
        };

        // filter offers by active flag and expiration
        const now = new Date();
        const validOffers = (activeOffers || []).filter((o) => {
          if (!o || !o.active) return false;
          if (!o.expiresAt) return true;
          const exp = new Date(o.expiresAt);
          return exp > now;
        });

        // --- NEW: pick percent from difficulty rule (kept minimal; everything else unchanged) ---
        const pickRulePercent = (offer, difficulty = "easy") => {
          const d = canonical(difficulty || "easy");
          const rules = Array.isArray(offer?.discountRules) ? offer.discountRules : [];
          const rule = rules.find((r) => canonical(r?.difficulty) === d);
          const pct = Number(rule?.discountPercentage);
          return Number.isFinite(pct) && pct > 0 ? pct : 0;
        };

        // Build updatedProducts with finalPrice & appliedOffer (logic same; only % source changed)
        const updatedProducts = productList.map((product) => {
          const { id: productCategoryId, name: productCategoryName, subcategory: productSubcategory } =
            findProductCategoryIdOrName(product);

          const prodCatCanon = canonical(productCategoryName || "");
          const prodSubCanon = canonical(productSubcategory || "");
          const difficulty = product.difficulty || "easy";

          const applicable = (validOffers || []).filter((offer) => {
            if (!offer) return false;

            // if offer has no categories -> global offer -> applies to everything
            if (!offer.categories || offer.categories.length === 0) return true;

            for (const catRef of offer.categories) {
              const catDoc =
                typeof catRef === "object" && catRef !== null
                  ? catRef
                  : findCategoryByIdOrName(catRef);

              const offerCatName = canonical(catDoc?.name || catRef || "");

              // 1) match by explicit id if both sides have IDs
              if (productCategoryId && catDoc && String(catDoc._id) === String(productCategoryId)) return true;

              // 2) match by canonical category name
              if (prodCatCanon && offerCatName && prodCatCanon === offerCatName) return true;

              // 3) match by subcategory name
              if (prodSubCanon && offerCatName && prodSubCanon === offerCatName) return true;

              // 4) if the offer indicates applyToSubcategories, check subcats
              if (offer.applyToSubcategories && catDoc && Array.isArray(catDoc.subcategories)) {
                const subcatsCanon = catDoc.subcategories.map((s) => canonical(s));
                if (subcatsCanon.includes(prodCatCanon) || subcatsCanon.includes(prodSubCanon)) return true;
              }
            }
            return false;
          });

          // choose the offer that gives the MAX percent for this product's difficulty
          let bestOffer = null;
          let bestPercent = 0;
          for (const off of applicable) {
            const p = pickRulePercent(off, difficulty);
            if (p > bestPercent) {
              bestPercent = p;
              bestOffer = off;
            }
          }

          const basePrice = Number(product.price || 0);
          const finalPrice = Math.round(basePrice * (1 - bestPercent / 100));

          return {
            ...product,
            finalPrice,
            appliedOffer: bestOffer || null,
            appliedDiscountPercent: bestPercent, // helpful for UI badges
          };
        });

        setProducts(updatedProducts);
        setOffers(validOffers); // keep only valid offers in state
        setCategories(categoryList);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      const toSave = cartItems
        .filter((it) => it && it.productId && it.quantity > 0)
        .map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          variantColor: it.variantColor,
          quantity: Number(it.quantity),
        }));
      localStorage.setItem(LOCAL_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn("Failed to save cart:", e);
    }
  }, [cartItems]);

  // -----------------------
  // CART API
  // -----------------------
  const addToCart = (productId, qty = 1, variantId = null, variantColor = null) => {
    if (!productId) return;
    qty = Math.max(1, Number(qty) || 1);
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.productId === String(productId) && String(it.variantId) === String(variantId)
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty };
        if (!updated[idx].variantColor && variantColor) updated[idx].variantColor = variantColor;
        return updated;
      }

      return [
        ...prev,
        {
          productId: String(productId),
          variantId: variantId ? String(variantId) : null,
          variantColor: variantColor || null,
          quantity: qty,
        },
      ];
    });
  };

  const updateQuantity = (productId, variantId, newQuantity) => {
    setCartItems((prev) => {
      const updated = prev.map((it) => ({ ...it }));
      const idx = updated.findIndex((it) => it.productId === String(productId) && String(it.variantId) === String(variantId));
      newQuantity = Math.max(0, Number(newQuantity) || 0);
      if (idx >= 0) {
        if (newQuantity <= 0) {
          updated.splice(idx, 1);
        } else {
          updated[idx].quantity = newQuantity;
        }
      }
      return updated;
    });
  };

  const removeFromCart = (productId, variantId) => {
    setCartItems((prev) => prev.filter((it) => !(it.productId === String(productId) && String(it.variantId) === String(variantId))));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(LOCAL_KEY);
  };

  const getCartCount = () => cartItems.reduce((sum, it) => sum + Number(it.quantity || 0), 0);

  // -----------------------
  // Provider value
  // -----------------------
  const value = {
    products,
    loadingProducts,
    currency,
    offers,
    setOffers,
    categories,
    setCategories,
    delivery_fee,
    addToCart,
    getCartCount,
    cartItems,
    updateQuantity,
    removeFromCart,
    navigate,
    clearCart,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
