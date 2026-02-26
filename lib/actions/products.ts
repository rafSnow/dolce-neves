"use server";

import { createServerClient } from "@/lib/supabase-server";
import type { Category, Product } from "@/types/product";

export async function getProducts(
  category?: Category | null,
): Promise<Product[]> {
  const supabase = createServerClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar produtos:", error.message);
    return [];
  }

  return (data as Product[]) ?? [];
}

export async function getCategories(): Promise<
  { category: Category; count: number }[]
> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("active", true);

  if (error) {
    console.error("Erro ao buscar categorias:", error.message);
    return [];
  }

  const countMap = new Map<string, number>();
  for (const row of data ?? []) {
    const cat = row.category as string;
    countMap.set(cat, (countMap.get(cat) ?? 0) + 1);
  }

  return Array.from(countMap.entries()).map(([category, count]) => ({
    category: category as Category,
    count,
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("active", true)
    .single();

  if (error) {
    console.error("Erro ao buscar produto:", error.message);
    return null;
  }

  return (data as Product) ?? null;
}
