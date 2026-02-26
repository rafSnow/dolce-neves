// ============================================
// Dolce Neves — Tipos do módulo Ficha Técnica & Precificação
// ============================================

export type IngredientUnit = "g" | "kg" | "ml" | "l" | "un" | "cx" | "pacote";

export const UNIT_LABELS: Record<IngredientUnit, string> = {
  g: "Gramas (g)",
  kg: "Quilogramas (kg)",
  ml: "Mililitros (ml)",
  l: "Litros (l)",
  un: "Unidade (un)",
  cx: "Caixa (cx)",
  pacote: "Pacote",
};

export interface Ingredient {
  id: string;
  name: string;
  unit: IngredientUnit;
  cost_per_unit: number;
  supplier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductIngredient {
  id: string;
  product_id: string;
  ingredient_id: string;
  quantity: number;
  created_at: string;
  ingredient?: Ingredient;
}

export interface CostConfig {
  id: string;
  product_id: string;
  labor_hours: number;
  labor_rate_per_hour: number;
  packaging_cost: number;
  desired_margin_percent: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCostSummary {
  product_id: string;
  product_name: string;
  product_category: string;
  ingredient_cost: number;
  labor_cost: number;
  packaging_cost: number;
  total_cost: number;
  desired_margin_percent: number;
  suggested_price: number;
  current_price: number;
  price_difference: number;
  is_profitable: boolean;
}

export interface CostBreakdown {
  product_id: string;
  product_name: string;
  product_category: string;
  ingredients: {
    ingredient_id: string;
    ingredient_name: string;
    unit: IngredientUnit;
    quantity: number;
    cost_per_unit: number;
    subtotal: number;
  }[];
  ingredient_cost: number;
  labor_hours: number;
  labor_rate_per_hour: number;
  labor_cost: number;
  packaging_cost: number;
  total_cost: number;
  desired_margin_percent: number;
  suggested_price: number;
  current_price: number;
  price_difference: number;
  price_health: PriceHealth;
}

export type PriceHealth = "profitable" | "break-even" | "loss";

export type CreateIngredientDTO = {
  name: string;
  unit: IngredientUnit;
  cost_per_unit: number;
  supplier?: string;
  notes?: string;
};

export type UpdateIngredientDTO = Partial<CreateIngredientDTO>;

export type CostConfigDTO = {
  labor_hours: number;
  labor_rate_per_hour: number;
  packaging_cost: number;
  desired_margin_percent: number;
};
