import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs";
  const delivery_fee = 250;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("guestCart");
    if (!savedCart) return {};

    try {
      const parsed = JSON.parse(savedCart);
      const cleaned = {};

      for (let key in parsed) {
        if (key && parsed[key] > 0) {
          cleaned[key] = parsed[key];
        }
      }

      return cleaned;
    } catch {
      return {};
    }
  });

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, offerRes, categoryRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/offer/active`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/category/list`), // Fetch categories
        ]);

        let productList = productRes.data.products || [];
        const activeOffers = offerRes.data.offers || [];
        const categoryList = categoryRes.data.categories || [];

        const updatedProducts = productList.map((product) => {
          let finalPrice = product.price;
          activeOffers.forEach((offer) => {
            if (offer.active && (!offer.applicableProducts || offer.applicableProducts.includes(product._id))) {
              finalPrice = finalPrice * (1 - offer.discountPercentage / 100);
            }
          });
          return {
            ...product,
            finalPrice: Math.round(finalPrice),
          };
        });

        setProducts(updatedProducts);
        setOffers(activeOffers);
        setCategories(categoryList.map((cat) => cat.name));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const cleaned = {};
    for (let key in cartItems) {
      if (key && cartItems[key] > 0) {
        cleaned[key] = cartItems[key];
      }
    }
    localStorage.setItem("guestCart", JSON.stringify(cleaned));
  }, [cartItems]);

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("guestCart");
  };

  const addToCart = (itemId, quantity = 1) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      updatedCart[itemId] = (updatedCart[itemId] || 0) + quantity;
      return updatedCart;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      updatedCart[itemId] = quantity;
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[itemId];
      return updatedCart;
    });
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);


  

  const value = {
    products,
    currency,
    offers,
    setOffers,
    categories, // Add categories to context
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