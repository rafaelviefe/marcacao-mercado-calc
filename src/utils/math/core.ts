import Decimal from "decimal.js";
import { CalculadoraInput, CalculoCompleto } from "@/types/calculator";
import { calcularPrazos } from "./dates";
import { getAliquotaIR } from "./taxes";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export function calcularMarcacaoAMercado(input: CalculadoraInput): CalculoCompleto {
  const vInvestido = new Decimal(input.valorInvestido);
  const vAtualBruto = new Decimal(input.valorAtualBruto);
  const rContratada = new Decimal(input.rentabilidadeContratada).div(100);

  const prazos = calcularPrazos(input.dataAplicacao, input.dataVencimento, input.dataAnalise);

  const vFinalBrutoOrig = vInvestido.mul(new Decimal(1).plus(rContratada).pow(prazos.anosTotais));
  const aliquotaOrig = getAliquotaIR(prazos.diasTotais, input.isentoIR);
  
  const lucroOrig = vFinalBrutoOrig.minus(vInvestido);
  const impostoOrig = lucroOrig.greaterThan(0) ? lucroOrig.mul(aliquotaOrig) : new Decimal(0);
  const vFinalLiqOrig = vFinalBrutoOrig.minus(impostoOrig);

  const lucroAtualBruto = vAtualBruto.minus(vInvestido);
  const aliquotaAtual = getAliquotaIR(prazos.diasDecorridos, input.isentoIR);
  
  const impostoAtual = lucroAtualBruto.greaterThan(0) ? lucroAtualBruto.mul(aliquotaAtual) : new Decimal(0);
  const vAtualLiquido = vAtualBruto.minus(impostoAtual);

  const lucroNecessarioIsento = vFinalLiqOrig.minus(vAtualLiquido);
  const vFinalBrutoNecessarioIsento = vAtualLiquido.plus(lucroNecessarioIsento);
  
  const rMinIsenta = vFinalBrutoNecessarioIsento.div(vAtualLiquido)
    .pow(new Decimal(1).div(prazos.anosFaltantes))
    .minus(1).mul(100);

  const aliquotaNovaTributada = getAliquotaIR(prazos.diasFaltantes, false);
  const margemLiquidaNova = new Decimal(1).minus(aliquotaNovaTributada);
  
  const lucroBrutoNecessarioTrib = vFinalLiqOrig.minus(vAtualLiquido).div(margemLiquidaNova);
  const vFinalBrutoNecessarioTrib = vAtualLiquido.plus(lucroBrutoNecessarioTrib);

  const rMinTributada = vFinalBrutoNecessarioTrib.div(vAtualLiquido)
    .pow(new Decimal(1).div(prazos.anosFaltantes))
    .minus(1).mul(100);

  return {
    intermediarios: {
      diasTotais: prazos.diasTotais,
      diasDecorridos: prazos.diasDecorridos,
      diasFaltantes: prazos.diasFaltantes,
      anosTotais: prazos.anosTotais,
      anosFaltantes: prazos.anosFaltantes,
      lucroAtualBruto: lucroAtualBruto.toNumber(),
      aliquotaAtual: aliquotaAtual * 100,
      impostoRetidoAtual: impostoAtual.toNumber(),
      valorAtualLiquido: vAtualLiquido.toNumber(),
      valorFinalBrutoOriginal: vFinalBrutoOrig.toNumber(),
      aliquotaOriginal: aliquotaOrig * 100,
      impostoFinalOriginal: impostoOrig.toNumber(),
      valorFinalLiquidoOriginal: vFinalLiqOrig.toNumber(),
    },
    rentabilidadeMinima: {
      taxaIsenta: rMinIsenta.toNumber(),
      taxaTributada: rMinTributada.toNumber(),
    }
  };
}