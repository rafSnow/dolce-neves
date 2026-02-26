"use server";

import { requireAuth } from "@/lib/supabase-admin";
import type {
  CostBreakdown,
  CostConfig,
  Ingredient,
  PriceHealth,
  ProductCostSummary,
  ProductIngredient,
} from "@/types/pricing";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ============================================
// Schemas de validação (zod v4)
// ============================================
const ingredientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  unit: z.enum(["g", "kg", "ml", "l", "un", "cx", "pacote"], {
    error: "Selecione uma unidade válida",
  }),
  cost_per_unit: z.number().positive("Custo deve ser maior que zero"),
  supplier: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

const costConfigSchema = z.object({
  labor_hours: z.number().min(0, "Não pode ser negativo"),
  labor_rate_per_hour: z.number().min(0, "Não pode ser negativo"),
  packaging_cost: z.number().min(0, "Não pode ser negativo"),
  desired_margin_percent: z
    .number()
    .min(0, "Mínimo 0%")
    .max(100, "Máximo 100%"),
});

const productIngredientItemSchema = z.object({
  ingredientId: z.string().uuid(),
  quantity: z.number().positive("Quantidade deve ser maior que zero"),
});

// ============================================
// Ingredientes
// ============================================
export async function getIngredients(): Promise<Ingredient[]> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("name");

  if (error) {
    console.error("Erro ao buscar ingredientes:", error.message);
    throw new Error("Erro ao buscar ingredientes");
  }

  return data as Ingredient[];
}

export async function createIngredient(
  input: unknown,
): Promise<{ success: boolean; data?: Ingredient; error?: string }> {
  const { supabase } = await requireAuth();

  const parsed = ingredientSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dados inválidos",
    };
  }

  const { data, error } = await supabase
    .from("ingredients")
    .insert({
      name: parsed.data.name.trim(),
      unit: parsed.data.unit,
      cost_per_unit: parsed.data.cost_per_unit,
      supplier: parsed.data.supplier?.trim() || null,
      notes: parsed.data.notes?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar ingrediente:", error.message);
    return { success: false, error: "Erro ao salvar ingrediente" };
  }

  revalidatePath("/admin/ingredientes");
  return { success: true, data: data as Ingredient };
}

export async function updateIngredient(
  id: string,
  input: unknown,
): Promise<{ success: boolean; data?: Ingredient; error?: string }> {
  const { supabase } = await requireAuth();

  const parsed = ingredientSchema.partial().safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dados inválidos",
    };
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name.trim();
  if (parsed.data.unit !== undefined) updateData.unit = parsed.data.unit;
  if (parsed.data.cost_per_unit !== undefined)
    updateData.cost_per_unit = parsed.data.cost_per_unit;
  if (parsed.data.supplier !== undefined)
    updateData.supplier = parsed.data.supplier?.trim() || null;
  if (parsed.data.notes !== undefined)
    updateData.notes = parsed.data.notes?.trim() || null;

  const { data, error } = await supabase
    .from("ingredients")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar ingrediente:", error.message);
    return { success: false, error: "Erro ao atualizar ingrediente" };
  }

  // Recalcular custos se o preço mudou
  if (parsed.data.cost_per_unit !== undefined) {
    revalidatePath("/admin/fichas");
    revalidatePath("/admin/relatorio");
  }

  revalidatePath("/admin/ingredientes");
  return { success: true, data: data as Ingredient };
}

export async function deleteIngredient(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAuth();

  // Verificar se está em uso
  const { count } = await supabase
    .from("product_ingredients")
    .select("*", { count: "exact", head: true })
    .eq("ingredient_id", id);

  if (count && count > 0) {
    return {
      success: false,
      error: `Este ingrediente está em ${count} ficha(s) técnica(s). Remova-o das fichas antes de excluir.`,
    };
  }

  const { error } = await supabase.from("ingredients").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir ingrediente:", error.message);
    return { success: false, error: "Erro ao excluir ingrediente" };
  }

  revalidatePath("/admin/ingredientes");
  return { success: true };
}

export async function getIngredientUsageCount(id: string): Promise<number> {
  const { supabase } = await requireAuth();

  const { count } = await supabase
    .from("product_ingredients")
    .select("*", { count: "exact", head: true })
    .eq("ingredient_id", id);

  return count || 0;
}

// ============================================
// Fichas Técnicas (product_ingredients)
// ============================================
export async function getProductIngredients(
  productId: string,
): Promise<ProductIngredient[]> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("product_ingredients")
    .select("*, ingredient:ingredients(*)")
    .eq("product_id", productId)
    .order("created_at");

  if (error) {
    console.error("Erro ao buscar ingredientes do produto:", error.message);
    throw new Error("Erro ao buscar ingredientes do produto");
  }

  return (data || []).map((item: Record<string, unknown>) => ({
    ...item,
    ingredient: item.ingredient as Ingredient | undefined,
  })) as ProductIngredient[];
}

export async function saveProductIngredients(
  productId: string,
  items: unknown,
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAuth();

  const parsed = z.array(productIngredientItemSchema).safeParse(items);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dados inválidos",
    };
  }

  // Deletar todos os existentes e reinserir (upsert completo)
  const { error: deleteError } = await supabase
    .from("product_ingredients")
    .delete()
    .eq("product_id", productId);

  if (deleteError) {
    console.error("Erro ao limpar ingredientes:", deleteError.message);
    return { success: false, error: "Erro ao salvar ingredientes" };
  }

  if (parsed.data.length > 0) {
    const rows = parsed.data.map((item) => ({
      product_id: productId,
      ingredient_id: item.ingredientId,
      quantity: item.quantity,
    }));

    const { error: insertError } = await supabase
      .from("product_ingredients")
      .insert(rows);

    if (insertError) {
      console.error("Erro ao inserir ingredientes:", insertError.message);
      return { success: false, error: "Erro ao salvar ingredientes" };
    }
  }

  revalidatePath(`/admin/fichas/${productId}`);
  revalidatePath("/admin/fichas");
  revalidatePath("/admin/relatorio");
  return { success: true };
}

