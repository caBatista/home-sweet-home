import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/cart-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
  SheetDescription,
} from "./ui/sheet";

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ open, onClose }) => {
  const { cart, removeFromCart, updateQuantity, isLoading } = useCart();
  const [itemToRemove, setItemToRemove] = useState<{ index: number; name: string } | null>(null);

  if (isLoading) {
    return null;
  }

  function handleCheckout(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    if (cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    const checkoutItems = cart.map(item => ({
      id: item.product.id,
      title: item.product.name,
      unit_price: item.product.price,
      quantity: item.quantity
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
      if (data && data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error("Invalid response format:", data);
        alert("Erro ao processar pagamento. Por favor, tente novamente.");
      }
    })
    .catch(error => {
      console.error("Erro ao criar checkout:", error);
    });
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
                {cart.map((item, index) => (
                  <li key={index} className="py-4 flex justify-between items-center">
                    <div className="flex items-start gap-4 flex-1 min-w-0 ml-4">
                      <img
                        src={item.product.imagesUrl[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="overflow-hidden">
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-foreground">{item.product.name}</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-foreground"
                            onClick={() => {
                              if (item.quantity === 1) {
                                setItemToRemove({ index, name: item.product.name });
                              } else {
                                updateQuantity(index, item.quantity - 1);
                              }
                            }}
                          >
                            -
                          </Button>
                          <span className="mx-2 text-foreground min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-foreground"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            disabled={item.quantity >= item.product.quantity}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-foreground font-semibold">
                        R${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setItemToRemove({ index, name: item.product.name })}
                        className="text-muted-foreground hover:text-foreground"
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
                    R${cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <Button className="w-full" onClick={handleCheckout}>
                  Seguir para o pagamento
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
      <AlertDialog open={itemToRemove !== null} onOpenChange={() => setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Remover item</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Remover "{itemToRemove?.name}" do carrinho?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-muted-foreground">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToRemove) {
                  removeFromCart(itemToRemove.index);
                }
                setItemToRemove(null);
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
};

export default Cart;
