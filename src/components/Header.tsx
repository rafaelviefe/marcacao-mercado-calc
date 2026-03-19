import { Calculator, Github, Linkedin, Twitter } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-calculator-primary shadow-md">
      <div className="max-w-4xl w-full mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
            <Calculator size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
            Calculadora
            <span className="hidden sm:inline font-light text-white/90">
              de Marcação a Mercado
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-1 md:gap-2 text-white/80">
          <a
            href="https://www.linkedin.com/in/rafael-vieira-ferreira/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-2 rounded-full hover:text-white hover:bg-white/15 hover:scale-105 transition-all duration-200"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://x.com/rafaelvieiradev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="p-2 rounded-full hover:text-white hover:bg-white/15 hover:scale-105 transition-all duration-200"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://github.com/rafaelviefe/marcacao-mercado-calc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-full hover:text-white hover:bg-white/15 hover:scale-105 transition-all duration-200"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}