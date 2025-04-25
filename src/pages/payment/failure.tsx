import React from "react"
import Link from "next/link"
import { Button } from "@components/ui/button"

const FailurePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-3xl font-bold mb-2">Falha no pagamento</h1>
      <p className="text-lg mb-6 mt-10 flex items-center justify-center text-center">
        Houve um problema ao processar seu pagamento. Tente novamente.
      </p>
      <Link href="/" passHref>
        <Button variant="default" size="lg">Voltar para o início</Button>
      </Link>
    </div>
  )
}

export default FailurePage
