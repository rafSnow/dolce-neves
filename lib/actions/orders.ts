"use server";

import { requireAuth } from "@/lib/supabase-admin";
import type {
  CapacityCheck,
  DailyCapacity,
  DailyOrderSummary,
  Order,
  OrderFilters,
  OrderStats,
  OrderStatus,
} from "@/types/orders";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ============================================
// Schemas de validação (zod v4)
// ============================================
const orderItemSchema = z.object({
  product_name: z.string().min(1, "Nome do produto é obrigatório"),
  quantity: z.number().int().positive(),
  unit_price: z.number().min(0),
});

const orderFormSchema = z.object({
  client_name: z.string().min(2, "Nome do cliente é obrigatório"),
  client_phone: z.string().optional().or(z.literal("")),
  client_email: z
    .string()
    .email("E-mail inválido")
    .optional()
    .or(z.literal("")),
  delivery_date: z.string().min(1, "Data de entrega é obrigatória"),
  delivery_time: z.string().optional().or(z.literal("")),
  source: z.enum(["manual", "whatsapp", "corporativo", "site"], {
    error: "Origem inválida",
  }),
  notes: z.string().max(2000).optional().or(z.literal("")),
  items: z.array(orderItemSchema).min(1, "Adicione pelo menos um item"),
  force_accepted: z.boolean().optional(),
});

function revalidateOrderPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/encomendas/agenda");
  revalidatePath("/admin/encomendas/pedidos");
  revalidatePath("/admin/encomendas/capacidade");
}

function formatDate(date: Date | string): string {
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
}

// ============================================
// Pedidos — CRUD
// ============================================

export async function getOrders(
  filters?: OrderFilters,
): Promise<{ data?: Order[]; error?: string }> {
  const { supabase } = await requireAuth();

  let query = supabase
    .from("orders")
    .select("*")
    .order("delivery_date", { ascending: true })
    .order("delivery_time", { ascending: true, nullsFirst: false });

  if (filters?.status && filters.status.length > 0) {
    query = query.in("status", filters.status);
  }
  if (filters?.source) {
    query = query.eq("source", filters.source);
  }
  if (filters?.startDate) {
    query = query.gte("delivery_date", filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte("delivery_date", filters.endDate);
  }
  if (filters?.search) {
    query = query.ilike("client_name", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar pedidos:", error.message);
    return { error: "Erro ao buscar pedidos" };
  }

  return { data: (data || []) as Order[] };
}

export async function getOrderById(
  id: string,
): Promise<{ data?: Order; error?: string }> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar pedido:", error.message);
    return { error: "Erro ao buscar pedido" };
  }

  return { data: (data as Order) || undefined };
}

export async function getOrdersByDate(date: Date): Promise<Order[]> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("delivery_date", formatDate(date))
    .order("delivery_time", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Erro ao buscar pedidos do dia:", error.message);
    throw new Error("Erro ao buscar pedidos");
  }

  return (data || []) as Order[];
}

export async function getOrdersByDateRange(
  start: Date | string,
  end: Date | string,
): Promise<{ data?: Order[]; error?: string }> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .gte("delivery_date", formatDate(start))
    .lte("delivery_date", formatDate(end))
    .order("delivery_date", { ascending: true })
    .order("delivery_time", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Erro ao buscar pedidos por período:", error.message);
    return { error: "Erro ao buscar pedidos" };
  }

  return { data: (data || []) as Order[] };
}

export async function createOrder(
  input: unknown,
): Promise<{ success: boolean; data?: Order; error?: string }> {
  const { supabase } = await requireAuth();

  const parsed = orderFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dados inválidos",
    };
  }

  const totalPrice = parsed.data.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );

  const { data, error } = await supabase
    .from("orders")
    .insert({
      client_name: parsed.data.client_name.trim(),
      client_phone: parsed.data.client_phone?.trim() || null,
      client_email: parsed.data.client_email?.trim() || null,
      delivery_date: parsed.data.delivery_date,
      delivery_time: parsed.data.delivery_time || null,
      source: parsed.data.source,
      notes: parsed.data.notes?.trim() || null,
      items: parsed.data.items,
      total_price: totalPrice,
      force_accepted: parsed.data.force_accepted || false,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar pedido:", error.message);
    return { success: false, error: "Erro ao criar pedido" };
  }

  revalidateOrderPaths();
  return { success: true, data: data as Order };
}

