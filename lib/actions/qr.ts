"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import type {
  Feedback,
  FeedbackFormData,
  QRCode,
  QRCodeSummary,
  QRFilters,
  QRPageData,
} from "@/types/qr";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// ============================================
// Helpers
// ============================================

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

function generateDiscountCode(percent: number): string {
  return `DOLCE${percent}`;
}

/** Client público (anon) para ações sem autenticação */
function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function revalidateQRPaths() {
  revalidatePath("/admin/qrcodes");
  revalidatePath("/admin");
}

// ============================================
// Admin — Gerar QR Code
// ============================================

export async function generateQRCode(
  orderId: string,
  options: { discountPercent?: number; discountDays?: number } = {},
): Promise<{ data?: QRCode; error?: string }> {
  const supabase = createAdminClient();

  const slug = generateSlug();
  const discountPercent = options.discountPercent || 0;
  const discountCode =
    discountPercent > 0 ? generateDiscountCode(discountPercent) : null;
  const discountExpiresAt =
    discountPercent > 0 && options.discountDays
      ? new Date(Date.now() + options.discountDays * 86400000).toISOString()
      : null;

  const { data, error } = await supabase
    .from("qr_codes")
    .insert({
      order_id: orderId,
      slug,
      discount_code: discountCode,
      discount_percent: discountPercent,
      discount_expires_at: discountExpiresAt,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao gerar QR Code:", error.message);
    return {
      error: error.message.includes("duplicate")
        ? "Este pedido já tem um QR Code gerado"
        : "Erro ao gerar QR Code",
    };
  }

  revalidateQRPaths();
  return { data: data as QRCode };
}

// ============================================
// Admin — Listar QR Codes
// ============================================

export async function getQRCodes(
  filters?: QRFilters,
): Promise<{ data?: QRCodeSummary[]; error?: string }> {
  const supabase = createAdminClient();

  let query = supabase.from("qr_code_summary").select("*");

  if (filters?.scanned !== undefined) {
    query = query.eq("scanned", filters.scanned);
  }
  if (filters?.feedbackSubmitted !== undefined) {
    query = query.eq("feedback_submitted", filters.feedbackSubmitted);
  }
  if (filters?.search) {
    query = query.ilike("client_name", `%${filters.search}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar QR Codes:", error.message);
    return { error: "Erro ao buscar QR Codes" };
  }

  return { data: (data || []) as QRCodeSummary[] };
}

// ============================================
// Admin — QR Code por pedido
// ============================================

export async function getQRCodeByOrderId(
  orderId: string,
): Promise<{ data?: QRCode | null; error?: string }> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar QR Code:", error.message);
    return { error: "Erro ao buscar QR Code" };
  }

  return { data: data as QRCode | null };
}

// ============================================
// Admin — Deletar QR Code
// ============================================

export async function deleteQRCode(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("qr_codes").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar QR Code:", error.message);
    return { error: "Erro ao deletar QR Code" };
  }

  revalidateQRPaths();
  return {};
}

// ============================================
// Admin — Stats de QR Codes
// ============================================

export async function getQRStats(): Promise<{
  total: number;
  scanned: number;
  feedbacks: number;
  avgNPS: number | null;
}> {
  const supabase = createAdminClient();

  const { data } = await supabase.from("qr_code_summary").select("*");
  const items = (data || []) as QRCodeSummary[];

  const total = items.length;
  const scanned = items.filter((i) => i.scanned).length;
  const feedbacks = items.filter((i) => i.feedback_submitted).length;
  const scores = items
    .filter((i) => i.nps_score !== null)
    .map((i) => i.nps_score!);
  const avgNPS =
    scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;

  return { total, scanned, feedbacks, avgNPS };
}

// ============================================
// Público — Dados da página de feedback
// ============================================

export async function getQRPageData(
  slug: string,
): Promise<{ data?: QRPageData | null; error?: string }> {
  const supabase = createPublicClient();

  // Buscar QR Code
  const { data: qr, error: qrError } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (qrError || !qr) {
    return { data: null };
  }

  // Buscar pedido
  const { data: order } = await supabase
    .from("orders")
    .select("id, client_name, items, delivery_date, total_price")
    .eq("id", qr.order_id)
    .single();

  if (!order) {
    return { data: null };
  }

  // Buscar feedback (se existir)
  const { data: feedback } = await supabase
    .from("feedbacks")
    .select("*")
    .eq("qr_code_id", qr.id)
    .maybeSingle();

  return {
    data: {
      qr: qr as QRCode,
      order: {
        id: order.id,
        client_name: order.client_name,
        items:
          (order.items as { product_name: string; quantity: number }[]) || [],
        delivery_date: order.delivery_date,
        total_price: order.total_price,
      },
      feedback: feedback as Feedback | null,
    },
  };
}

// ============================================
// Público — Marcar QR como escaneado
// ============================================

export async function markQRScanned(slug: string): Promise<void> {
  const supabase = createPublicClient();

  await supabase
    .from("qr_codes")
    .update({ scanned_at: new Date().toISOString() })
    .eq("slug", slug)
    .is("scanned_at", null);
}

// ============================================
// Público — Enviar feedback
// ============================================

export async function submitFeedback(
  slug: string,
  formData: FeedbackFormData,
): Promise<{ success: boolean; discountCode?: string; error?: string }> {
  const supabase = createPublicClient();

  // Buscar QR Code
  const { data: qr } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!qr) {
    return { success: false, error: "QR Code não encontrado" };
  }

  if (qr.feedback_submitted_at) {
    return {
      success: false,
      error: "Feedback já foi enviado para este pedido",
    };
  }

  // Inserir feedback
  const { error: insertError } = await supabase.from("feedbacks").insert({
    qr_code_id: qr.id,
    order_id: qr.order_id,
    client_name: formData.client_name,
    nps_score: formData.nps_score,
    comment: formData.comment || null,
    would_recommend: formData.would_recommend,
  });

  if (insertError) {
    console.error("Erro ao enviar feedback:", insertError.message);
    return { success: false, error: "Erro ao enviar feedback" };
  }

  // Marcar QR como feedback enviado
  await supabase
    .from("qr_codes")
    .update({ feedback_submitted_at: new Date().toISOString() })
    .eq("id", qr.id);

  return {
    success: true,
    discountCode: qr.discount_code || undefined,
  };
}
