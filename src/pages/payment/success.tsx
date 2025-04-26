import React, { useEffect } from "react"
import Link from "next/link"
import { Button } from "@components/ui/button"
import { useCart } from "../../contexts/cart-context"

const SuccessPage: React.FC = () => {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-4">
      <h1 className="text-3xl font-bold mb-2">Compra realizada com sucesso!</h1>
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