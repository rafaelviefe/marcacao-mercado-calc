"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { parse, isValid, startOfDay } from "date-fns";
import { Info, ChevronDown } from "lucide-react";
import { maskDate, maskDecimal, parseStringToNumber } from "@/utils/formatters";
import { calcularMarcacaoAMercado } from "@/utils/math/core";
import { simularNovoInvestimento } from "@/utils/math/scenarios";
import { CalculoCompleto, CenarioSimulado } from "@/types/calculator";
import { comporTaxaNominal, extrairTaxaReal } from "@/utils/math/rates";

const formSchema = z
  .object({
    tipoTitulo: z.enum(["PREFIXADO", "IPCA"]),
    taxaInflacao: z.string().optional(),
    dataAplicacao: z
      .string()
      .min(10, "Data incompleta")
      .refine((val) => isValid(parse(val, "dd/MM/yyyy", new Date())), {
        message: "Data inválida",
      }),
    dataVencimento: z
      .string()
      .min(10, "Data incompleta")
      .refine((val) => isValid(parse(val, "dd/MM/yyyy", new Date())), {
        message: "Data inválida",
      }),
    valorInvestido: z
      .string()
      .min(1, "Obrigatório")
      .refine((v) => parseStringToNumber(v) > 0, "Maior que zero"),
    valorAtualBruto: z
      .string()
      .min(1, "Obrigatório")
      .refine((v) => parseStringToNumber(v) > 0, "Maior que zero"),
    rentabilidadeContratada: z
      .string()
      .min(1, "Obrigatório")
      .refine((v) => parseStringToNumber(v) > 0, "Maior que zero"),
    isentoIR: z.boolean(),
    taxaOfertada: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const aplicacao = parse(data.dataAplicacao, "dd/MM/yyyy", new Date());
    const vencimento = parse(data.dataVencimento, "dd/MM/yyyy", new Date());
    const hoje = startOfDay(new Date());

    if (isValid(aplicacao) && isValid(vencimento)) {
      if (vencimento <= aplicacao) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Deve ser após a aplicação",
          path: ["dataVencimento"],
        });
      }
      if (vencimento <= hoje) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Título já venceu",
          path: ["dataVencimento"],
        });
      }
      if (aplicacao > hoje) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Não pode ser no futuro",
          path: ["dataAplicacao"],
        });
      }
    }
  });

export type CalculatorFormData = z.infer<typeof formSchema>;

type ResultState = {
  core: CalculoCompleto;
  simulacaoIsenta?: CenarioSimulado;
  simulacaoTributada?: CenarioSimulado;
  montanteFicar: number;
  isIPCA: boolean;
  ipcaUtilizado: number;
};

const formatBRL = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    val,
  );
const formatPct = (val: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val) + "%";

