import Footer from "@components/Footer";
import { Button } from "@components/ui/button";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-theme(spacing.32))] flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb- text-foreground text-center">Página Não Encontrada</h1>
          <p className="text-lg mt-4 mb-8 text-muted-foreground text-center">
            Ops! A página que você está procurando não existe.
          </p>
          <Button
            variant="default"
            onClick={() => router.push("/")}
          >
            Voltar para Início
          </Button>
        </div>
      </main>
    </>
  );
}
