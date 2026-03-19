import { AlertTriangle, Scale, ShieldAlert, Landmark, CalendarClock } from "lucide-react";

export function EducationalSection() {
  return (
    <article className="max-w-4xl mx-auto mt-12 mb-16 space-y-10 text-calculator-text">
      
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-3xl font-bold text-calculator-red tracking-tight">
          Entenda a Calculadora de Marcação a Mercado
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A marcação a mercado permite que você lucre com a venda antecipada de um título de renda fixa. Veja como utilizar a ferramenta para tomar decisões baseadas em matemática.
        </p>
      </div>

      <section className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold border-b-2 border-calculator-red pb-2 mb-6 inline-block">
          Passo a Passo de Uso
        </h3>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-calculator-red text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-bold text-lg">Reúna os dados do seu título</h4>
              <p className="text-gray-600 mt-1">Você encontra a data de aplicação, vencimento, valor investido e valor bruto atual no extrato da sua corretora. Caso seja um título do Tesouro Direto, você pode conferir todos os detalhes acessando o <a href="https://portalinvestidor.tesourodireto.com.br/MeusInvestimentos" target="_blank" rel="noopener noreferrer" className="text-calculator-red font-semibold hover:underline">Portal do Investidor do Tesouro</a>.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-calculator-red text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-bold text-lg">Preencha a Calculadora</h4>
              <p className="text-gray-600 mt-1">Insira os valores nos campos acima. Lembre-se de marcar se o seu título atual é isento de Imposto de Renda (como LCI, LCA, CRI, CRA ou Debêntures Incentivadas).</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-calculator-red text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-bold text-lg">Analise o "Alvo a Bater"</h4>
              <p className="text-gray-600 mt-1">A calculadora informará a <strong>Rentabilidade Mínima Exigida</strong> (TIR Implícita). Essa é a taxa mínima que você precisa encontrar no mercado hoje para que a venda antecipada compense matematicamente.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-calculator-card p-6 md:p-8 rounded-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-calculator-text">Fatores Cruciais a Considerar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-md border border-gray-200 flex gap-3">
            <Scale className="text-calculator-red shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-sm">Compare Maçãs com Maçãs</h4>
              <p className="text-sm text-gray-600 mt-1">Sempre compare títulos de mesma natureza. Se o seu título atual é atrelado à inflação (IPCA+), compare com outro IPCA+. Se for Prefixado, compare com Prefixado.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-200 flex gap-3">
            <CalendarClock className="text-calculator-red shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-sm">Atenção aos Prazos</h4>
              <p className="text-sm text-gray-600 mt-1">Este cálculo assume que o novo título terá o mesmo vencimento do antigo. Se o novo título for mais longo, ele tende a ser melhor, pois você adiará o pagamento do Imposto de Renda.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-200 flex gap-3">
            <ShieldAlert className="text-calculator-red shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-sm">Risco do Emissor</h4>
              <p className="text-sm text-gray-600 mt-1">Títulos diferentes possuem riscos diferentes. Trocar um Tesouro Direto (Risco Soberano) por uma Debênture (Risco Corporativo) exige um prêmio extra pela diferença de segurança.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-200 flex gap-3">
            <AlertTriangle className="text-calculator-red shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-sm">Limitações do Cálculo</h4>
              <p className="text-sm text-gray-600 mt-1">Nossa matemática foi desenhada para títulos que pagam tudo no final (balão). Ela <strong>não</strong> deve ser usada para títulos que pagam Juros Semestrais ou Amortizações periódicas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Landmark className="text-calculator-red" size={24} />
          <h3 className="text-xl font-bold text-calculator-text">Tabela Regressiva de Imposto de Renda</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Nossa calculadora aplica automaticamente a alíquota correta baseada no prazo em que o seu dinheiro ficou (ou ficará) investido, cobrada apenas sobre os lucros.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-sm uppercase text-gray-600">
                <th className="p-4 font-bold">Prazo de Investimento</th>
                <th className="p-4 font-bold">Alíquota sobre o Rendimento</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">Até 180 dias</td>
                <td className="p-4 font-bold text-calculator-text">22,5%</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">De 181 a 360 dias</td>
                <td className="p-4 font-bold text-calculator-text">20,0%</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">De 361 a 720 dias</td>
                <td className="p-4 font-bold text-calculator-text">17,5%</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">Acima de 720 dias</td>
                <td className="p-4 font-bold text-calculator-text">15,0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </article>
  );
}