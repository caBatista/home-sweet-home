import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/cart-context";
import { Button } from "./components/ui/button";
import { X } from "lucide-react";

const Cart: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="cart bg-background shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Seu Carrinho</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Seu carrinho está vazio.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {cart.map(
            (
              product: {
                imageUrl: string;
                name: string;
                price: number;
                icon: string;
              },
              index: number
            ) => (
              <li
                key={index}
                className="py-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 mr-4"
                  />
                  <span className="text-foreground">{product.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-foreground font-semibold mr-4">
                    R${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-foreground hover:text-gray-400"
                  >
                    <X />
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
      <Button className="mt-2 w-full">Proceder para o pagamento</Button>
    </div>
  );
};

export default Cart;
