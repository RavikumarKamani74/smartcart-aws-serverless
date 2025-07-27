import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        SmartCart
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        <Link to="/cart" className="hover:underline relative">
          Cart
          <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-sm">
            {cartItems?.length || 0}
          </span>
        </Link>

        {user ? (
          <>
            <Link to="/orders" className="hover:underline">
              My Orders
            </Link>
            <span>{user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
