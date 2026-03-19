import { Calculator, Github, Linkedin, Twitter } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-calculator-primary shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Calculator size={28} strokeWidth={2.5} />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Calculadora de Marcação a Mercado
          </h1>
        </div>

        <div className="flex items-center gap-4 text-white/80">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}
