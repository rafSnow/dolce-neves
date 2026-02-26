"use client";

import { submitCorporateOrder } from "@/lib/actions/corporate-orders";
import {
  EVENT_TYPE_LABELS,
  type CorporateOrderFormData,
  type EventType,
} from "@/types/corporate-order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CorporateSuccess } from "./CorporateSuccess";
import { FormField } from "./FormField";

// Client-side schema (mirrors server but for instant feedback)
const step1Schema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  company: z.string().min(2, "Empresa deve ter pelo menos 2 caracteres"),
  event_type: z.enum(
    ["casamento", "aniversario", "corporativo", "formatura", "outro"],
    {
      error: "Selecione o tipo de evento",
    },
  ),
  event_date: z
    .string()
    .min(1, "Informe a data do evento")
    .refine(
      (val) => {
        const date = new Date(val);
        const min = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        return date >= min;
      },
      { message: "Data deve ser no mínimo 7 dias a partir de hoje" },
    ),
  estimated_quantity: z
    .number({ error: "Informe uma quantidade" })
    .int({ error: "Quantidade deve ser um número inteiro" })
    .min(50, { error: "Quantidade mínima: 50 unidades" }),
});

const step2Schema = z.object({
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  message: z.string().max(500, "Máximo 500 caracteres"),
  marketing_consent: z.literal(true, {
    error: "Você precisa aceitar para prosseguir",
  }),
});

const fullSchema = step1Schema.merge(step2Schema);

type FormData = z.infer<typeof fullSchema>;

// Minimum event date (7 days from now)
function getMinDate(): string {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return d.toISOString().split("T")[0];
}

// Phone mask: (XX) XXXXX-XXXX
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function CorporateForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      company: "",
      event_type: undefined,
      event_date: "",
      estimated_quantity: undefined,
      email: "",
      phone: "",
      message: "",
      marketing_consent: undefined,
    },
  });

  const messageValue = watch("message") || "";

  const handleNext = async () => {
    const valid = await trigger([
      "name",
      "company",
      "event_type",
      "event_date",
      "estimated_quantity",
    ]);
    if (valid) {
      setStep(2);
      setServerError(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await submitCorporateOrder(data as CorporateOrderFormData);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setServerError(result.error || "Erro ao enviar. Tente novamente.");
      }
    } catch {
      setServerError("Erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <CorporateSuccess />;
  }

  return (
    <section id="formulario" className="bg-white py-16 md:py-24 scroll-mt-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl text-dolce-marrom mb-2">
            Solicite seu Orçamento
          </h2>
          <p className="font-body text-dolce-marrom/60 text-sm">
            Preencha o formulário e retornaremos em até 48 horas úteis.
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="flex items-center gap-2 mb-8 max-w-xs mx-auto"
          aria-label={`Etapa ${step} de 2`}
        >
          <div className="flex-1 h-1.5 rounded-full bg-dolce-rosa transition-all duration-500" />
          <div
            className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step === 2 ? "bg-dolce-rosa" : "bg-dolce-marrom/10"}`}
          />
          <span className="text-xs font-body text-dolce-marrom/50 ml-2">
            {step}/2
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ============ STEP 1 ============ */}
          <div className={step === 1 ? "space-y-5 animate-fadeIn" : "hidden"}>
            <FormField
              label="Seu Nome"
              name="name"
              required
              placeholder="Maria Silva"
              error={errors.name?.message}
              register={register("name")}
            />

            <FormField
              label="Empresa / Organização"
              name="company"
              required
              placeholder="Nome da empresa"
              error={errors.company?.message}
              register={register("company")}
            />

            <FormField
              label="Tipo de Evento"
              name="event_type"
              type="select"
              required
              error={errors.event_type?.message}
              register={register("event_type")}
            >
              <option value="">Selecione...</option>
              {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Data do Evento"
                name="event_date"
                type="date"
                required
                min={getMinDate()}
                hint="Mínimo 7 dias de antecedência"
                error={errors.event_date?.message}
                register={register("event_date")}
              />

              <FormField
                label="Quantidade Estimada"
                name="estimated_quantity"
                type="number"
                required
                min={50}
                placeholder="50"
                hint="Mínimo 50 unidades"
                error={errors.estimated_quantity?.message}
                register={register("estimated_quantity", {
                  valueAsNumber: true,
                })}
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-dolce-rosa text-white font-body font-semibold py-3.5 rounded-xl hover:bg-dolce-rosa/90 transition-colors duration-300 mt-2"
            >
              Próxima Etapa →
            </button>
          </div>

          {/* ============ STEP 2 ============ */}
          <div className={step === 2 ? "space-y-5 animate-fadeIn" : "hidden"}>
            <FormField
              label="E-mail"
              name="email"
              type="email"
              required
              placeholder="seuemail@empresa.com"
              error={errors.email?.message}
              register={register("email")}
            />

            <FormField
              label="Telefone / WhatsApp"
              name="phone"
              type="tel"
              required
              placeholder="(11) 99999-9999"
              error={errors.phone?.message}
              register={register("phone", {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setValue("phone", formatPhone(e.target.value));
                },
              })}
            />

            <FormField
              label="Mensagem (opcional)"
              name="message"
              type="textarea"
              placeholder="Descreva detalhes como sabores preferidos, cores, tema do evento..."
              maxLength={500}
              currentLength={messageValue.length}
              error={errors.message?.message}
              register={register("message")}
            />

            <FormField
              label="Concordo em receber o orçamento e comunicações da Dolce Neves por e-mail. Posso cancelar a qualquer momento."
              name="marketing_consent"
              type="checkbox"
              required
              error={errors.marketing_consent?.message}
              register={register("marketing_consent")}
            />

            {/* Server error */}
            {serverError && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-sm font-body rounded-xl px-4 py-3"
              >
                {serverError}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-white text-dolce-marrom font-body font-semibold py-3.5 rounded-xl border border-dolce-marrom/20 hover:bg-dolce-rosa-claro transition-colors duration-300"
              >
                ← Voltar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] bg-dolce-rosa text-white font-body font-semibold py-3.5 rounded-xl hover:bg-dolce-rosa/90 transition-colors duration-300 disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  "Enviar Pedido"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 mt-8 text-dolce-marrom/40">
          <div className="flex items-center gap-1.5 text-xs font-body">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Dados seguros
          </div>
          <div className="flex items-center gap-1.5 text-xs font-body">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            LGPD
          </div>
          <div className="flex items-center gap-1.5 text-xs font-body">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            48h retorno
          </div>
        </div>
      </div>
    </section>
  );
}
