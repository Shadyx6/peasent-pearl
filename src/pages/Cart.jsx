// src/pages/Cart.jsx
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag, FiArrowRight, FiTrash2 } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,       // now an array [{productId, variantId, variantColor, quantity}, ...]
    removeFromCart,  // removeFromCart(productId, variantId)
    updateQuantity,  // updateQuantity(productId, variantId, newQuantity)
    delivery_fee,
    navigate,
    clearCart,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Build cartData from cartItems array + product lookup
  useEffect(() => {
    const items = (cartItems || [])
      .map((ci) => {
        if (!ci || !ci.productId) return null;
        const product = products.find((p) => String(p._id) === String(ci.productId));
        if (!product) return null;

        // Find variant by id first, fallback to color match if variantId missing
        let variant = null;
        if (ci.variantId) {
          variant = product.variants?.find((v) => String(v._id) === String(ci.variantId));
        }
        if (!variant && ci.variantColor) {
          variant = product.variants?.find((v) => (v.color || "").toLowerCase() === String(ci.variantColor).toLowerCase());
        }

        // fallback image
        const image = variant?.images?.[0] || product.image || null;
        const priceToUse = product.finalPrice ?? product.price;
        const quantity = Math.max(1, Number(ci.quantity) || 1);

        return {
          cartKey: `${ci.productId}_${ci.variantId || ci.variantColor || "default"}`, // for keys or debugging
          productId: ci.productId,
          variantId: ci.variantId || null,
          name: product.name,
          color: variant?.color || ci.variantColor || "default",
          image,
          price: product.price,
          finalPrice: product.finalPrice,
          priceToUse,
          quantity,
          total: Number((quantity * priceToUse).toFixed(2)),
        };
      })
      .filter(Boolean);

    setCartData(items);
    console.debug("Cart items mapped:", items);
  }, [cartItems, products]);

  const handleQuantityChange = (productId, variantId, newQuantity) => {
    newQuantity = Number(newQuantity || 0);
    if (newQuantity >= 1) {
      updateQuantity(productId, variantId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, variantId) => {
    removeFromCart(productId, variantId);
  };

  const subtotal = cartData.reduce((sum, item) => sum + Number(item.total || 0), 0);

  // <-- NEW: dynamic shipping: free if subtotal > 3000
  const shipping = subtotal > 3000 ? 0 : Number(delivery_fee || 0);
  const grandTotal = subtotal + shipping;

  if (cartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[70vh] flex flex-col justify-center items-center py-20 text-center px-4"
      >
        <div className="bg-amber-100 p-6 rounded-full mb-6">
          <FiShoppingBag className="w-12 h-12 text-amber-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-light text-amber-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-amber-700 mb-8 max-w-md">
          Looks like you haven't added any beautiful pieces to your cart yet.
        </p>
        <Link
          to="/collection"
          className="px-8 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all flex items-center gap-2"
        >
          <FaArrowLeft /> Browse Collection
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-8">
        <Link to="/collection" className="flex items-center text-amber-700 hover:text-amber-900 transition-colors">
          <FaArrowLeft className="mr-2" /> Continue Shopping
        </Link>
        <h2 className="text-2xl md:text-3xl font-serif font-light text-amber-900 mt-4">Your Shopping Cart</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <AnimatePresence>
              {cartData.map((item) => (
                <motion.div key={`${item.productId}_${item.variantId || item.color}`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }} className="flex flex-col sm:flex-row gap-6 p-4 bg-white rounded-xl shadow-sm border border-amber-100">
                  <div className="flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name}
                        className="w-full h-32 sm:w-32 sm:h-32 object-cover rounded-lg"
                        onError={(e) => { e.currentTarget.src = "/placeholder-image.jpg"; }} />
                    ) : (
                      <div className="w-full h-32 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">No Image</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-lg font-medium text-amber-900">{item.name}</h4>
                      <button onClick={() => handleRemoveItem(item.productId, item.variantId)} className="text-amber-600 hover:text-amber-800 transition-colors">
                        <FiTrash2 />
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">Color: {item.color}</p>

                    <p className="text-2xl font-medium text-amber-700 mt-2">
                      {item.finalPrice && item.finalPrice < item.price ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">{currency} {item.price.toLocaleString()}</span>
                          <span>{currency} {item.finalPrice.toLocaleString()}</span>
                        </>
                      ) : (
                        <>{currency} {item.price.toLocaleString()}</>
                      )}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-amber-200 rounded-lg">
                        <button onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity - 1)} className="px-3 py-1 text-amber-700 hover:bg-amber-50 transition-colors">-</button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity + 1)} className="px-3 py-1 text-amber-700 hover:bg-amber-50 transition-colors">+</button>
                      </div>

                      <p className="text-sm font-semibold text-amber-700">Total: {currency} {item.total}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 sticky top-8">
            <h3 className="text-xl font-serif font-light text-amber-900 mb-6 pb-2 border-b border-amber-200">Order Summary</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between"><span className="text-amber-700">Subtotal</span><span className="font-medium">{currency} {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between">
                <span className="text-amber-700">Delivery</span>
                <span className="font-medium">
                  {currency} {shipping}
                  {shipping === 0 && <span className="ml-2 text-xs text-green-600">(Free delivery for orders over 3000)</span>}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-amber-200"><span className="text-lg font-medium text-amber-900">Total</span><span className="text-lg font-medium text-amber-900">{currency} {grandTotal.toFixed(2)}</span></div>
            </div>

            <motion.button onClick={() => navigate("/place-order")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isProcessing}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${isProcessing ? "bg-amber-400 cursor-not-allowed" : "bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-lg"}`}>
              {isProcessing ? "Processing..." : <>Proceed to Checkout <FiArrowRight /></>}
            </motion.button>

            <motion.button onClick={clearCart} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all">
              <FiTrash2 /> Reset Cart
            </motion.button>

            <p className="text-xs text-amber-600 mt-4 text-center">Secure delivery within 11-13 business days</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
