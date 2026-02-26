"use client";

import type { Ingredient } from "@/types/pricing";
import { UNIT_LABELS } from "@/types/pricing";

interface IngredientRowProps {
  ingredient: Ingredient;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredient: Ingredient) => void;
}

export function IngredientRow({
  ingredient,
  onEdit,
  onDelete,
}: IngredientRowProps) {
  const cost = Number(ingredient.cost_per_unit);
  const updatedAt = new Date(ingredient.updated_at);
  const formatted = updatedAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <tr className="hover:bg-dolce-creme/30 transition-colors">
      <td className="px-6 py-3.5 font-body text-sm text-dolce-marrom font-medium">
        {ingredient.name}
      </td>
      <td className="px-6 py-3.5 font-body text-sm text-dolce-marrom/70">
        {UNIT_LABELS[ingredient.unit]}
      </td>
      <td className="px-6 py-3.5 font-body text-sm text-dolce-marrom text-right tabular-nums">
        R$ {cost.toFixed(2).replace(".", ",")}
      </td>
      <td className="px-6 py-3.5 font-body text-xs text-dolce-marrom/50 text-right hidden sm:table-cell">
        {formatted}
      </td>
      <td className="px-6 py-3.5">
        <div className="flex justify-end gap-1">
          <button
            onClick={() => onEdit(ingredient)}
            className="p-2 rounded-lg text-dolce-marrom/40 hover:text-dolce-rosa hover:bg-dolce-rosa/10 transition-colors"
            title="Editar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(ingredient)}
            className="p-2 rounded-lg text-dolce-marrom/40 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Excluir"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
