import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/cart-context";
import { Button } from "./components/ui/button";
import { X } from "lucide-react";
import { Product } from "types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
  SheetDescription,
} from "./components/ui/sheet";

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ open, onClose }) => {
  const { cart, removeFromCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[350px] sm:w-[450px]">
        <SheetHeader className="mb-6">
          <SheetTitle>Seu Carrinho</SheetTitle>
          <SheetDescription className="sr-only">
            Itens no carrinho
          </SheetDescription>
        </SheetHeader>
        
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <p className="text-muted-foreground mb-4">Seu carrinho está vazio.</p>
            <SheetClose asChild>
              <Button variant="outline" className="text-foreground">Continuar Comprando</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {cart.map((product: Product, index: number) => (
                  <li key={index} className="py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover ml-4 mr-4"
                      />
                      <span className="text-foreground">{product.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-foreground font-semibold mr-4">
                        R${product.price.toFixed(2)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFromCart(index)}
                        className="text-foreground hover:text-gray-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <SheetFooter className="mt-6">
              <div className="w-full">
                <div className="flex justify-between mb-4 text-foreground">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">
                    R${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </span>
                </div>
                <Button className="w-full" onClick={handleCheckout}>
                  Proceder para o pagamento
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
