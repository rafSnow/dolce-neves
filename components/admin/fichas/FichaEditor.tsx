"use client";

import {
  saveCostConfig,
  saveProductIngredients,
  updateProductPrice,
} from "@/lib/actions/pricing";
import type {
  CostBreakdown,
  CostConfig,
  Ingredient,
  IngredientUnit,
  ProductIngredient,
} from "@/types/pricing";
import { UNIT_LABELS } from "@/types/pricing";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface FichaEditorProps {
  productId: string;
  breakdown: CostBreakdown;
  allIngredients: Ingredient[];
  initialProductIngredients: ProductIngredient[];
  initialCostConfig: CostConfig | null;
}

type RecipeItem = {
  ingredientId: string;
  quantity: number;
};

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function FichaEditor({
  productId,
  breakdown,
  allIngredients,
  initialProductIngredients,
  initialCostConfig,
}: FichaEditorProps) {
  const router = useRouter();

  // ---- Section 1: Receita (ingredientes) ----
  const [recipe, setRecipe] = useState<RecipeItem[]>(
    initialProductIngredients.map((pi) => ({
      ingredientId: pi.ingredient_id,
      quantity: Number(pi.quantity),
    })),
  );
  const [recipeSaving, setRecipeSaving] = useState(false);
  const [recipeSaved, setRecipeSaved] = useState(false);
  const recipeTimer = useRef<ReturnType<typeof setTimeout>>();

  // ---- Section 2: Custos adicionais ----
  const [laborHours, setLaborHours] = useState(
    initialCostConfig?.labor_hours ?? 0,
  );
  const [laborRate, setLaborRate] = useState(
    initialCostConfig?.labor_rate_per_hour ?? 0,
  );
  const [packagingCost, setPackagingCost] = useState(
    initialCostConfig?.packaging_cost ?? 0,
  );
  const [costSaving, setCostSaving] = useState(false);
  const [costSaved, setCostSaved] = useState(false);
  const costTimer = useRef<ReturnType<typeof setTimeout>>();

  // ---- Section 3: Margem e preço ----
  const [margin, setMargin] = useState(
    initialCostConfig?.desired_margin_percent ?? 30,
  );
  const [priceSaving, setPriceSaving] = useState(false);
  const [priceConfirm, setPriceConfirm] = useState(false);
  const [priceUpdated, setPriceUpdated] = useState(false);

  // Cost calculations (client-side mirror)
  const ingredientCost = recipe.reduce((sum, item) => {
    const ing = allIngredients.find((i) => i.id === item.ingredientId);
    if (!ing) return sum;
    return sum + item.quantity * Number(ing.cost_per_unit);
  }, 0);
  const laborCost = laborHours * laborRate;
  const totalCost = ingredientCost + laborCost + packagingCost;
  const suggestedPrice =
    margin >= 100 || totalCost === 0
      ? 0
      : Math.round((totalCost / (1 - margin / 100)) * 100) / 100;
  const currentPrice = Number(breakdown.current_price);

  // Debounced save for recipe
  const saveRecipe = useCallback(
    async (items: RecipeItem[]) => {
      setRecipeSaving(true);
      setRecipeSaved(false);
      const result = await saveProductIngredients(
        productId,
        items.map((i) => ({
          ingredientId: i.ingredientId,
          quantity: i.quantity,
        })),
      );
      setRecipeSaving(false);
      if (result.success) {
        setRecipeSaved(true);
        setTimeout(() => setRecipeSaved(false), 2000);
      }
    },
    [productId],
  );

  function updateRecipeItem(
    index: number,
    field: keyof RecipeItem,
    value: string | number,
  ) {
    setRecipe((prev) => {
      const next = [...prev];
      if (field === "ingredientId") {
        next[index] = { ...next[index], ingredientId: value as string };
      } else {
        next[index] = { ...next[index], quantity: Number(value) || 0 };
      }
      // Debounce save
      clearTimeout(recipeTimer.current);
      recipeTimer.current = setTimeout(() => saveRecipe(next), 1000);
      return next;
    });
  }

  function addRecipeItem() {
    const usedIds = recipe.map((r) => r.ingredientId);
    const available = allIngredients.find((i) => !usedIds.includes(i.id));
    if (!available) return;
    const next = [...recipe, { ingredientId: available.id, quantity: 0 }];
    setRecipe(next);
  }

  function removeRecipeItem(index: number) {
    const next = recipe.filter((_, i) => i !== index);
    setRecipe(next);
    clearTimeout(recipeTimer.current);
    recipeTimer.current = setTimeout(() => saveRecipe(next), 500);
  }

  // Debounced save for cost config
  const saveCosts = useCallback(
    async (lh: number, lr: number, pkg: number, mgn: number) => {
      setCostSaving(true);
      setCostSaved(false);
      const result = await saveCostConfig(productId, {
        labor_hours: lh,
        labor_rate_per_hour: lr,
        packaging_cost: pkg,
        desired_margin_percent: mgn,
      });
      setCostSaving(false);
      if (result.success) {
        setCostSaved(true);
        setTimeout(() => setCostSaved(false), 2000);
      }
    },
    [productId],
  );

  function handleCostChange(
    setter: (v: number) => void,
    value: string,
    fieldIndex: number,
  ) {
    const num = parseFloat(value.replace(",", ".")) || 0;
    setter(num);

    clearTimeout(costTimer.current);
    costTimer.current = setTimeout(() => {
      // Access latest values via closure workaround
      const values = [laborHours, laborRate, packagingCost, margin];
      values[fieldIndex] = num;
      saveCosts(values[0], values[1], values[2], values[3]);
    }, 1000);
  }

  // Save margin when slider changes
  useEffect(() => {
    clearTimeout(costTimer.current);
    costTimer.current = setTimeout(() => {
      saveCosts(laborHours, laborRate, packagingCost, margin);
    }, 800);
    return () => clearTimeout(costTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [margin]);

  // Update price
  async function handleUpdatePrice() {
    setPriceSaving(true);
    const result = await updateProductPrice(productId, suggestedPrice);
    setPriceSaving(false);
    setPriceConfirm(false);
    if (result.success) {
      setPriceUpdated(true);
      setTimeout(() => setPriceUpdated(false), 3000);
      router.refresh();
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimeout(recipeTimer.current);
      clearTimeout(costTimer.current);
    };
  }, []);

  const usedIngredientIds = recipe.map((r) => r.ingredientId);

  return (
    <div className="space-y-6">
      {/* ==============================
          Section 1: Receita
         ============================== */}
      <section className="bg-white rounded-2xl border border-dolce-marrom/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-dolce-marrom font-semibold">
            Receita (Ingredientes)
          </h2>
          <div className="flex items-center gap-2">
            {recipeSaving && (
              <span className="font-body text-xs text-dolce-marrom/40 animate-pulse">
                Salvando...
              </span>
            )}
            {recipeSaved && (
              <span className="font-body text-xs text-emerald-600">
                ✓ Salvo
              </span>
            )}
          </div>
        </div>

        {recipe.length === 0 ? (
          <p className="font-body text-sm text-dolce-marrom/40 py-4">
            Nenhum ingrediente adicionado à receita.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b border-dolce-marrom/5">
                  <th className="text-left px-3 py-2 font-body text-xs font-semibold text-dolce-marrom/50 uppercase">
                    Ingrediente
                  </th>
                  <th className="text-left px-3 py-2 font-body text-xs font-semibold text-dolce-marrom/50 uppercase w-28">
                    Qtd
                  </th>
                  <th className="text-left px-3 py-2 font-body text-xs font-semibold text-dolce-marrom/50 uppercase w-20">
                    Unid.
                  </th>
                  <th className="text-right px-3 py-2 font-body text-xs font-semibold text-dolce-marrom/50 uppercase w-28">
                    Subtotal
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-dolce-marrom/5">
                {recipe.map((item, index) => {
                  const ing = allIngredients.find(
                    (i) => i.id === item.ingredientId,
                  );
                  const subtotal = ing
                    ? item.quantity * Number(ing.cost_per_unit)
                    : 0;

                  return (
                    <tr key={index} className="group">
                      <td className="px-3 py-2">
                        <select
                          value={item.ingredientId}
                          onChange={(e) =>
                            updateRecipeItem(
                              index,
                              "ingredientId",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg border border-dolce-marrom/10 bg-dolce-creme/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 transition-colors"
                        >
                          {allIngredients
                            .filter(
                              (i) =>
                                i.id === item.ingredientId ||
                                !usedIngredientIds.includes(i.id),
                            )
                            .map((i) => (
                              <option key={i.id} value={i.id}>
                                {i.name}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity || ""}
                          onChange={(e) =>
                            updateRecipeItem(index, "quantity", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-dolce-marrom/10 bg-dolce-creme/30 font-body text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 transition-colors"
                        />
                      </td>
                      <td className="px-3 py-2 font-body text-xs text-dolce-marrom/50">
                        {ing ? UNIT_LABELS[ing.unit as IngredientUnit] : "—"}
                      </td>
                      <td className="px-3 py-2 font-body text-sm text-dolce-marrom text-right tabular-nums">
                        {formatBRL(subtotal)}
                      </td>
                      <td className="px-1 py-2">
                        <button
                          onClick={() => removeRecipeItem(index)}
                          className="p-1.5 rounded-lg text-dolce-marrom/30 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          title="Remover"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-dolce-marrom/10">
                  <td
                    colSpan={3}
                    className="px-3 py-2 font-body text-sm font-semibold text-dolce-marrom"
                  >
                    Total ingredientes
                  </td>
                  <td className="px-3 py-2 font-body text-sm font-semibold text-dolce-marrom text-right tabular-nums">
                    {formatBRL(ingredientCost)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <button
          onClick={addRecipeItem}
          disabled={usedIngredientIds.length >= allIngredients.length}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-dolce-marrom/20 text-dolce-marrom/50 hover:border-dolce-rosa hover:text-dolce-rosa font-body text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar ingrediente
        </button>
      </section>

      {/* ==============================
          Section 2: Custos adicionais
         ============================== */}
      <section className="bg-white rounded-2xl border border-dolce-marrom/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-dolce-marrom font-semibold">
            Custos Adicionais
          </h2>
          <div className="flex items-center gap-2">
            {costSaving && (
              <span className="font-body text-xs text-dolce-marrom/40 animate-pulse">
                Salvando...
              </span>
            )}
            {costSaved && (
              <span className="font-body text-xs text-emerald-600">
                ✓ Salvo
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-body text-xs font-medium text-dolce-marrom/70 mb-1">
              Horas de trabalho
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={laborHours || ""}
              onChange={(e) =>
                handleCostChange(setLaborHours, e.target.value, 0)
              }
              className="w-full px-4 py-2.5 rounded-xl border border-dolce-marrom/10 bg-dolce-creme/30 font-body text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 transition-colors"
            />
          </div>
          <div>
            <label className="block font-body text-xs font-medium text-dolce-marrom/70 mb-1">
              Valor/hora (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={laborRate || ""}
              onChange={(e) =>
                handleCostChange(setLaborRate, e.target.value, 1)
              }
              className="w-full px-4 py-2.5 rounded-xl border border-dolce-marrom/10 bg-dolce-creme/30 font-body text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 transition-colors"
            />
          </div>
          <div>
            <label className="block font-body text-xs font-medium text-dolce-marrom/70 mb-1">
              Embalagem (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={packagingCost || ""}
              onChange={(e) =>
                handleCostChange(setPackagingCost, e.target.value, 2)
              }
              className="w-full px-4 py-2.5 rounded-xl border border-dolce-marrom/10 bg-dolce-creme/30 font-body text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 transition-colors"
            />
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-dolce-creme/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <p className="font-body text-xs text-dolce-marrom/50 mb-0.5">
                Ingredientes
              </p>
              <p className="font-body text-sm font-medium text-dolce-marrom tabular-nums">
                {formatBRL(ingredientCost)}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-dolce-marrom/50 mb-0.5">
                Mão de obra
              </p>
              <p className="font-body text-sm font-medium text-dolce-marrom tabular-nums">
                {formatBRL(laborCost)}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-dolce-marrom/50 mb-0.5">
                Embalagem
              </p>
              <p className="font-body text-sm font-medium text-dolce-marrom tabular-nums">
                {formatBRL(packagingCost)}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-dolce-marrom/50 mb-0.5">
                Custo total
              </p>
              <p className="font-body text-sm font-bold text-dolce-marrom tabular-nums">
                {formatBRL(totalCost)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================
          Section 3: Margem e Preço
         ============================== */}
      <section className="bg-white rounded-2xl border border-dolce-marrom/5 p-6">
        <h2 className="font-display text-lg text-dolce-marrom font-semibold mb-4">
          Margem & Preço
        </h2>

        {/* Margin slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-body text-sm font-medium text-dolce-marrom">
              Margem de lucro desejada
            </label>
            <span className="font-body text-lg font-bold text-dolce-rosa tabular-nums">
              {margin}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="1"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full h-2 bg-dolce-marrom/10 rounded-full appearance-none cursor-pointer accent-dolce-rosa"
          />
          <div className="flex justify-between mt-1">
            <span className="font-body text-xs text-dolce-marrom/40">0%</span>
            <span className="font-body text-xs text-dolce-marrom/40">80%</span>
          </div>
        </div>

        {/* Price comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-dolce-creme/50 text-center">
            <p className="font-body text-xs text-dolce-marrom/50 mb-1">
              Custo total
            </p>
            <p className="font-display text-xl font-bold text-dolce-marrom tabular-nums">
              {formatBRL(totalCost)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-dolce-rosa-claro text-center">
            <p className="font-body text-xs text-dolce-marrom/50 mb-1">
              Preço sugerido
            </p>
            <p className="font-display text-xl font-bold text-dolce-rosa tabular-nums">
              {suggestedPrice > 0 ? formatBRL(suggestedPrice) : "—"}
            </p>
          </div>
          <div
            className={`p-4 rounded-xl text-center ${
              currentPrice >= totalCost && totalCost > 0
                ? "bg-emerald-50"
                : totalCost > 0
                  ? "bg-red-50"
                  : "bg-gray-50"
            }`}
          >
            <p className="font-body text-xs text-dolce-marrom/50 mb-1">
              Preço atual
            </p>
            <p
              className={`font-display text-xl font-bold tabular-nums ${
                currentPrice >= totalCost && totalCost > 0
                  ? "text-emerald-700"
                  : totalCost > 0
                    ? "text-red-700"
                    : "text-dolce-marrom"
              }`}
            >
              {formatBRL(currentPrice)}
            </p>
          </div>
        </div>

        {/* Difference indicator */}
        {totalCost > 0 && (
          <div
            className={`p-3 rounded-xl mb-6 ${
              currentPrice >= suggestedPrice
                ? "bg-emerald-50 border border-emerald-200"
                : currentPrice >= totalCost
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`font-body text-sm ${
                currentPrice >= suggestedPrice
                  ? "text-emerald-700"
                  : currentPrice >= totalCost
                    ? "text-amber-700"
                    : "text-red-700"
              }`}
            >
              {currentPrice >= suggestedPrice
                ? `✅ Preço atual está ${formatBRL(currentPrice - suggestedPrice)} acima do sugerido. Margem saudável!`
                : currentPrice >= totalCost
                  ? `⚠️ Preço atual está ${formatBRL(suggestedPrice - currentPrice)} abaixo do sugerido. Margem reduzida.`
                  : `🚨 Preço atual está ${formatBRL(totalCost - currentPrice)} abaixo do custo. Você está no prejuízo!`}
            </p>
          </div>
        )}

        {/* Update price button */}
        {suggestedPrice > 0 &&
          Math.abs(currentPrice - suggestedPrice) > 0.01 && (
            <>
              {!priceConfirm ? (
                <button
                  onClick={() => setPriceConfirm(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-dolce-rosa text-white font-body text-sm font-medium hover:bg-dolce-rosa/90 transition-colors"
                >
                  Atualizar preço no cardápio para {formatBRL(suggestedPrice)}
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="font-body text-sm text-amber-800 flex-1">
                    Confirma a atualização do preço de{" "}
                    <strong>{formatBRL(currentPrice)}</strong> para{" "}
                    <strong>{formatBRL(suggestedPrice)}</strong>?
                    <br />
                    <span className="text-xs">
                      O preço será alterado no cardápio público imediatamente.
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPriceConfirm(false)}
                      disabled={priceSaving}
                      className="px-4 py-2 rounded-lg font-body text-sm text-dolce-marrom/70 hover:bg-white transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleUpdatePrice}
                      disabled={priceSaving}
                      className="px-4 py-2 rounded-lg bg-dolce-rosa text-white font-body text-sm font-medium hover:bg-dolce-rosa/90 disabled:opacity-50 transition-colors"
                    >
                      {priceSaving ? "Atualizando..." : "Confirmar"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        {priceUpdated && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <p className="font-body text-sm text-emerald-700">
              ✅ Preço atualizado com sucesso no cardápio!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
