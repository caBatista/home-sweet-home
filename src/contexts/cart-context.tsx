import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Product } from "types";
import { CartItem } from "types/cart";
import { toast } from "sonner";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  const updateLocalStorage = useCallback((newCart: CartItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  }, []);

  const addToCart = (product: Product, quantity: number) => {
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
      const newQuantity = cart[existingItemIndex].quantity + quantity;
      if (newQuantity > product.quantity) {
        toast.error("Quantidade máxima atingida para este produto");
        return;
      }
      const newCart = [...cart];
      newCart[existingItemIndex].quantity = newQuantity;
      setCart(newCart);
      updateLocalStorage(newCart);
    } else {
      if (quantity > product.quantity) {
        toast.error("Quantidade máxima atingida para este produto");
        return;
      }
      const newCart = [...cart, { product, quantity }];
      setCart(newCart);
      updateLocalStorage(newCart);
    }
    toast.success("Produto adicionado ao carrinho");
  };

  const updateQuantity = (index: number, quantity: number) => {
    const newCart = [...cart];
    const item = newCart[index];
    
    if (quantity > item.product.quantity) {
      toast.error("Quantidade máxima atingida para este produto");
      return;
    }
    
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    newCart[index] = { ...item, quantity };
    setCart(newCart);
    updateLocalStorage(newCart);
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
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
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
