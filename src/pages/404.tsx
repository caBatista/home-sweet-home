import Footer from "@components/Footer";
import { Button } from "@components/ui/button";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-theme(spacing.32))] flex flex-col items-center justify-center">
          <div className="text-muted-foreground mb-6">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="96"
            height="96"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-6"
            >
            <path d="M16 16h.01"/>
            <path d="M8 16h.01"/>
            <path d="M12 2a10 10 0 0 1 10 10c0 .5-.04 1-.12 1.5"/>
            <path d="M12 2a10 10 0 0 0-9.88 11.5"/>
            <path d="M17 18a5 5 0 0 0-10 0"/>
            <path d="M8 22h8"/>
            <path d="M12 22v-4"/>
            </svg>
          </div>
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
