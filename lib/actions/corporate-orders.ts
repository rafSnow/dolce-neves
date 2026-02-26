"use server";

import { createServerClient } from "@/lib/supabase-server";
import type { CorporateOrderFormData } from "@/types/corporate-order";
import { z } from "zod";

const corporateOrderSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo")
    .transform((v) => v.trim()),
  company: z
    .string()
    .min(2, "Empresa deve ter pelo menos 2 caracteres")
    .max(100, "Nome da empresa muito longo")
    .transform((v) => v.trim()),
  email: z
    .string()
    .email("E-mail inválido")
    .max(200, "E-mail muito longo")
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(20, "Telefone muito longo")
    .transform((v) => v.trim()),
  estimated_quantity: z
    .number()
    .int({ error: "Quantidade deve ser um número inteiro" })
    .min(50, { error: "Quantidade mínima: 50 unidades" }),
  event_date: z.string().refine(
    (val) => {
      const date = new Date(val);
      const now = new Date();
      const minDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return date >= minDate;
    },
    { message: "A data do evento deve ser no mínimo 7 dias a partir de hoje" },
  ),
  event_type: z.enum(
    ["casamento", "aniversario", "corporativo", "formatura", "outro"],
    { error: "Selecione o tipo de evento" },
  ),
  message: z
    .string()
    .max(500, "Mensagem pode ter no máximo 500 caracteres")
    .transform((v) => v.trim())
    .default(""),
  marketing_consent: z.literal(true, {
    error: "Você precisa aceitar para prosseguir",
  }),
});

function sanitize(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/[<>]/g, "");
}

async function sendAdminNotification(data: CorporateOrderFormData) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!adminEmail || !resendKey) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "Dolce Neves <onboarding@resend.dev>",
      to: adminEmail,
      subject: `Novo Pedido Corporativo — ${data.company}`,
      html: `
        <h2>Novo pedido corporativo recebido!</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Nome</td><td style="padding:8px;border-bottom:1px solid #eee;">${sanitize(data.name)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Empresa</td><td style="padding:8px;border-bottom:1px solid #eee;">${sanitize(data.company)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">E-mail</td><td style="padding:8px;border-bottom:1px solid #eee;">${sanitize(data.email)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Telefone</td><td style="padding:8px;border-bottom:1px solid #eee;">${sanitize(data.phone)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Quantidade</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.estimated_quantity}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Data do Evento</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.event_date}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Tipo</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.event_type}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Mensagem</td><td style="padding:8px;border-bottom:1px solid #eee;">${sanitize(data.message || "—")}</td></tr>
        </table>
      `,
    });
  } catch (err) {
    console.error("Erro ao enviar email de notificação:", err);
  }
}

export async function submitCorporateOrder(
  data: CorporateOrderFormData,
): Promise<{ success: boolean; error?: string }> {
  // Validação server-side com zod
  const parsed = corporateOrderSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { success: false, error: firstError?.message || "Dados inválidos" };
  }

  const sanitizedData = {
    name: sanitize(parsed.data.name),
    company: sanitize(parsed.data.company),
    email: parsed.data.email,
    phone: sanitize(parsed.data.phone),
    estimated_quantity: parsed.data.estimated_quantity,
    event_date: parsed.data.event_date,
    event_type: parsed.data.event_type,
    message: parsed.data.message ? sanitize(parsed.data.message) : null,
    marketing_consent: parsed.data.marketing_consent,
  };

  try {
    const supabase = createServerClient();

    const { error } = await supabase
      .from("corporate_orders")
      .insert(sanitizedData);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return {
        success: false,
        error: "Erro ao salvar o pedido. Tente novamente.",
      };
    }

    // Enviar notificação em background (não bloqueia resposta)
    sendAdminNotification(sanitizedData as CorporateOrderFormData).catch(
      () => {},
    );

    return { success: true };
  } catch (err) {
    console.error("Erro inesperado:", err);
    return {
      success: false,
      error: "Erro inesperado. Tente novamente em instantes.",
    };
  }
}