// ============================================
// Configuração de Custos
// ============================================
export async function getCostConfig(
  productId: string,
): Promise<CostConfig | null> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("cost_configs")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar config de custo:", error.message);
    throw new Error("Erro ao buscar configuração de custo");
  }

  return data as CostConfig | null;
}

export async function saveCostConfig(
  productId: string,
  input: unknown,
): Promise<{ success: boolean; data?: CostConfig; error?: string }> {
  const { supabase } = await requireAuth();

  const parsed = costConfigSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dados inválidos",
    };
  }

  const { data, error } = await supabase
    .from("cost_configs")
    .upsert(
      {
        product_id: productId,
        ...parsed.data,
      },
      { onConflict: "product_id" },
    )
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar config de custo:", error.message);
    return { success: false, error: "Erro ao salvar configuração" };
  }

  revalidatePath(`/admin/fichas/${productId}`);
  revalidatePath("/admin/fichas");
  revalidatePath("/admin/relatorio");
  return { success: true, data: data as CostConfig };
}

// ============================================
// Resumo e Relatório
// ============================================
export async function getProductCostSummary(): Promise<ProductCostSummary[]> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("product_cost_summary")
    .select("*")
    .order("product_name");

  if (error) {
    console.error("Erro ao buscar resumo de custos:", error.message);
    throw new Error("Erro ao buscar resumo de custos");
  }

  return (data || []) as ProductCostSummary[];
}

export async function getCostBreakdown(
  productId: string,
): Promise<CostBreakdown> {
  const { supabase } = await requireAuth();

  // Buscar dados do produto
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, category, price")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    throw new Error("Produto não encontrado");
  }

  // Buscar ingredientes com custo
  const { data: ingredients, error: ingError } = await supabase
    .from("product_ingredients")
    .select("*, ingredient:ingredients(*)")
    .eq("product_id", productId);

  if (ingError) {
    throw new Error("Erro ao buscar ingredientes");
  }

  // Buscar config de custo
  const { data: config } = await supabase
    .from("cost_configs")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();

  const ingredientItems = (ingredients || []).map(
    (item: Record<string, unknown>) => {
      const ing = item.ingredient as Ingredient;
      const qty = Number(item.quantity);
      return {
        ingredient_id: ing.id,
        ingredient_name: ing.name,
        unit: ing.unit,
        quantity: qty,
        cost_per_unit: Number(ing.cost_per_unit),
        subtotal: qty * Number(ing.cost_per_unit),
      };
    },
  );

  const ingredientCost = ingredientItems.reduce(
    (sum: number, i: { subtotal: number }) => sum + i.subtotal,
    0,
  );
  const laborHours = config ? Number(config.labor_hours) : 0;
  const laborRate = config ? Number(config.labor_rate_per_hour) : 0;
  const laborCost = laborHours * laborRate;
  const packagingCost = config ? Number(config.packaging_cost) : 0;
  const totalCost = ingredientCost + laborCost + packagingCost;
  const margin = config ? Number(config.desired_margin_percent) : 30;
  const suggestedPrice =
    margin >= 100 || totalCost === 0
      ? 0
      : Math.round((totalCost / (1 - margin / 100)) * 100) / 100;
  const currentPrice = Number(product.price);
  const priceDiff = currentPrice - suggestedPrice;

  let priceHealth: PriceHealth = "profitable";
  if (totalCost === 0) {
    priceHealth = "profitable";
  } else if (currentPrice < totalCost) {
    priceHealth = "loss";
  } else if (priceDiff < suggestedPrice * 0.1) {
    priceHealth = "break-even";
  }

  return {
    product_id: product.id,
    product_name: product.name,
    product_category: product.category,
    ingredients: ingredientItems,
    ingredient_cost: ingredientCost,
    labor_hours: laborHours,
    labor_rate_per_hour: laborRate,
    labor_cost: laborCost,
    packaging_cost: packagingCost,
    total_cost: totalCost,
    desired_margin_percent: margin,
    suggested_price: suggestedPrice,
    current_price: currentPrice,
    price_difference: priceDiff,
    price_health: priceHealth,
  };
}

// ============================================
// Atualizar preço no cardápio
// ============================================
export async function updateProductPrice(
  productId: string,
  newPrice: number,
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAuth();

  if (newPrice <= 0) {
    return { success: false, error: "Preço deve ser maior que zero" };
  }

  const { error } = await supabase
    .from("products")
    .update({ price: newPrice })
    .eq("id", productId);

  if (error) {
    console.error("Erro ao atualizar preço:", error.message);
    return { success: false, error: "Erro ao atualizar preço" };
  }

  revalidatePath(`/admin/fichas/${productId}`);
  revalidatePath("/admin/fichas");
  revalidatePath("/admin/relatorio");
  revalidatePath("/cardapio");
  return { success: true };
}

// ============================================
// Recálculo em cascata
// ============================================
export async function recalculateAllCosts(): Promise<{
  success: boolean;
  count: number;
}> {
  await requireAuth();

  // A VIEW product_cost_summary já recalcula automaticamente.
  // Aqui só precisamos revalidar os caches do Next.
  revalidatePath("/admin/fichas");
  revalidatePath("/admin/relatorio");

  return { success: true, count: 0 };
}
