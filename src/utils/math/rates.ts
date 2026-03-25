export function comporTaxaNominal(taxaFixaPct: number, inflacaoPct: number): number {
  const fixa = taxaFixaPct / 100;
  const ipca = inflacaoPct / 100;
  return ((1 + fixa) * (1 + ipca) - 1) * 100;
}

export function extrairTaxaReal(taxaNominalPct: number, inflacaoPct: number): number {
  const nominal = taxaNominalPct / 100;
  const ipca = inflacaoPct / 100;
  return ((1 + nominal) / (1 + ipca) - 1) * 100;
}