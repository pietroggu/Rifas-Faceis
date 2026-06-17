// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // [{ raffleId, raffleName, price, number }]

  const addToCart = (item) => {
    // Evita duplicados idênticos no carrinho
    setCartItems((prev) => {
      const exists = prev.some(
        (i) => i.raffleId === item.raffleId && i.number === item.number
      );
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (raffleId, number) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.raffleId === raffleId && i.number === number))
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}