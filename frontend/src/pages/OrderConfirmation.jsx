import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">No Order Found</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h2>

      <div className="bg-gray-100 p-4 rounded shadow">
        <p><strong>Order ID:</strong> {order.orderId}</p>
        <p><strong>Customer:</strong> {order.username}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Items:</h3>
      <ul className="mb-4">
        {order.items.map((item, index) => (
          <li
            key={index}
            className="flex justify-between border-b border-gray-300 py-2"
          >
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-bold">Total: ₹{order.total}</h3>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;
