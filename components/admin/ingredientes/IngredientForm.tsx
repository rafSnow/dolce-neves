"use client";

import { createIngredient, updateIngredient } from "@/lib/actions/pricing";
import type { Ingredient, IngredientUnit } from "@/types/pricing";
import { UNIT_LABELS } from "@/types/pricing";
import { useState } from "react";

const unitOptions: IngredientUnit[] = [
  "kg",
  "g",
  "l",
  "ml",
  "un",
  "cx",
  "pacote",
];

interface IngredientFormProps {
  ingredient: Ingredient | null;
  onClose: () => void;
  onSuccess: (saved: Ingredient, isNew: boolean) => void;
}

export function IngredientForm({
  ingredient,
  onClose,
  onSuccess,
}: IngredientFormProps) {
  const isEdit = !!ingredient;
  const [name, setName] = useState(ingredient?.name ?? "");
  const [unit, setUnit] = useState<IngredientUnit>(ingredient?.unit ?? "kg");
  const [costPerUnit, setCostPerUnit] = useState(
    ingredient ? String(ingredient.cost_per_unit) : "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cost = parseFloat(costPerUnit.replace(",", "."));
      if (isNaN(cost) || cost <= 0) {
        setError("Custo deve ser maior que zero.");
        setLoading(false);
        return;
      }

      if (isEdit && ingredient) {
        const result = await updateIngredient(ingredient.id, {
          name: name.trim(),
          unit,
          cost_per_unit: cost,
        });
        if (!result.success || !result.data) {
          setError(result.error || "Erro ao salvar ingrediente.");
          return;
        }
        onSuccess(result.data, false);
      } else {
        const result = await createIngredient({
          name: name.trim(),
          unit,
          cost_per_unit: cost,
        });
        if (!result.success || !result.data) {
          setError(result.error || "Erro ao salvar ingrediente.");
          return;
        }
        onSuccess(result.data, true);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao salvar ingrediente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="font-display text-lg text-dolce-marrom font-bold mb-4">
          {isEdit ? "Editar ingrediente" : "Novo ingrediente"}
        </h2>

        {isEdit && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <p className="font-body text-xs text-amber-800">
              ⚠️ Alterar o custo irá recalcular automaticamente todas as fichas
              técnicas que usam este ingrediente.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-body text-sm font-medium text-dolce-marrom mb-1">
              Nome
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Farinha de trigo"
              className="w-full px-4 py-2.5 rounded-xl border border-dolce-marrom/10 bg-dolce-creme/30 font-body text-sm placeholder:text-dolce-marrom/30 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 focus:border-dolce-rosa transition-colors"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block font-body text-sm font-medium text-dolce-marrom mb-1">
              Unidade de medida
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as IngredientUnit)}
              className="w-full px-4 py-2.5 rounded-xl border border-dolce-marrom/10 bg-dolce-creme/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 focus:border-dolce-rosa transition-colors"
            >
              {unitOptions.map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>

          {/* Cost */}
          <div>
            <label className="block font-body text-sm font-medium text-dolce-marrom mb-1">
              Custo por unidade (R$)
            </label>
            <input
              type="text"
              inputMode="decimal"
              required
              value={costPerUnit}
              onChange={(e) => setCostPerUnit(e.target.value)}
              placeholder="Ex: 5.90"
              className="w-full px-4 py-2.5 rounded-xl border border-dolce-marrom/10 bg-dolce-creme/30 font-body text-sm placeholder:text-dolce-marrom/30 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 focus:border-dolce-rosa transition-colors"
            />
          </div>

          {/* Error */}
          {error && <p className="font-body text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl font-body text-sm text-dolce-marrom/70 hover:bg-dolce-marrom/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-dolce-rosa text-white font-body text-sm font-medium hover:bg-dolce-rosa/90 disabled:opacity-50 transition-colors"
            >
              {loading
                ? "Salvando..."
                : isEdit
                  ? "Salvar alterações"
                  : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
