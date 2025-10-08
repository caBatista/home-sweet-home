import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Spinner } from "@components/ui/spinner";
import { useRouter } from "next/router";
import { useCart } from "../../contexts/cart-context";

type PaymentStatus = {
  status: string;
  status_detail?: string;
  payment_method?: string;
};

const PendingPage = () => {
  const router = useRouter();
  const { clearCart } = useCart();

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Normalize external_reference (can be string | string[] | undefined)
  const externalRef = useMemo(() => {
    const q = router.query.external_reference;
    return Array.isArray(q) ? q[0] : q ?? null;
  }, [router.query.external_reference]);

  useEffect(() => {
    if (!router.isReady) return;

    if (!externalRef) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(
          `/api/payments/status?external_reference=${encodeURIComponent(externalRef)}`
        );
        const data: PaymentStatus = await res.json();

        if (!isMounted) return;

        if (res.ok) {
          setPaymentStatus(data);
          if (data.status === "approved") {
            clearCart();
            router.replace(
              `/payment/success?external_reference=${encodeURIComponent(externalRef)}`
            );
          }
        } else {
          console.error("Payment status error:", data);
        }
      } catch (err) {
        if (isMounted) console.error("Error checking payment status:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkPaymentStatus();
    const interval = setInterval(checkPaymentStatus, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [router.isReady, externalRef, clearCart, router]);

  const renderStatus = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-3">
          <span>Verificando status do pagamento...</span>
          <Spinner className="w-5 h-5" />
        </div>
      );
    }
    if (!paymentStatus) {
      return <span>Não foi possível obter o status do pagamento.</span>;
    }
    if (paymentStatus.payment_method === "pix") {
      return (
        <span>
          Aguardando a confirmação do pagamento via PIX. Por favor, complete o
          pagamento usando o código PIX fornecido.
        </span>
      );
    }
    return (
      <div className="flex items-center justify-center gap-3">
        <span>Seu pagamento está em processamento. Aguarde a confirmação.</span>
        <Spinner className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-4">
      <h1 className="text-3xl font-bold mb-2">Pagamento pendente</h1>
      <div className="text-lg mb-6 mt-10">{renderStatus()}</div>

      <Button asChild size="lg">
        <Link href="/">Voltar para o início</Link>
      </Button>
    </div>
  );
};

export default PendingPage;
