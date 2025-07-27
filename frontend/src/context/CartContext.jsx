import React, { createContext, useContext, useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [hasMerged, setHasMerged] = useState(false);

  const API_URL = "https://q313voe6g7.execute-api.ap-south-2.amazonaws.com/prod/cart";

  // ✅ Get Cognito user on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const uid = user.username || user.attributes?.email;
        setUserId(uid);
      } catch (err) {
        console.warn("User not logged in:", err);
      }
    };

    getUser();
  }, []);

  // ✅ Load from backend once userId is known
  useEffect(() => {
    if (userId && !hasMerged) {
      loadCartFromBackend();
    }
  }, [userId]);

  // ✅ Load cart from DynamoDB and merge with local
  const loadCartFromBackend = async () => {
    try {
      const res = await fetch(`${API_URL}?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to load cart");

      const data = await res.json();
      const cloudCart = data.cart?.items || [];

      const mergedCart = mergeCarts(cloudCart, cartItems);
      setCartItems(mergedCart);
      setHasMerged(true); // prevent re-merging on future renders

      // Only save if there was a merge change
      if (JSON.stringify(mergedCart) !== JSON.stringify(cloudCart)) {
        await saveCartToBackend(mergedCart);
      }
    } catch (err) {
      console.warn("Error loading cart:", err.message);
    }
  };

  // ✅ Merge logic (local takes priority)
  const mergeCarts = (cloud, local) => {
    const merged = [...cloud];

    local.forEach((localItem) => {
      const index = merged.findIndex((item) => item.id === localItem.id);
      if (index !== -1) {
        merged[index].quantity += localItem.quantity;
      } else {
        merged.push(localItem);
      }
    });

    return merged;
  };

  const saveCartToBackend = async (cart) => {
    if (!userId) return;

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items: cart }),
      });
    } catch (err) {
      console.error("Error saving cart:", err.message);
    }
  };

  // ✅ Add to cart
  const addToCart = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    let newCart;

    if (existing) {
      newCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cartItems, { ...product, quantity: 1 }];
    }

    setCartItems(newCart);
    saveCartToBackend(newCart);
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    saveCartToBackend(updated);
  };

  const updateQuantity = (id, delta) => {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updated);
    saveCartToBackend(updated);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartToBackend([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
