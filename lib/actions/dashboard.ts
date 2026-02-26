"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import type { Order } from "@/types/orders";

// ============================================
// Tipos do Dashboard
// ============================================

export interface DashboardStats {
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  monthRevenue: number;
  avgTicket: number;
  avgNPS: number | null;
  prevMonthOrders: number;
  prevWeekOrders: number;
  yesterdayOrders: number;
  prevMonthRevenue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  percent: number;
}

export interface DashboardAlert {
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  href: string;
}

export interface NPSSummary {
  average: number | null;
  total: number;
  distribution: Record<number, number>;
  recentComments: {
    client_name: string;
    nps_score: number;
    comment: string;
    created_at: string;
  }[];
}

// ============================================
// Helpers
// ============================================

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function startOfWeek(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// ============================================
// Dashboard Stats
// ============================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient();
  const today = startOfDay(new Date());
  const yesterday = addDays(today, -1);
  const weekStart = startOfWeek(today);
  const prevWeekStart = addDays(weekStart, -7);
  const monthStart = startOfMonth(today);
  const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  // Buscar todos os pedidos relevantes (últimos 2 meses)
  const { data: allOrders } = await supabase
    .from("orders")
    .select("delivery_date, total_price, status")
    .gte("delivery_date", formatDate(prevMonthStart))
    .neq("status", "cancelado");

  const orders = (allOrders || []) as {
    delivery_date: string;
    total_price: number;
    status: string;
  }[];

  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);
  const weekStartStr = formatDate(weekStart);
  const prevWeekStartStr = formatDate(prevWeekStart);
  const prevWeekEndStr = formatDate(addDays(weekStart, -1));
  const monthStartStr = formatDate(monthStart);
  const prevMonthStartStr = formatDate(prevMonthStart);
  const prevMonthEndStr = formatDate(prevMonthEnd);

  const todayOrders = orders.filter((o) => o.delivery_date === todayStr).length;
  const yesterdayOrders = orders.filter(
    (o) => o.delivery_date === yesterdayStr,
  ).length;
  const weekOrders = orders.filter(
    (o) => o.delivery_date >= weekStartStr && o.delivery_date <= todayStr,
  ).length;
  const prevWeekOrders = orders.filter(
    (o) =>
      o.delivery_date >= prevWeekStartStr && o.delivery_date <= prevWeekEndStr,
  ).length;
  const monthOrdersList = orders.filter(
    (o) => o.delivery_date >= monthStartStr,
  );
  const monthOrders = monthOrdersList.length;
  const monthRevenue = monthOrdersList.reduce(
    (s, o) => s + Number(o.total_price),
    0,
  );
  const prevMonthOrdersList = orders.filter(
    (o) =>
      o.delivery_date >= prevMonthStartStr &&
      o.delivery_date <= prevMonthEndStr,
  );
  const prevMonthOrders = prevMonthOrdersList.length;
  const prevMonthRevenue = prevMonthOrdersList.reduce(
    (s, o) => s + Number(o.total_price),
    0,
  );
  const avgTicket = monthOrders > 0 ? monthRevenue / monthOrders : 0;

  // NPS médio dos últimos 30 dias
  const { data: feedbacks } = await supabase
    .from("feedbacks")
    .select("nps_score")
    .gte("created_at", addDays(today, -30).toISOString());

  const scores = (feedbacks || []).map(
    (f: { nps_score: number }) => f.nps_score,
  );
  const avgNPS =
    scores.length > 0
      ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
      : null;

  return {
    todayOrders,
    weekOrders,
    monthOrders,
    monthRevenue,
    avgTicket,
    avgNPS,
    prevMonthOrders,
    prevWeekOrders,
    yesterdayOrders,
    prevMonthRevenue,
  };
}

// ============================================
// Faturamento por período
// ============================================

export async function getRevenueByPeriod(days: number): Promise<RevenueData[]> {
  const supabase = createAdminClient();
  const today = startOfDay(new Date());
  const start = addDays(today, -days);

  const { data } = await supabase
    .from("orders")
    .select("delivery_date, total_price")
    .gte("delivery_date", formatDate(start))
    .lte("delivery_date", formatDate(today))
    .neq("status", "cancelado");

  const orders = (data || []) as {
    delivery_date: string;
    total_price: number;
  }[];

  // Agrupar por dia
  const map = new Map<string, { revenue: number; orders: number }>();
  for (let i = 0; i <= days; i++) {
    const d = formatDate(addDays(start, i));
    map.set(d, { revenue: 0, orders: 0 });
  }
  for (const o of orders) {
    const existing = map.get(o.delivery_date);
    if (existing) {
      existing.revenue += Number(o.total_price);
      existing.orders += 1;
    }
  }

  return Array.from(map.entries()).map(([date, val]) => ({
    date,
    revenue: Math.round(val.revenue * 100) / 100,
    orders: val.orders,
  }));
}

// ============================================
// Top Produtos
// ============================================

export async function getTopProducts(limit: number = 5): Promise<TopProduct[]> {
  const supabase = createAdminClient();
  const monthStart = startOfMonth(new Date());

  const { data } = await supabase
    .from("orders")
    .select("items")
    .gte("delivery_date", formatDate(monthStart))
    .neq("status", "cancelado");

  const orders = (data || []) as {
    items: { product_name: string; quantity: number }[];
  }[];

  const productMap = new Map<string, number>();
  let totalQty = 0;

  for (const o of orders) {
    if (Array.isArray(o.items)) {
      for (const item of o.items) {
        const qty = item.quantity || 0;
        productMap.set(
          item.product_name,
          (productMap.get(item.product_name) || 0) + qty,
        );
        totalQty += qty;
      }
    }
  }

  const sorted = Array.from(productMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return sorted.map(([name, quantity]) => ({
    name,
    quantity,
    percent: totalQty > 0 ? Math.round((quantity / totalQty) * 100) : 0,
  }));
}

// ============================================
// Pedidos recentes
// ============================================

export async function getRecentOrders(limit: number = 5): Promise<Order[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data || []) as Order[];
}

