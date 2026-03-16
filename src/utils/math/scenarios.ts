import Decimal from "decimal.js";
import { CenarioSimulado } from "@/types/calculator";
import { getAliquotaIR } from "./taxes";

export function simularNovoInvestimento(
  taxaOfertadaAoAno: number,
  isentoIR: boolean,
  valorAtualLiquido: number,
  anosFaltantes: number,
  diasFaltantes: number,
  valorFinalLiqOrig: number
): CenarioSimulado {
  const capital = new Decimal(valorAtualLiquido);
  const taxaDecimal = new Decimal(taxaOfertadaAoAno).div(100);

  const vFinalBruto = capital.mul(new Decimal(1).plus(taxaDecimal).pow(anosFaltantes));
  const lucro = vFinalBruto.minus(capital);
  
  const aliquota = getAliquotaIR(diasFaltantes, isentoIR);
  const imposto = lucro.greaterThan(0) ? lucro.mul(aliquota) : new Decimal(0);
  
  const vFinalLiquido = vFinalBruto.minus(imposto);
  const ganhoReal = vFinalLiquido.minus(new Decimal(valorFinalLiqOrig));

  const valeAPena = ganhoReal.greaterThan(0.01);

  return {
    taxaOfertada: taxaOfertadaAoAno,
    isentoIR,
    valorFinalLiquido: vFinalLiquido.toNumber(),
    ganhoReal: ganhoReal.toNumber(),
    valeAPena,
  };
}