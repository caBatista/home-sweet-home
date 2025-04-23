import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/cart-context";
import { Button } from "./components/ui/button";
import { X } from "lucide-react";
import { Product } from "types";

const Cart: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  function handleCheckout(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    if (cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    const checkoutItems = cart.map(product => ({
      title: product.name,
      unit_price: product.price,
      quantity: 1
    }));

    fetch("/api/checkout", {
      method: "POST",
      headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify(checkoutItems)
    })
    .then(res => res.json())
    .then(data => {
      const preference = data;
      console.log(preference);
      window.location.href = preference.init_point;
    })
    .catch(error => {
    console.error("Erro ao criar checkout:", error);
    });

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
              product: Product,
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
      <Button className="mt-2 w-full" onClick={handleCheckout}>Proceder para o pagamento</Button>
    </div>
  );
};

export default Cart;
