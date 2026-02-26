// ============================================
// Dolce Neves — Calculadora de Festas (lógica pura)
// ============================================

import type {
  CalculatorRule,
  OccasionType,
  PartyConfig,
  PartySuggestion,
  ProductSuggestion,
} from "@/types/party-calculator";

// ============================================
// Regras por tipo de evento
// ============================================

const CALCULATOR_RULES: Record<OccasionType, CalculatorRule> = {
  casamento: {
    sweetsPerPerson: 4,
    cakePortionsPerPerson: 1,
    suggestedCategories: ["Trufas", "Bombons", "Kits Presenteáveis"],
    varietyCount: 4,
    bufferPercent: 10,
  },
  aniversario_infantil: {
    sweetsPerPerson: 5,
    suggestedCategories: ["Docinhos Finos", "Bombons"],
    varietyCount: 3,
    bufferPercent: 15,
  },
  aniversario_adulto: {
    sweetsPerPerson: 3,
    suggestedCategories: ["Trufas", "Bombons"],
    varietyCount: 3,
    bufferPercent: 10,
  },
  corporativo: {
    sweetsPerPerson: 2,
    suggestedCategories: ["Kits Presenteáveis", "Trufas"],
    varietyCount: 2,
    bufferPercent: 5,
  },
  cha_bebe: {
    sweetsPerPerson: 4,
    suggestedCategories: ["Docinhos Finos", "Bombons"],
    varietyCount: 4,
    bufferPercent: 10,
  },
  formatura: {
    sweetsPerPerson: 3,
    suggestedCategories: ["Trufas", "Kits Presenteáveis"],
    varietyCount: 3,
    bufferPercent: 10,
  },
};

export function getCalculatorRule(occasion: OccasionType): CalculatorRule {
  return CALCULATOR_RULES[occasion];
}

// ============================================
// Função principal
// ============================================

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
}

export function calculateParty(
  config: PartyConfig,
  availableProducts: Product[],
): PartySuggestion {
  const rule = CALCULATOR_RULES[config.occasion];
  const totalSweets = config.guestCount * rule.sweetsPerPerson;
  const buffer = Math.ceil(totalSweets * (rule.bufferPercent / 100));
  const totalWithBuffer = totalSweets + buffer;

  // Distribuir por categorias sugeridas
  const numCategories = rule.suggestedCategories.length;
  const categoryDistribution = rule.suggestedCategories.map((cat, i) => {
    // Primeira categoria recebe mais
    const weight = numCategories - i;
    return { category: cat, weight };
  });

  const totalWeight = categoryDistribution.reduce((s, c) => s + c.weight, 0);
  const distribution = categoryDistribution.map((c) => {
    const percent = Math.round((c.weight / totalWeight) * 100);
    const quantity = Math.round((c.weight / totalWeight) * totalWithBuffer);
    return { category: c.category, percent, quantity };
  });

  // Ajustar para o total exato
  const distTotal = distribution.reduce((s, d) => s + d.quantity, 0);
  if (distTotal !== totalWithBuffer && distribution.length > 0) {
    distribution[0].quantity += totalWithBuffer - distTotal;
  }

  // Selecionar produtos sugeridos
  const products: ProductSuggestion[] = [];
  const usedProducts = new Set<string>();

  for (const dist of distribution) {
    // Encontrar produtos dessa categoria
    const categoryProducts = availableProducts.filter(
      (p) =>
        p.category?.toLowerCase() === dist.category.toLowerCase() &&
        !usedProducts.has(p.id),
    );

    if (categoryProducts.length === 0) {
      // Fallback: pegar qualquer produto disponível
      const fallback = availableProducts.filter((p) => !usedProducts.has(p.id));
      if (fallback.length > 0) {
        const product = fallback[0];
        usedProducts.add(product.id);
        products.push({
          id: product.id,
          name: product.name,
          category: product.category || dist.category,
          price: Number(product.price),
          image_url: product.image_url,
          suggestedQuantity: dist.quantity,
          included: true,
        });
      }
      continue;
    }

    // Distribuir a quantidade entre produtos da categoria
    const numProducts = Math.min(
      categoryProducts.length,
      Math.max(1, Math.floor(rule.varietyCount / numCategories)),
    );
    const perProduct = Math.floor(dist.quantity / numProducts);
    let remainder = dist.quantity - perProduct * numProducts;

    for (let i = 0; i < numProducts; i++) {
      const product = categoryProducts[i];
      usedProducts.add(product.id);
      const qty = perProduct + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;

      products.push({
        id: product.id,
        name: product.name,
        category: product.category || dist.category,
        price: Number(product.price),
        image_url: product.image_url,
        suggestedQuantity: qty,
        included: true,
      });
    }
  }

  // Se não temos produtos suficientes, adicionar genéricos
  if (products.length === 0 && availableProducts.length > 0) {
    const perProduct = Math.ceil(
      totalWithBuffer / Math.min(availableProducts.length, rule.varietyCount),
    );
    let remaining = totalWithBuffer;
    for (
      let i = 0;
      i < Math.min(availableProducts.length, rule.varietyCount);
      i++
    ) {
      const p = availableProducts[i];
      const qty = Math.min(perProduct, remaining);
      remaining -= qty;
      products.push({
        id: p.id,
        name: p.name,
        category: p.category || "Geral",
        price: Number(p.price),
        image_url: p.image_url,
        suggestedQuantity: qty,
        included: true,
      });
      if (remaining <= 0) break;
    }
  }

  // Estimativa de preço
  const includedProducts = products.filter((p) => p.included);
  const prices = includedProducts.map((p) => p.price);
  const minPrice =
    prices.length > 0
      ? includedProducts.reduce(
          (s, p) => s + p.suggestedQuantity * Math.min(...prices),
          0,
        )
      : 0;
  const maxPrice =
    prices.length > 0
      ? includedProducts.reduce((s, p) => s + p.suggestedQuantity * p.price, 0)
      : 0;

  return {
    totalSweets,
    totalWithBuffer,
    bufferPercent: rule.bufferPercent,
    categoryDistribution: distribution,
    products,
    priceEstimate: {
      min: Math.round(minPrice * 100) / 100,
      max: Math.round(maxPrice * 100) / 100,
    },
    occasion: config.occasion,
    guestCount: config.guestCount,
  };
}
