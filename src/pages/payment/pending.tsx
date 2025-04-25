import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@components/ui/button"
import { Spinner } from "@components/ui/spinner"
import { useRouter } from "next/router"
import { useCart } from "../../contexts/cart-context"

interface PaymentStatus {
  status: string;
  status_detail: string;
  payment_method: string;
}

const PendingPage: React.FC = () => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const external_reference = router.query.external_reference;
        if (!external_reference) return;

        const response = await fetch(`/api/payments/status?external_reference=${external_reference}`);
        const data = await response.json();

        if (response.ok) {
          setPaymentStatus(data);
          if (data.status === 'approved') {
            clearCart();
            router.push('/payment/success');
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      checkPaymentStatus();
      const interval = setInterval(checkPaymentStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [router.isReady, router.query, clearCart, router]);

  const getStatusMessage = () => {
    if (!paymentStatus) return "Verificando status do pagamento...";
    
    if (paymentStatus.payment_method === "pix") {
      return "Aguardando a confirmação do pagamento via PIX. Por favor, complete o pagamento usando o código PIX fornecido.";
    }
    
    return "Seu pagamento está em processamento. Aguarde a confirmação.";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-3xl font-bold mb-2">Pagamento pendente</h1>
      <p className="text-lg mb-6 mt-10 flex items-center justify-center text-center gap-3">
        {isLoading ? (
          <>
            <Spinner className="w-6 h-6" />
            Verificando status do pagamento...
          </>
        ) : (
          getStatusMessage()
        )}
      </p>
      <Link href="/" passHref>
        <Button variant="default" size="lg">Voltar para o início</Button>
      </Link>
    </div>
  )
}

export default PendingPage