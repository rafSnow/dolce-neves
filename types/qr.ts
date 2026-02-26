// ============================================
// Dolce Neves — Tipos do módulo QR Code & Feedback
// ============================================

export type NPSScore = 1 | 2 | 3 | 4 | 5;

export interface QRCode {
  id: string;
  order_id: string;
  slug: string;
  discount_code: string | null;
  discount_percent: number;
  discount_expires_at: string | null;
  scanned_at: string | null;
  feedback_submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  qr_code_id: string;
  order_id: string;
  client_name: string;
  nps_score: NPSScore;
  comment: string | null;
  would_recommend: boolean;
  created_at: string;
}

export interface QRCodeSummary {
  qr_code_id: string;
  slug: string;
  order_id: string;
  client_name: string;
  delivery_date: string;
  scanned: boolean;
  feedback_submitted: boolean;
  nps_score: NPSScore | null;
  comment: string | null;
  would_recommend: boolean | null;
  discount_code: string | null;
  discount_percent: number;
  discount_expires_at: string | null;
  discount_expired: boolean;
  created_at: string;
}

export interface FeedbackFormData {
  client_name: string;
  nps_score: NPSScore;
  comment?: string;
  would_recommend: boolean;
}

export interface QRPageData {
  qr: QRCode;
  order: {
    id: string;
    client_name: string;
    items: { product_name: string; quantity: number }[];
    delivery_date: string;
    total_price: number;
  };
  feedback: Feedback | null;
}

export interface QRFilters {
  scanned?: boolean;
  feedbackSubmitted?: boolean;
  search?: string;
}

export const NPS_LABELS: Record<NPSScore, string> = {
  1: "Podemos melhorar",
  2: "Não foi o que esperava",
  3: "Foi bom!",
  4: "Adorei!",
  5: "Perfeito! Amei tudo!",
};

export const NPS_EMOJIS: Record<NPSScore, string> = {
  1: "😞",
  2: "😐",
  3: "🙂",
  4: "😍",
  5: "🤩",
};
