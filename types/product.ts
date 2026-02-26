export type Category =
  | "Trufas"
  | "Bombons"
  | "Kits Presenteáveis"
  | "Docinhos Finos";

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  image_url: string;
  active: boolean;
  created_at: string;
}

export type ProductFilter = {
  category: Category | null;
};

export const CATEGORIES: Category[] = [
  "Trufas",
  "Bombons",
  "Kits Presenteáveis",
  "Docinhos Finos",
];

export function categoryToSlug(category: Category): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

export function slugToCategory(slug: string): Category | null {
  const map: Record<string, Category> = {
    trufas: "Trufas",
    bombons: "Bombons",
    "kits-presenteaveis": "Kits Presenteáveis",
    "docinhos-finos": "Docinhos Finos",
  };
  return map[slug] ?? null;
}