export async function updateOrder(
  id: string,
  input: unknown,
): Promise<{ success: boolean; data?: Order; error?: string }> {
  const { supabase } = await requireAuth();

  const parsed = orderFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dados inválidos",
    };
  }

  const totalPrice = parsed.data.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );

  const { data, error } = await supabase
    .from("orders")
    .update({
      client_name: parsed.data.client_name.trim(),
      client_phone: parsed.data.client_phone?.trim() || null,
      client_email: parsed.data.client_email?.trim() || null,
      delivery_date: parsed.data.delivery_date,
      delivery_time: parsed.data.delivery_time || null,
      source: parsed.data.source,
      notes: parsed.data.notes?.trim() || null,
      items: parsed.data.items,
      total_price: totalPrice,
      force_accepted: parsed.data.force_accepted || false,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar pedido:", error.message);
    return { success: false, error: "Erro ao atualizar pedido" };
  }

  revalidateOrderPaths();
  return { success: true, data: data as Order };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  noteAppend?: string,
): Promise<{ success: boolean; data?: Order; error?: string }> {
  const { supabase } = await requireAuth();

  // Buscar pedido atual para validar transição
  const { data: current } = await supabase
    .from("orders")
    .select("status, notes")
    .eq("id", id)
    .single();

  if (!current) {
    return { success: false, error: "Pedido não encontrado" };
  }

  const validNext: Record<string, string[]> = {
    pendente: ["em_producao", "cancelado"],
    em_producao: ["pronto", "cancelado"],
    pronto: ["entregue", "cancelado"],
    entregue: [],
    cancelado: [],
  };

  if (!validNext[current.status]?.includes(status)) {
    return {
      success: false,
      error: `Transição de "${current.status}" para "${status}" não é permitida`,
    };
  }

  // Append status change to notes
  const timestamp = new Date().toLocaleString("pt-BR");
  const logEntry = `\n[${timestamp}] Status: ${current.status} → ${status}${noteAppend ? ` — ${noteAppend}` : ""}`;
  const updatedNotes = (current.notes || "") + logEntry;

  const { data, error } = await supabase
    .from("orders")
    .update({ status, notes: updatedNotes })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar status:", error.message);
    return { success: false, error: "Erro ao atualizar status" };
  }

  revalidateOrderPaths();
  return { success: true, data: data as Order };
}

export async function deleteOrder(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAuth();

  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir pedido:", error.message);
    return { success: false, error: "Erro ao excluir pedido" };
  }

  revalidateOrderPaths();
  return { success: true };
}

// ============================================
// Capacidade
// ============================================

export async function getDailyCapacity(
  date: Date,
): Promise<DailyCapacity | null> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("daily_capacity")
    .select("*")
    .eq("date", formatDate(date))
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar capacidade:", error.message);
    throw new Error("Erro ao buscar capacidade");
  }

  return data as DailyCapacity | null;
}

export async function setDailyCapacity(
  date: Date | string,
  maxUnits: number,
  notes?: string,
): Promise<{ success: boolean; data?: DailyCapacity; error?: string }> {
  const { supabase } = await requireAuth();

  if (maxUnits <= 0) {
    return { success: false, error: "Capacidade deve ser maior que zero" };
  }

  const { data, error } = await supabase
    .from("daily_capacity")
    .upsert(
      {
        date: formatDate(date),
        max_units: maxUnits,
        notes: notes || null,
      },
      { onConflict: "date" },
    )
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar capacidade:", error.message);
    return { success: false, error: "Erro ao salvar capacidade" };
  }

  revalidateOrderPaths();
  return { success: true, data: data as DailyCapacity };
}

