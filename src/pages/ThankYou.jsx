// src/pages/ThankYou.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const ThankYou = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const name = query.get("name") || "Customer";
  const amount = query.get("amount") || "0.00";

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Payment Successful</h1>
        <p className="text-lg text-gray-700 mb-2">
          Thank you, <strong>{name}</strong>! 🙏
        </p>
        <p className="text-gray-700 mb-4">
          We have received your advance payment of <span className="font-semibold text-green-800">Rs. {amount}</span>.
        </p>
        <p className="text-sm text-gray-600">We will contact you soon for confirmation and delivery.</p>
      </div>
    </div>
  );
};

export default ThankYou;
