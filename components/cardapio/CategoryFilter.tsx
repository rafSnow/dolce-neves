"use client";

import type { Category } from "@/types/product";
import { categoryToSlug } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface CategoryFilterProps {
  categories: { category: Category; count: number }[];
  activeCategory: Category | null;
}

export function CategoryFilter({
  categories,
  activeCategory,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const totalProducts = categories.reduce((sum, c) => sum + c.count, 0);

  function handleFilter(category: Category | null) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (category) {
        params.set("categoria", categoryToSlug(category));
      } else {
        params.delete("categoria");
      }
      router.push(`/cardapio?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div
      className={`transition-opacity duration-300 ${isPending ? "opacity-60" : "opacity-100"}`}
      role="navigation"
      aria-label="Filtrar por categoria"
    >
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {/* Botao Todos */}
        <button
          onClick={() => handleFilter(null)}
          className={`
            inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-medium
            transition-all duration-300 border
            ${
              activeCategory === null
                ? "bg-dolce-rosa text-white border-dolce-rosa shadow-md"
                : "bg-white text-dolce-marrom/70 border-dolce-rosa/20 hover:border-dolce-rosa/40 hover:text-dolce-marrom"
            }
          `}
          aria-pressed={activeCategory === null}
        >
          Todos
          <span
            className={`
              text-xs px-2 py-0.5 rounded-full font-semibold
              ${
                activeCategory === null
                  ? "bg-white/20 text-white"
                  : "bg-dolce-rosa/10 text-dolce-rosa"
              }
            `}
          >
            {totalProducts}
          </span>
        </button>

        {/* Botoes de categoria */}
        {categories.map(({ category, count }) => (
          <button
            key={category}
            onClick={() => handleFilter(category)}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-medium
              transition-all duration-300 border
              ${
                activeCategory === category
                  ? "bg-dolce-rosa text-white border-dolce-rosa shadow-md"
                  : "bg-white text-dolce-marrom/70 border-dolce-rosa/20 hover:border-dolce-rosa/40 hover:text-dolce-marrom"
              }
            `}
            aria-pressed={activeCategory === category}
          >
            {category}
            <span
              className={`
                text-xs px-2 py-0.5 rounded-full font-semibold
                ${
                  activeCategory === category
                    ? "bg-white/20 text-white"
                    : "bg-dolce-rosa/10 text-dolce-rosa"
                }
              `}
            >
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
