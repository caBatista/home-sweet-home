import React, { createContext, useState, useContext, useEffect } from "react";
import { Product } from "types";

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    window.alert("Produto adicionado ao carrinho");
  };

  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([])
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
