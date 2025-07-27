import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const Header = () => {
  const { cartItems } = useCart();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">SmartCart</Link>
      <nav>
        <Link
          to="/cart"
          className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          🛒 Cart ({cartItems.length})
        </Link>
      </nav>
    </header>
  );
};

export default Header;
