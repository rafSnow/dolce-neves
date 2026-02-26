"use client";

import type { BoxConfig } from "@/types/box-builder";
import type { Product } from "@/types/product";
import { CATEGORIES } from "@/types/product";
import { useEffect, useMemo, useState } from "react";
import { ProductPaletteCard } from "./ProductPaletteCard";

interface ProductPaletteProps {
  products: Product[];
  boxConfig: BoxConfig;
  isDragging: boolean;
  isMobile?: boolean;
}

export function ProductPalette({
  products,
  boxConfig,
  isDragging,
  isMobile = false,
}: ProductPaletteProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = localStorage.getItem("dolce-first-drag-done");
      if (done) setShowHint(false);
    }
  }, []);

  // Hide hint after first successful drag
  useEffect(() => {
    if (!isDragging && typeof window !== "undefined") {
      const done = localStorage.getItem("dolce-first-drag-done");
      if (done) setShowHint(false);
    }
  }, [isDragging]);

  // Count how many times each product appears in the box
  const productCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const slot of boxConfig.slots) {
      if (slot.product) {
        map.set(slot.product.id, (map.get(slot.product.id) || 0) + 1);
      }
    }
    return map;
  }, [boxConfig.slots]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
    }
    return filtered;
  }, [products, selectedCategory, searchQuery]);

  // Relevant categories from available products
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return CATEGORIES.filter((c) => cats.has(c));
  }, [products]);

  if (isMobile) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-dolce-marrom">
            Sabores
          </h2>
          {showHint && (
            <span className="text-xs font-body text-dolce-rosa flex items-center gap-1 animate-pulse">
              Arraste para a caixa
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M10 5l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>

        {/* Category pills - horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${
              !selectedCategory
                ? "bg-dolce-rosa text-white"
                : "bg-dolce-marrom/5 text-dolce-marrom/60 hover:bg-dolce-rosa-claro"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? null : cat)
              }
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-dolce-rosa text-white"
                  : "bg-dolce-marrom/5 text-dolce-marrom/60 hover:bg-dolce-rosa-claro"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Horizontal scroll product list */}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {filteredProducts.map((product) => (
            <div key={product.id} className="shrink-0">
              <ProductPaletteCard
                product={product}
                count={productCounts.get(product.id) || 0}
                compact
              />
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p className="font-body text-sm text-dolce-marrom/40 py-4">
              Nenhum sabor encontrado
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dolce-marrom/10 p-4 sticky top-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-bold text-dolce-marrom">
          Sabores
        </h2>
        {showHint && (
          <span className="text-xs font-body text-dolce-rosa flex items-center gap-1 animate-pulse">
            Arraste
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M10 5l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-dolce-marrom/30"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M11 11l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar sabor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm font-body rounded-lg border border-dolce-marrom/10 bg-dolce-creme/50 text-dolce-marrom placeholder:text-dolce-marrom/30 focus:outline-none focus:border-dolce-rosa/50 focus:ring-1 focus:ring-dolce-rosa/20 transition-colors"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-2.5 py-1 rounded-full text-xs font-body font-medium transition-colors ${
            !selectedCategory
              ? "bg-dolce-rosa text-white"
              : "bg-dolce-marrom/5 text-dolce-marrom/60 hover:bg-dolce-rosa-claro"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? null : cat)
            }
            className={`px-2.5 py-1 rounded-full text-xs font-body font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-dolce-rosa text-white"
                : "bg-dolce-marrom/5 text-dolce-marrom/60 hover:bg-dolce-rosa-claro"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product list */}
      <div className="space-y-2 max-h-[calc(100vh-340px)] overflow-y-auto pr-1 scrollbar-thin">
        {filteredProducts.map((product) => (
          <ProductPaletteCard
            key={product.id}
            product={product}
            count={productCounts.get(product.id) || 0}
          />
        ))}
        {filteredProducts.length === 0 && (
          <p className="font-body text-sm text-dolce-marrom/40 text-center py-8">
            Nenhum sabor encontrado
          </p>
        )}
      </div>
    </div>
  );
}