export function CalculatorForm() {
  const [resultado, setResultado] = useState<ResultState | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CalculatorFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      tipoTitulo: "PREFIXADO",
      taxaInflacao: "4,50",
      isentoIR: false,
      taxaOfertada: "",
    },
  });

  const tipoTituloWatch = watch("tipoTitulo");
  const isentoIRWatch = watch("isentoIR");

  const handleDateChange =
    (field: "dataAplicacao" | "dataVencimento") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, maskDate(e.target.value), { shouldValidate: true });
    };

  const handleDecimalChange =
    (
      field:
        | "valorInvestido"
        | "valorAtualBruto"
        | "rentabilidadeContratada"
        | "taxaOfertada"
        | "taxaInflacao",
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, maskDecimal(e.target.value), { shouldValidate: true });
    };

  const onSubmit = (data: CalculatorFormData) => {
    const isIPCA = data.tipoTitulo === "IPCA";
    const ipcaUtilizado = isIPCA
      ? parseStringToNumber(data.taxaInflacao || "4,50")
      : 0;

    const taxaDigitadaContratada = parseStringToNumber(
      data.rentabilidadeContratada,
    );
    const taxaNominalParaMotor = comporTaxaNominal(
      taxaDigitadaContratada,
      ipcaUtilizado,
    );

    const inputParaMotor = {
      dataAplicacao: parse(data.dataAplicacao, "dd/MM/yyyy", new Date()),
      dataVencimento: parse(data.dataVencimento, "dd/MM/yyyy", new Date()),
      dataAnalise: startOfDay(new Date()),
      valorInvestido: parseStringToNumber(data.valorInvestido),
      valorAtualBruto: parseStringToNumber(data.valorAtualBruto),
      rentabilidadeContratada: taxaNominalParaMotor,
      isentoIR: data.isentoIR,
    };

    const calcCompleto = calcularMarcacaoAMercado(inputParaMotor);

    let simIsenta, simTributada;
    if (data.taxaOfertada && parseStringToNumber(data.taxaOfertada) > 0) {
      const taxaDigitadaOferta = parseStringToNumber(data.taxaOfertada);
      const taxaNominalOferta = comporTaxaNominal(
        taxaDigitadaOferta,
        ipcaUtilizado,
      );

      const valLiqAtual = calcCompleto.intermediarios.valorAtualLiquido;
      const anosFaltantes = calcCompleto.intermediarios.anosFaltantes;
      const diasFaltantes = calcCompleto.intermediarios.diasFaltantes;
      const valLiqOrig = calcCompleto.intermediarios.valorFinalLiquidoOriginal;

      simIsenta = simularNovoInvestimento(
        taxaNominalOferta,
        true,
        valLiqAtual,
        anosFaltantes,
        diasFaltantes,
        valLiqOrig,
      );
      simTributada = simularNovoInvestimento(
        taxaNominalOferta,
        false,
        valLiqAtual,
        anosFaltantes,
        diasFaltantes,
        valLiqOrig,
      );
    }

    setResultado({
      core: calcCompleto,
      simulacaoIsenta: simIsenta,
      simulacaoTributada: simTributada,
      montanteFicar: calcCompleto.intermediarios.valorFinalLiquidoOriginal,
      isIPCA,
      ipcaUtilizado,
    });
  };

  const formatInlineRate = (taxaNominalGerada: number) => {
    if (!resultado) return "";
    if (resultado.isIPCA) {
      const taxaReal = extrairTaxaReal(
        taxaNominalGerada,
        resultado.ipcaUtilizado,
      );
      return formatPct(taxaReal);
    }
    return formatPct(taxaNominalGerada);
  };

  const renderCardRate = (taxaNominalGerada: number) => {
    if (!resultado) return null;
    if (resultado.isIPCA) {
      const taxaReal = extrairTaxaReal(
        taxaNominalGerada,
        resultado.ipcaUtilizado,
      );
      return (
        <>
          <span className="text-xl font-bold text-gray-400 tracking-normal mr-1.5">
            IPCA +
          </span>
          <span>{formatPct(taxaReal)}</span>
        </>
      );
    }
    return (
      <>
        <span>{formatPct(taxaNominalGerada)}</span>{" "}
        <span className="text-lg font-semibold text-gray-400 tracking-normal">
          a.a.
        </span>
      </>
    );
  };

  return (
    <div className="max-w-4xl p-6 border border-gray-200 rounded-md bg-calculator-card w-full mx-auto shadow-sm transition-all duration-500">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-calculator-text">
            Dados do seu Título
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Preencha as informações atuais do seu investimento para descobrirmos a
            rentabilidade mínima exigida.
          </p>
        </div>
        
        <div className="flex items-center bg-gray-100 p-1 rounded-md shrink-0 border border-gray-200 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setValue("tipoTitulo", "PREFIXADO")}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-all duration-200 ${
              tipoTituloWatch === "PREFIXADO"
                ? "bg-white text-calculator-text shadow-sm"
                : "text-gray-500 hover:text-calculator-text"
            }`}
          >
            Prefixado
          </button>
          <button
            type="button"
            onClick={() => setValue("tipoTitulo", "IPCA")}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-all duration-200 ${
              tipoTituloWatch === "IPCA"
                ? "bg-white text-calculator-text shadow-sm"
                : "text-gray-500 hover:text-calculator-text"
            }`}
          >
            IPCA +
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input type="hidden" {...register("tipoTitulo")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-calculator-text">
              Data de Aplicação
            </label>
            <input
              {...register("dataAplicacao")}
              onChange={handleDateChange("dataAplicacao")}
              placeholder="dd/mm/aaaa"
              inputMode="numeric"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-primary"
            />
            {errors.dataAplicacao && (
              <span className="text-xs text-calculator-primary font-semibold">
                {errors.dataAplicacao.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-calculator-text">
              Data de Vencimento
            </label>
            <input
              {...register("dataVencimento")}
              onChange={handleDateChange("dataVencimento")}
              placeholder="dd/mm/aaaa"
              inputMode="numeric"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-primary"
            />
            {errors.dataVencimento && (
              <span className="text-xs text-calculator-primary font-semibold">
                {errors.dataVencimento.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-calculator-text">
              Valor Investido (R$)
            </label>
            <input
              {...register("valorInvestido")}
              onChange={handleDecimalChange("valorInvestido")}
              placeholder="Ex: 10.000,00"
              inputMode="numeric"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-primary"
            />
            {errors.valorInvestido && (
              <span className="text-xs text-calculator-primary font-semibold">
                {errors.valorInvestido.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-calculator-text">
              Valor Atual Bruto (R$)
            </label>
            <input
              {...register("valorAtualBruto")}
              onChange={handleDecimalChange("valorAtualBruto")}
              placeholder="Ex: 11.500,50"
              inputMode="numeric"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-primary"
            />
            {errors.valorAtualBruto && (
              <span className="text-xs text-calculator-primary font-semibold">
                {errors.valorAtualBruto.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center h-7">
              <label className="text-sm font-medium text-calculator-text">
                {tipoTituloWatch === "IPCA"
                  ? "Taxa Fixa do IPCA+ (%)"
                  : "Rentabilidade Contratada (% a.a)"}
              </label>
              <div
                className={`flex items-center space-x-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 transition-opacity duration-300 ${
                  tipoTituloWatch === "IPCA"
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none select-none"
                }`}
              >
                <span>IPCA Base:</span>
                <input
                  {...register("taxaInflacao")}
                  onChange={handleDecimalChange("taxaInflacao")}
                  className="w-10 bg-transparent text-center font-semibold text-calculator-text focus:outline-none"
                  tabIndex={tipoTituloWatch === "IPCA" ? 0 : -1}
                />
                <span>%</span>
              </div>
            </div>
            <input
              {...register("rentabilidadeContratada")}
              onChange={handleDecimalChange("rentabilidadeContratada")}
              placeholder="Ex: 12,50"
              inputMode="numeric"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-primary"
            />
            {errors.rentabilidadeContratada && (
              <span className="text-xs text-calculator-primary font-semibold">
                {errors.rentabilidadeContratada.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center h-7">
              <label className="text-sm font-medium text-calculator-text">
                O título atual é isento de Imposto de Renda?
              </label>
            </div>
            <div className="flex items-center bg-gray-100 p-1 rounded-md border border-gray-200 h-10 w-full">
              <input type="checkbox" className="hidden" {...register("isentoIR")} />
              <button
                type="button"
                onClick={() => setValue("isentoIR", false, { shouldValidate: true })}
                className={`flex-1 py-1.5 h-full text-sm font-medium rounded transition-all duration-200 ${
                  !isentoIRWatch
                    ? "bg-white text-calculator-text shadow-sm"
                    : "text-gray-500 hover:text-calculator-text"
                }`}
              >
                Não
              </button>
              <button
                type="button"
                onClick={() => setValue("isentoIR", true, { shouldValidate: true })}
                className={`flex-1 py-1.5 h-full text-sm font-medium rounded transition-all duration-200 ${
                  isentoIRWatch
                    ? "bg-white text-calculator-text shadow-sm"
                    : "text-gray-500 hover:text-calculator-text"
                }`}
              >
                Sim
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 my-6" />

        <div className="bg-white p-4 rounded-md border border-gray-200">
          <div className="space-y-2">
            <label className="text-sm font-bold text-calculator-text">
              Você já tem uma oportunidade em mente? (Opcional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Insira a taxa de um título que você encontrou para projetarmos a
              diferença na prática.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 w-full relative">
                <input
                  {...register("taxaOfertada")}
                  onChange={handleDecimalChange("taxaOfertada")}
                  placeholder={
                    tipoTituloWatch === "IPCA"
                      ? "Nova taxa IPCA+ (%)"
                      : "Rentabilidade da nova oferta (% a.a)"
                  }
                  inputMode="numeric"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-primary"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-calculator-primary text-white hover:bg-calculator-secondary transition-colors font-bold tracking-wide rounded-md h-10 px-8 w-full sm:w-auto shadow-md"
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      </form>

      {resultado && (
        <div className="mt-10 pt-8 border-t border-gray-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-calculator-text flex items-center">
              Rentabilidade Mínima Aceitável
              <div className="relative flex items-center group cursor-help ml-2">
                <Info
                  size={20}
                  className="text-gray-400 hover:text-calculator-primary transition-colors"
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-72 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 font-normal leading-relaxed text-center">
                  Esta é a <strong>TIR Implícita</strong> do negócio. Representa
                  a taxa exata de empate. Se você reinvestir o valor líquido
                  sacado hoje a essa taxa, terá no vencimento os exatos mesmos{" "}
                  {formatBRL(resultado.montanteFicar)} projetados pelo título
                  original.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
              <span className="text-sm text-gray-500 font-medium mb-1">
                Para títulos ISENTOS (Ex: LCI, LCA)
              </span>
              <span className="text-3xl font-black text-calculator-text flex items-baseline">
                {renderCardRate(resultado.core.rentabilidadeMinima.taxaIsenta)}
              </span>
            </div>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
              <span className="text-sm text-gray-500 font-medium mb-1">
                Para títulos TRIBUTADOS (Ex: CDB, Tesouro)
              </span>
              <span className="text-3xl font-black text-calculator-text flex items-baseline">
                {renderCardRate(resultado.core.rentabilidadeMinima.taxaTributada)}
              </span>
            </div>
          </div>

          {resultado.simulacaoIsenta && resultado.simulacaoTributada && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
              <h4 className="text-lg font-bold text-calculator-text mb-4 border-b border-gray-100 pb-2">
                Projeção para a sua oferta de{" "}
                {formatInlineRate(resultado.simulacaoIsenta.taxaOfertada)}
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Se não fizer nada
                  </span>
                  <span className="text-xl font-bold text-gray-600">
                    {formatBRL(resultado.montanteFicar)}
                  </span>
                  <span className="text-sm text-gray-400">
                    Líquido no vencimento
                  </span>
                </div>

                <div className="flex flex-col space-y-1 border-l-0 lg:border-l lg:border-gray-100 lg:pl-6">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Trocando por um Isento
                  </span>
                  <span className="text-xl font-bold text-calculator-text">
                    {formatBRL(resultado.simulacaoIsenta.valorFinalLiquido)}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      resultado.simulacaoIsenta.ganhoReal > 0
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {resultado.simulacaoIsenta.ganhoReal > 0 ? "+" : ""}
                    {formatBRL(resultado.simulacaoIsenta.ganhoReal)}
                  </span>
                </div>

                <div className="flex flex-col space-y-1 border-l-0 lg:border-l lg:border-gray-100 lg:pl-6">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Trocando por Tributado
                  </span>
                  <span className="text-xl font-bold text-calculator-text">
                    {formatBRL(resultado.simulacaoTributada.valorFinalLiquido)}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      resultado.simulacaoTributada.ganhoReal > 0
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {resultado.simulacaoTributada.ganhoReal > 0 ? "+" : ""}
                    {formatBRL(resultado.simulacaoTributada.ganhoReal)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 rounded-md bg-white border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-calculator-text">
              <span>Mostrar cálculos intermediários e detalhes do título</span>
              <span className="transition group-open:rotate-180">
                <ChevronDown size={20} className="text-gray-400" />
              </span>
            </summary>

            <div className="p-4 mt-2 bg-white border border-gray-200 rounded-md text-sm text-gray-600 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-3">
                <p>
                  <strong>Prazo Faltante:</strong>{" "}
                  {resultado.core.intermediarios.anosFaltantes.toFixed(2)} anos
                  ({resultado.core.intermediarios.diasFaltantes} dias exatos)
                </p>
                <p>
                  <strong>Alíquota IR no Resgate Hoje:</strong>{" "}
                  {resultado.core.intermediarios.aliquotaAtual === 0
                    ? "Isento"
                    : resultado.core.intermediarios.lucroAtualBruto <= 0
                      ? "Sem lucro tributável"
                      : `${resultado.core.intermediarios.aliquotaAtual}% sobre o lucro`}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-3">
                <p>
                  <strong>Lucro Bruto Atual:</strong>{" "}
                  {formatBRL(resultado.core.intermediarios.lucroAtualBruto)}
                </p>
                <p>
                  <strong>Imposto Retido se Sacar Hoje:</strong>{" "}
                  {formatBRL(resultado.core.intermediarios.impostoRetidoAtual)}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p className="text-calculator-text font-bold">
                  <strong>Capital para Reinvestir (Líquido Atual):</strong>{" "}
                  {formatBRL(resultado.core.intermediarios.valorAtualLiquido)}
                </p>
                <p className="text-calculator-text font-bold">
                  <strong>Alvo a Bater (Líquido Original):</strong>{" "}
                  {formatBRL(
                    resultado.core.intermediarios.valorFinalLiquidoOriginal,
                  )}
                </p>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}