// ============================================
// Dolce Neves — Tipos da Calculadora de Festas
// ============================================

export type OccasionType =
  | "casamento"
  | "aniversario_infantil"
  | "aniversario_adulto"
  | "corporativo"
  | "cha_bebe"
  | "formatura";

export interface PartyConfig {
  occasion: OccasionType;
  guestCount: number;
}

export interface ProductSuggestion {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  suggestedQuantity: number;
  included: boolean;
}

export interface PartySuggestion {
  totalSweets: number;
  totalWithBuffer: number;
  bufferPercent: number;
  categoryDistribution: {
    category: string;
    percent: number;
    quantity: number;
  }[];
  products: ProductSuggestion[];
  priceEstimate: { min: number; max: number };
  occasion: OccasionType;
  guestCount: number;
}

export interface CalculatorRule {
  sweetsPerPerson: number;
  cakePortionsPerPerson?: number;
  suggestedCategories: string[];
  varietyCount: number;
  bufferPercent: number;
}

export const OCCASION_LABELS: Record<OccasionType, string> = {
  casamento: "Casamento",
  aniversario_infantil: "Aniversário Infantil",
  aniversario_adulto: "Aniversário Adulto",
  corporativo: "Corporativo",
  cha_bebe: "Chá de Bebê",
  formatura: "Formatura",
};

export const OCCASION_ICONS: Record<OccasionType, string> = {
  casamento: "💍",
  aniversario_infantil: "🎂",
  aniversario_adulto: "🥂",
  corporativo: "💼",
  cha_bebe: "👶",
  formatura: "🎓",
};
