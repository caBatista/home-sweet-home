import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Product } from "types";
import { toast } from "react-hot-toast";

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

  const updateLocalStorage = useCallback((newCart: Product[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  }, []);

  const addToCart = (product: Product) => {
    const currentQuantityInCart = cart.filter(item => item.id === product.id).length;

    if (currentQuantityInCart >= product.quantity) {
      toast.error("Quantidade máxima atingida para este produto");
      return;
    }

    const newCart = [...cart, product];
    setCart(newCart);
    updateLocalStorage(newCart);
    toast.success("Produto adicionado ao carrinho");
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    updateLocalStorage(newCart);
  };

  const clearCart = useCallback(() => {
    setCart([]);
    updateLocalStorage([]);
  }, [updateLocalStorage]);

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
