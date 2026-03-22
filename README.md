# Calculadora de Marcação a Mercado

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node Version](https://img.shields.io/badge/node-18+-green.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Ferramenta open-source para simulação e cálculo do impacto da marcação a mercado na liquidação antecipada de títulos de Renda Fixa no Brasil.

## Quick Start (Execução Local)

O projeto foi estruturado para rápida inicialização. Certifique-se de ter o Node.js (versão 18+) instalado.

```bash
# Clone o repositório
git clone [https://github.com/rafaelviefe/marcacao-mercado-calc.git](https://github.com/rafaelviefe/marcacao-mercado-calc.git)

# Acesse o diretório
cd marcacao-mercado-calc

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
A aplicação estará disponível em http://localhost:3000.

## Sobre o Projeto

Este repositório visa preencher uma lacuna técnica no ecossistema financeiro brasileiro: a ausência de calculadoras de renda fixa transparentes, de código aberto e matematicamente rigorosas que permitam ao investidor auditar e compreender o custo de oportunidade na venda de títulos.

A modelagem matemática e as premissas de educação financeira implementadas nesta aplicação utilizam como principal referência técnica os conceitos amplamente divulgados pelo canal **Investidor Sardinha**.

Nosso foco é fornecer uma infraestrutura de cálculo auditável pela comunidade, garantindo precisão na precificação e transparência total sobre como as taxas e impostos impactam o Preço Unitário (PU).

## Escopo Técnico e Funcionalidades

A aplicação resolve a fórmula de juros compostos aplicada às especificidades do mercado brasileiro:

- **Motor de Precificação (PU)**: Cálculo do valor presente e futuro baseado na convenção de mercado de 252 dias úteis.
- **Tributação Automática**: Integração com as regras da Receita Federal (tabela regressiva de IR e abatimento dinâmico de IOF para prazos inferiores a 30 dias).
- **Comparativo Analítico**: Avaliação quantitativa de rentabilidade do cenário "Carregar até o Vencimento" versus "Venda a Mercado".
- **Privacy by Design (Client-Side Only)**: Toda a arquitetura foi desenhada para executar exclusivamente no navegador do usuário. Nenhum dado financeiro transita em rede ou é armazenado em banco de dados.

## Arquitetura do Domínio Financeiro

Para viabilizar a evolução contínua (ex: suporte futuro a títulos indexados à inflação), a lógica matemática foi estritamente isolada da interface (React). O core financeiro encontra-se em `src/utils/math/`:

- `core.ts`: Fórmulas puras de juros compostos e precificação unitária (PU).
- `dates.ts`: Lógica de padronização de contagem de dias úteis e dias corridos.
- `taxes.ts`: Constantes e funções para inferência de alíquotas de IR e IOF.
- `scenarios.ts`: Agregação e orquestração dos dados para geração do relatório comparativo.

## Como Contribuir

A manutenção e evolução deste projeto dependem da comunidade. Seja para otimizar o motor de cálculo, refatorar componentes ou adicionar cobertura de testes, sua contribuição é essencial.

1. Faça o fork do repositório.
2. Crie uma branch para sua modificação: `git checkout -b feature/sua-feature-aqui`
3. Faça o commit detalhando suas alterações de forma clara.
4. Abra um Pull Request.

## Aviso Legal

Este software é disponibilizado com fins estritamente educacionais e analíticos. Os algoritmos utilizam a padronização primária de mercado (spread zero, ano base de 252 dias úteis). Os valores reais liquidados por instituições financeiras podem apresentar divergências em decorrência de deságios (spreads) proprietários e tratamentos específicos de calendário de feriados. Esta ferramenta não constitui recomendação de investimento ou consultoria financeira.

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais informações.