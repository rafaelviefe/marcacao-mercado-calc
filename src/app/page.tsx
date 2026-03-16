import { Header } from "@/components/Header";
import { CalculatorForm } from "@/components/CalculatorForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <section className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
        <CalculatorForm />
        
        {/* Componentes de Resultados e Texto Explicativo*/}
      </section>
    </main>
  );
}