// ============================================
// Alertas do Dashboard
// ============================================

export async function getDashboardAlerts(): Promise<DashboardAlert[]> {
  const supabase = createAdminClient();
  const today = startOfDay(new Date());
  const todayStr = formatDate(today);
  const alerts: DashboardAlert[] = [];

  // 🔴 Pedidos vencidos (delivery_date < hoje, não entregue/cancelado)
  const { data: overdue } = await supabase
    .from("orders")
    .select("id")
    .lt("delivery_date", todayStr)
    .not("status", "in", '("entregue","cancelado")');

  if (overdue && overdue.length > 0) {
    alerts.push({
      type: "critical",
      title: `${overdue.length} pedido${overdue.length > 1 ? "s" : ""} em atraso`,
      description: "Data de entrega já passou e o pedido não foi finalizado.",
      href: "/admin/encomendas/pedidos?status=pendente",
    });
  }

  // 🔴 Overbooking nos próximos 7 dias
  const next7 = formatDate(addDays(today, 7));
  const { data: summaries } = await supabase
    .from("daily_order_summary")
    .select("*")
    .gte("delivery_date", todayStr)
    .lte("delivery_date", next7);

  const overbooked = (summaries || []).filter(
    (s: { is_overbooked: boolean }) => s.is_overbooked,
  );
  if (overbooked.length > 0) {
    alerts.push({
      type: "critical",
      title: `${overbooked.length} dia${overbooked.length > 1 ? "s" : ""} com overbooking`,
      description: "Capacidade excedida nos próximos 7 dias.",
      href: "/admin/encomendas/capacidade",
    });
  }

  // 🟡 Dias com >80% ocupação nos próximos 14 dias
  const next14 = formatDate(addDays(today, 14));
  const { data: highOccupancy } = await supabase
    .from("daily_order_summary")
    .select("*")
    .gte("delivery_date", todayStr)
    .lte("delivery_date", next14);

  const nearCapacity = (highOccupancy || []).filter(
    (s: { occupation_percent: number; is_overbooked: boolean }) =>
      s.occupation_percent >= 80 && !s.is_overbooked,
  );
  if (nearCapacity.length > 0) {
    alerts.push({
      type: "warning",
      title: `${nearCapacity.length} dia${nearCapacity.length > 1 ? "s" : ""} acima de 80%`,
      description: "Próximo da capacidade máxima nas próximas 2 semanas.",
      href: "/admin/encomendas/capacidade",
    });
  }

  // 🟡 QR Codes sem scan há >7 dias
  const weekAgo = addDays(today, -7).toISOString();
  const { data: unscannedQR } = await supabase
    .from("qr_codes")
    .select("id")
    .is("scanned_at", null)
    .lt("created_at", weekAgo);

  if (unscannedQR && unscannedQR.length > 0) {
    alerts.push({
      type: "warning",
      title: `${unscannedQR.length} QR Code${unscannedQR.length > 1 ? "s" : ""} sem scan`,
      description: "Gerados há mais de 7 dias e ainda não foram escaneados.",
      href: "/admin/qrcodes",
    });
  }

  // 🔵 Pedidos para entregar amanhã
  const tomorrow = formatDate(addDays(today, 1));
  const { data: tomorrowOrders } = await supabase
    .from("orders")
    .select("id")
    .eq("delivery_date", tomorrow)
    .not("status", "in", '("entregue","cancelado")');

  if (tomorrowOrders && tomorrowOrders.length > 0) {
    alerts.push({
      type: "info",
      title: `${tomorrowOrders.length} entrega${tomorrowOrders.length > 1 ? "s" : ""} amanhã`,
      description: "Confira se está tudo preparado para amanhã.",
      href: "/admin/encomendas/agenda",
    });
  }

  // 🔵 Novos feedbacks hoje
  const todayStart = new Date(today).toISOString();
  const { data: todayFeedbacks } = await supabase
    .from("feedbacks")
    .select("id")
    .gte("created_at", todayStart);

  if (todayFeedbacks && todayFeedbacks.length > 0) {
    alerts.push({
      type: "info",
      title: `${todayFeedbacks.length} feedback${todayFeedbacks.length > 1 ? "s" : ""} novo${todayFeedbacks.length > 1 ? "s" : ""} hoje`,
      description: "Clientes avaliaram pedidos recentes.",
      href: "/admin/qrcodes",
    });
  }

  return alerts;
}

// ============================================
// NPS Summary
// ============================================

export async function getNPSSummary(): Promise<NPSSummary> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("feedbacks")
    .select("*")
    .order("created_at", { ascending: false });

  const feedbacks = (data || []) as {
    client_name: string;
    nps_score: number;
    comment: string | null;
    created_at: string;
  }[];

  const total = feedbacks.length;
  const scores = feedbacks.map((f) => f.nps_score);
  const average = total > 0 ? scores.reduce((a, b) => a + b, 0) / total : null;

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const s of scores) {
    distribution[s] = (distribution[s] || 0) + 1;
  }

  const recentComments = feedbacks
    .filter((f) => f.comment && f.comment.trim().length > 0)
    .slice(0, 3)
    .map((f) => ({
      client_name: f.client_name,
      nps_score: f.nps_score,
      comment: f.comment!,
      created_at: f.created_at,
    }));

  return { average, total, distribution, recentComments };
}
