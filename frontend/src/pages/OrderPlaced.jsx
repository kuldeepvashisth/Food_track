import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const OrderPlaced = () => {
  const navigate = useNavigate();

  const handleBackToOrders = () => {
    navigate("/my-orders");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg px-8 py-16 text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <FaCheck className="text-white text-4xl" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Order Placed!
        </h1>

        {/* Message */}
        <p className="text-gray-500 text-base leading-7 max-w-md mx-auto mb-8">
          Thank you for your purchase. Your order is being prepared.
          You can track your order status in the "My Orders" section.
        </p>

        {/* Button */}
        <button
          onClick={handleBackToOrders}
          className="bg-orange-500 hover:bg-orange-600 text-white
                     font-semibold px-7 py-3 rounded-lg
                     transition duration-200 shadow-md"
        >
          Back to My Orders
        </button>

      </div>
    </div>
  );
};

export default OrderPlaced;