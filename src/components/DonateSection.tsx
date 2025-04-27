import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const DonateSection: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const checkoutItem = [{
      title: 'Doação',
      unit_price: amount,
      quantity: 1
    }];

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(checkoutItem)
      });
      
      const data = await response.json();
      
      if (data && data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error("Invalid response format:", data);
        setError("Erro ao processar pagamento. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      setError("Erro ao processar pagamento. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="bg-card rounded-lg p-8 shadow-md">
        <h2 className="text-3xl font-bold text-center text-foreground mb-10">Faça uma Doação</h2>
        <p className="text-center mt-10 mb-8 text-muted-foreground">
          Sua contribuição nos ajuda a mobiliar nossa casa nova. Qualquer valor é bem-vindo!
        </p>
        
        <form onSubmit={handleDonate} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm text-foreground font-medium mb-2">
              Valor da Doação (R$)
            </label>
            <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Digite o valor"
                step="any"
                required
                className="w-full text-foreground"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Fazer Doação"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DonateSection;
