export interface CalculadoraInput {
  dataAplicacao: Date;
  dataVencimento: Date;
  dataAnalise: Date;
  valorInvestido: number;
  valorAtualBruto: number;
  rentabilidadeContratada: number;
  isentoIR: boolean;
}

export interface ValoresIntermediarios {
  diasTotais: number;
  diasDecorridos: number;
  diasFaltantes: number;
  anosTotais: number;
  anosFaltantes: number;
  lucroAtualBruto: number;
  impostoRetidoAtual: number;
  valorAtualLiquido: number;
  valorFinalBrutoOriginal: number;
  impostoFinalOriginal: number;
  valorFinalLiquidoOriginal: number;
}

export interface RentabilidadeMinima {
  taxaIsenta: number;
  taxaTributada: number;
}

export interface CenarioSimulado {
  taxaOfertada: number;
  isentoIR: boolean;
  valorFinalLiquido: number;
  ganhoReal: number;
  valeAPena: boolean;
}

export interface CalculoCompleto {
  intermediarios: ValoresIntermediarios;
  rentabilidadeMinima: RentabilidadeMinima;
}