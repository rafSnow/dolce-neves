export type OrderStatus =
  | "novo"
  | "em_analise"
  | "orcamento_enviado"
  | "fechado"
  | "cancelado";

export type EventType =
  | "casamento"
  | "aniversario"
  | "corporativo"
  | "formatura"
  | "outro";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  casamento: "Casamento",
  aniversario: "Aniversário",
  corporativo: "Corporativo",
  formatura: "Formatura",
  outro: "Outro",
};

export interface CorporateOrder {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  estimated_quantity: number;
  event_date: string;
  event_type: EventType;
  message: string | null;
  marketing_consent: boolean;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface CorporateOrderFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  estimated_quantity: number;
  event_date: string;
  event_type: EventType;
  message: string;
  marketing_consent: boolean;
}