export async function checkCapacity(
  date: Date | string,
  units: number,
  excludeOrderId?: string,
): Promise<{ data?: CapacityCheck; error?: string }> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase.rpc("check_capacity", {
    p_date: formatDate(date),
    p_units: units,
    p_exclude_order_id: excludeOrderId || null,
  });

  if (error) {
    console.error("Erro ao verificar capacidade:", error.message);
    return {
      data: {
        has_capacity: true,
        current_units: 0,
        max_units: 100,
        available_units: 100,
        occupation_percent: 0,
      },
    };
  }

  return { data: data as CapacityCheck };
}

export async function getDailyOrderSummary(
  start: Date | string,
  end: Date | string,
): Promise<{ data?: DailyOrderSummary[]; error?: string }> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("daily_order_summary")
    .select("*")
    .gte("delivery_date", formatDate(start))
    .lte("delivery_date", formatDate(end))
    .order("delivery_date");

  if (error) {
    console.error("Erro ao buscar resumo diário:", error.message);
    return { data: [] };
  }

  return { data: (data || []) as DailyOrderSummary[] };
}

export async function getCapacityRange(
  start: Date | string,
  end: Date | string,
): Promise<DailyCapacity[]> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("daily_capacity")
    .select("*")
    .gte("date", formatDate(start))
    .lte("date", formatDate(end))
    .order("date");

  if (error) {
    console.error("Erro ao buscar capacidade do período:", error.message);
    return [];
  }

  return (data || []) as DailyCapacity[];
}

// ============================================
// Relatório / Estatísticas
// ============================================

export async function getOrderStats(
  period: "week" | "month" = "week",
): Promise<OrderStats> {
  const { supabase } = await requireAuth();

  const today = new Date();
  const todayStr = formatDate(today);

  // Pedidos para hoje
  const { count: todayCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("delivery_date", todayStr)
    .neq("status", "cancelado");

  // Pedidos para a semana/mês
  const periodEnd = new Date(today);
  if (period === "week") {
    periodEnd.setDate(periodEnd.getDate() + 7);
  } else {
    periodEnd.setDate(periodEnd.getDate() + 30);
  }

  const { count: periodCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("delivery_date", todayStr)
    .lte("delivery_date", formatDate(periodEnd))
    .neq("status", "cancelado");

  // Pedidos pendentes
  const { count: pendingCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pendente");

  // Faturamento previsto (não cancelados, futuros)
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_price")
    .gte("delivery_date", todayStr)
    .neq("status", "cancelado");

  const expectedRevenue = (revenueData || []).reduce(
    (sum, o) => sum + Number(o.total_price || 0),
    0,
  );

  // Pedidos em atraso
  const { count: overdueCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .lt("delivery_date", todayStr)
    .not("status", "in", '("entregue","cancelado")');

  // Dias overbooked nos próximos 30 dias
  const next30 = new Date(today);
  next30.setDate(next30.getDate() + 30);
  const { data: summaryData } = await supabase
    .from("daily_order_summary")
    .select("is_overbooked")
    .gte("delivery_date", todayStr)
    .lte("delivery_date", formatDate(next30))
    .eq("is_overbooked", true);

  return {
    todayOrders: todayCount || 0,
    weekOrders: periodCount || 0,
    pendingOrders: pendingCount || 0,
    expectedRevenue,
    overdueOrders: overdueCount || 0,
    overbookedDays: summaryData?.length || 0,
  };
}

// Busca clientes anteriores para autocomplete
export async function getClientSuggestions(
  query: string,
): Promise<{ data?: { name: string; phone: string; email: string | null }[] }> {
  const { supabase } = await requireAuth();

  if (query.length < 2) return { data: [] };

  const { data, error } = await supabase
    .from("orders")
    .select("client_name, client_phone, client_email")
    .ilike("client_name", `%${query}%`)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return { data: [] };

  // Deduplicate by name
  const seen = new Set<string>();
  return {
    data: (data || [])
      .filter((d) => {
        const key = d.client_name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((d) => ({
        name: d.client_name,
        phone: d.client_phone,
        email: d.client_email,
      })),
  };
}

// Busca produtos para uso no formulário de pedido
export async function getProducts(): Promise<{
  data?: { id: string; name: string; price: number }[];
}> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price")
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("Erro ao buscar produtos:", error.message);
    return { data: [] };
  }

  return {
    data: (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
    })),
  };
}
