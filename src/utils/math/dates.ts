import { differenceInDays } from "date-fns";

export function calcularPrazos(aplicacao: Date, vencimento: Date, analise: Date) {

  const diasTotais = differenceInDays(vencimento, aplicacao);
  const diasDecorridos = differenceInDays(analise, aplicacao);
  const diasFaltantes = differenceInDays(vencimento, analise);

  return {
    diasTotais,
    diasDecorridos,
    diasFaltantes,
    anosTotais: diasTotais / 365,
    anosFaltantes: diasFaltantes / 365,
  };
}