import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Product } from "types";
import { CartItem } from "types/cart";
import { toast } from "sonner";

const CART_VERSION = 1;
const CART_KEY = "cart";
const CART_VERSION_KEY = "cart_version";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(CART_VERSION_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

const getInitialCart = () => {
  if (typeof window === "undefined") return [];
  
  try {
    const version = localStorage.getItem(CART_VERSION_KEY);
    const savedCart = localStorage.getItem(CART_KEY);

    if (!version || parseInt(version) !== CART_VERSION) {
      clearLocalStorage();
      localStorage.setItem(CART_VERSION_KEY, CART_VERSION.toString());
      return [];
    }

    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    clearLocalStorage();
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedCart = getInitialCart();
      setCart(savedCart);
    } catch (error) {
      console.error("Error initializing cart:", error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLocalStorage = useCallback((newCart: CartItem[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(newCart));
        // Ensure version is set
        localStorage.setItem(CART_VERSION_KEY, CART_VERSION.toString());
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
        clearLocalStorage();
      }
    }
  }, []);

  const addToCart = (product: Product, quantity: number) => {
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
    const currentInCart = existingItemIndex !== -1 ? cart[existingItemIndex].quantity : 0;
    const newQuantity = currentInCart + quantity;

    if (newQuantity > product.quantity) {
      toast.error(`Quantidade máxima disponível é ${product.quantity}`);
      return;
    }

    if (existingItemIndex !== -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity = newQuantity;
      setCart(newCart);
      updateLocalStorage(newCart);
    } else {
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
      toast.error(`Quantidade máxima disponível é ${item.product.quantity}`);
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
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isLoading }}>
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
