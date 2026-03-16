import { Header } from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <section className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <p className="text-center text-gray-500 mt-10">
          A calculadora será inserida aqui em breve...
        </p>
      </section>
    </main>
  );
}