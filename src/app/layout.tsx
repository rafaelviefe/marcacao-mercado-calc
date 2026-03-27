import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL('https://calculadora.rafaelviefe.app'),
  title: "Calculadora de Marcação a Mercado | Compare sua Renda Fixa",
  description: "Descubra a rentabilidade mínima exigida para fazer a marcação a mercado do seu Tesouro Direto, CDB, LCI, LCA ou Debênture. Simule ganhos e impostos.",
  keywords: "marcação a mercado, calculadora renda fixa, tesouro direto, resgate antecipado, CDB, LCI, LCA, imposto de renda, TIR implícita",
  openGraph: {
    title: "Calculadora de Marcação a Mercado",
    description: "Vale a pena resgatar seu título de renda fixa antecipadamente? Calcule a rentabilidade exata e os impostos envolvidos.",
    type: "website",
    locale: "pt_BR",
  },
  verification: {
    google: "cT17vWOhnliimyGzzJN0hGjgjcZA93_pRFVcIZrrVOk", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${notoSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}