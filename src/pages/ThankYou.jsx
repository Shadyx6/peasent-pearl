// src/pages/ThankYou.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

const ThankYou = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const name = query.get("name") || "Customer";
  const amount = query.get("amount") || "0.00";
  const orderId = query.get("orderId") || null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center"
      >
        <div className="mb-4">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <span className="text-3xl">✅</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Order Placed Successfully 🎉
        </h1>
        <p className="text-gray-700 mb-3">
          Thank you, <strong>{name}</strong>! 🙏
        </p>

        {orderId && (
          <p className="text-sm text-gray-600 mb-3">
            Your Order ID: <span className="font-mono">{orderId}</span>
          </p>
        )}

        <p className="text-gray-700 mb-4">
          We have received your order with an advance of{" "}
          <span className="font-semibold text-green-800">Rs. {amount}</span>.
        </p>

        <p className="text-sm text-gray-600 mb-6">
          Our team will verify your payment proof and contact you soon
          regarding confirmation and delivery. Please keep your phone
          available.
        </p>

        <Link
          to="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
};

export default ThankYou;
