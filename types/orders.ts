// ============================================
// Dolce Neves — Tipos do módulo Agenda de Encomendas
// ============================================

export type OrderStatus =
  | "pendente"
  | "em_producao"
  | "pronto"
  | "entregue"
  | "cancelado";

export type OrderSource = "manual" | "whatsapp" | "corporativo" | "site";

export type CalendarView = "month" | "week";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: "Pendente",
  em_producao: "Em Produção",
  pronto: "Pronto",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const ORDER_STATUS_COLORS: Record<
  OrderStatus,
  { bg: string; text: string; border: string }
> = {
  pendente: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-400",
  },
  em_producao: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-500",
  },
  pronto: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-500",
  },
  entregue: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-500",
  },
  cancelado: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-500",
  },
};

export const ORDER_SOURCE_LABELS: Record<OrderSource, string> = {
  manual: "Manual",
  whatsapp: "WhatsApp",
  corporativo: "Corporativo",
  site: "Site",
};

// Transições válidas de status
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pendente: ["em_producao", "cancelado"],
  em_producao: ["pronto", "cancelado"],
  pronto: ["entregue", "cancelado"],
  entregue: [],
  cancelado: [],
};

export interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  items: OrderItem[];
  total_price: number;
  delivery_date: string; // ISO date YYYY-MM-DD
  delivery_time: string | null;
  status: OrderStatus;
  source: OrderSource;
  notes: string | null;
  force_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyCapacity {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  max_units: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyOrderSummary {
  delivery_date: string;
  total_orders: number;
  total_units: number;
  max_units: number;
  available_units: number;
  occupation_percent: number;
  is_overbooked: boolean;
  status_breakdown: Record<OrderStatus, number>;
}

export interface CapacityCheck {
  has_capacity: boolean;
  current_units: number;
  max_units: number;
  available_units: number;
  occupation_percent: number;
}

export interface OrderFormData {
  client_name: string;
  client_phone: string;
  client_email?: string;
  delivery_date: string;
  delivery_time?: string;
  source: OrderSource;
  notes?: string;
  items: OrderItem[];
  force_accepted?: boolean;
}

export interface OrderFilters {
  status?: OrderStatus[];
  source?: OrderSource;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrderStats {
  todayOrders: number;
  weekOrders: number;
  pendingOrders: number;
  expectedRevenue: number;
  overdueOrders: number;
  overbookedDays: number;
}

// Datas especiais para o calendário de capacidade
export const SPECIAL_DATES: Record<
  string,
  { emoji: string; label: string; suggestedCapacity?: number }
> = {
  // 2026
  "2026-04-05": { emoji: "🐣", label: "Páscoa", suggestedCapacity: 200 },
  "2026-06-12": {
    emoji: "💝",
    label: "Dia dos Namorados",
    suggestedCapacity: 180,
  },
  "2026-09-21": {
    emoji: "🍫",
    label: "Dia do Chocolate",
    suggestedCapacity: 150,
  },
  "2026-12-25": { emoji: "🎄", label: "Natal", suggestedCapacity: 250 },
  "2026-12-31": { emoji: "🎊", label: "Réveillon", suggestedCapacity: 200 },
  // 2027
  "2027-03-28": { emoji: "🐣", label: "Páscoa", suggestedCapacity: 200 },
  "2027-06-12": {
    emoji: "💝",
    label: "Dia dos Namorados",
    suggestedCapacity: 180,
  },
  "2027-09-21": {
    emoji: "🍫",
    label: "Dia do Chocolate",
    suggestedCapacity: 150,
  },
  "2027-12-25": { emoji: "🎄", label: "Natal", suggestedCapacity: 250 },
  "2027-12-31": { emoji: "🎊", label: "Réveillon", suggestedCapacity: 200 },
};
