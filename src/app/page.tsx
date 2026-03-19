import { Header } from "@/components/Header";
import { CalculatorForm } from "@/components/CalculatorForm";
import { EducationalSection } from "@/components/EducationalSection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-sans">

      <Header />
      
      <section className="flex-1 w-full max-w-5xl mx-auto px-4 pt-12 pb-4">
        <CalculatorForm />
      </section>

      <section className="w-full px-4 border-t border-gray-200 mt-8 bg-white">
        <EducationalSection />
      </section>
      
      <footer className="w-full bg-gray-50 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        <p>Projeto de código aberto. Desenvolvido para ajudar investidores a tomar melhores decisões.</p>
      </footer>
    </main>
  );
}