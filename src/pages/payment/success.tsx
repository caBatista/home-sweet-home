import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@components/ui/button"
import { useRouter } from "next/router"
import { useCart } from "@contexts/cart-context"

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateStock = async () => {
      try {
        const external_reference = router.query.external_reference;
        if (!external_reference) return;

        const response = await fetch("/api/payments/update_stock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ external_reference })
        });

        if (!response.ok) {
          throw new Error('Failed to update stock');
        }

        await response.json();
        clearCart();
      } catch (error) {
        console.error('Error updating stock:', error);
        setError('Houve um erro ao atualizar o estoque. Por favor, entre em contato conosco.');
      }
    };

    if (router.isReady) {
      updateStock();
    }
  }, [router.isReady, router.query, router, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-4">
      <h1 className="text-3xl font-bold mb-2">Compra realizada com sucesso!</h1>
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      <p className="text-lg mb-6 mt-10 flex items-center justify-center text-center">
        Muito obrigado por escolher produtos para o nosso enxoval de casa nova! Sua ajuda torna nosso lar ainda mais acolhedor.
      </p>
      <Link href="/" passHref>
        <Button variant="default" size="lg">Voltar para o início</Button>
      </Link>
    </div>
  )
}

export default SuccessPage