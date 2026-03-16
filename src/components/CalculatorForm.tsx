"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { parse, isValid, startOfDay } from "date-fns";
import { maskDate, maskDecimal, parseStringToNumber } from "@/utils/formatters";

const formSchema = z
  .object({
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

    if (
      parseStringToNumber(data.valorAtualBruto) <
      parseStringToNumber(data.valorInvestido)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valor atual menor que investido",
        path: ["valorAtualBruto"],
      });
    }
  });

export type CalculatorFormData = z.infer<typeof formSchema>;

export function CalculatorForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CalculatorFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      isentoIR: false,
      taxaOfertada: "",
    },
  });

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
        | "taxaOfertada",
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, maskDecimal(e.target.value), { shouldValidate: true });
    };

  const onSubmit = (data: CalculatorFormData) => {
    console.log("DADOS VALIDADOS PRONTOS PARA O MOTOR:", data);
  };

  return (
    <div className="max-w-4xl p-6 border border-gray-200 rounded-md bg-calculator-card w-full mx-auto shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold tracking-tight text-calculator-text">
          Dados do seu Título
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Preencha as informações atuais do seu investimento para descobrirmos a
          rentabilidade mínima exigida.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-calculator-text flex items-center">
              Data de Aplicação
            </label>
            <input
              {...register("dataAplicacao")}
              onChange={handleDateChange("dataAplicacao")}
              placeholder="dd/mm/aaaa"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-red"
            />
            {errors.dataAplicacao && (
              <span className="text-xs text-calculator-red font-semibold">
                {errors.dataAplicacao.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-calculator-text flex items-center">
              Data de Vencimento
            </label>
            <input
              {...register("dataVencimento")}
              onChange={handleDateChange("dataVencimento")}
              placeholder="dd/mm/aaaa"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-red"
            />
            {errors.dataVencimento && (
              <span className="text-xs text-calculator-red font-semibold">
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
              placeholder="Ex: 10000,00"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-red"
            />
            {errors.valorInvestido && (
              <span className="text-xs text-calculator-red font-semibold">
                {errors.valorInvestido.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-calculator-text">
              Valor Atual Bruto na Corretora (R$)
            </label>
            <input
              {...register("valorAtualBruto")}
              onChange={handleDecimalChange("valorAtualBruto")}
              placeholder="Ex: 11500,50"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-red"
            />
            {errors.valorAtualBruto && (
              <span className="text-xs text-calculator-red font-semibold">
                {errors.valorAtualBruto.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-calculator-text">
              Rentabilidade Contratada (% a.a)
            </label>
            <input
              {...register("rentabilidadeContratada")}
              onChange={handleDecimalChange("rentabilidadeContratada")}
              placeholder="Ex: 12,5"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-red"
            />
            {errors.rentabilidadeContratada && (
              <span className="text-xs text-calculator-red font-semibold">
                {errors.rentabilidadeContratada.message}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 h-10 px-1">
            <input
              type="checkbox"
              id="isentoIR"
              {...register("isentoIR")}
              className="w-4 h-4 text-calculator-red bg-white border-gray-300 rounded focus:ring-calculator-red"
            />
            <label
              htmlFor="isentoIR"
              className="text-sm font-medium text-calculator-text cursor-pointer select-none"
            >
              O título atual é isento de Imposto de Renda?
            </label>
          </div>
        </div>

        <hr className="border-gray-300 my-6" />

        <div className="bg-white p-4 rounded-md border border-gray-200">
          <div className="space-y-2">
            <label className="text-sm font-bold text-calculator-text flex items-center">
              Você já tem uma oportunidade em mente? (Opcional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Insira a taxa de um título que você encontrou para ver se vale a
              pena trocar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 w-full">
                <input
                  {...register("taxaOfertada")}
                  onChange={handleDecimalChange("taxaOfertada")}
                  placeholder="Rentabilidade da nova oferta (% a.a)"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-calculator-red"
                />
              </div>
              <button
                type="submit"
                className="bg-calculator-red text-white hover:bg-red-800 transition-colors font-bold tracking-wide rounded-md h-10 px-8 w-full sm:w-auto shadow-md"
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
