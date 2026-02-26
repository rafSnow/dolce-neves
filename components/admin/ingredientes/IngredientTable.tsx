"use client";

import {
  deleteIngredient,
  getIngredientUsageCount,
} from "@/lib/actions/pricing";
import type { Ingredient } from "@/types/pricing";
import { UNIT_LABELS } from "@/types/pricing";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { IngredientForm } from "./IngredientForm";
import { IngredientRow } from "./IngredientRow";

type SortField = "name" | "unit" | "cost_per_unit" | "updated_at";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 20;

export function IngredientTable({
  initialData,
}: {
  initialData: Ingredient[];
}) {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialData);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);

  // Form modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null,
  );

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Ingredient | null>(null);
  const [deleteUsageCount, setDeleteUsageCount] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = ingredients;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          UNIT_LABELS[i.unit].toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name, "pt-BR");
      else if (sortField === "unit")
        cmp = UNIT_LABELS[a.unit].localeCompare(UNIT_LABELS[b.unit], "pt-BR");
      else if (sortField === "cost_per_unit")
        cmp = Number(a.cost_per_unit) - Number(b.cost_per_unit);
      else if (sortField === "updated_at")
        cmp =
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [ingredients, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(0);
  }

  function handleCreate() {
    setEditingIngredient(null);
    setFormOpen(true);
  }

  function handleEdit(ingredient: Ingredient) {
    setEditingIngredient(ingredient);
    setFormOpen(true);
  }

  async function handleDeleteClick(ingredient: Ingredient) {
    const count = await getIngredientUsageCount(ingredient.id);
    setDeleteUsageCount(count);
    setDeleteTarget(ingredient);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteIngredient(deleteTarget.id);
      setIngredients((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleFormSuccess(saved: Ingredient, isNew: boolean) {
    if (isNew) {
      setIngredients((prev) => [...prev, saved]);
    } else {
      setIngredients((prev) =>
        prev.map((i) => (i.id === saved.id ? saved : i)),
      );
    }
    setFormOpen(false);
    router.refresh();
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <span className="opacity-0 group-hover:opacity-30 ml-1">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-sm w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dolce-marrom/30"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar ingrediente..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-dolce-marrom/10 bg-white font-body text-sm placeholder:text-dolce-marrom/30 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 focus:border-dolce-rosa transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="font-body text-xs text-dolce-marrom/50">
            {filtered.length} ingrediente{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dolce-rosa text-white font-body text-sm font-medium hover:bg-dolce-rosa/90 transition-colors"
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Novo ingrediente
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-dolce-marrom/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dolce-marrom/5 bg-dolce-creme/50">
                <th
                  onClick={() => toggleSort("name")}
                  className="group text-left px-6 py-3 font-body text-xs font-semibold text-dolce-marrom/70 uppercase tracking-wider cursor-pointer hover:text-dolce-marrom select-none"
                >
                  Nome <SortIcon field="name" />
                </th>
                <th
                  onClick={() => toggleSort("unit")}
                  className="group text-left px-6 py-3 font-body text-xs font-semibold text-dolce-marrom/70 uppercase tracking-wider cursor-pointer hover:text-dolce-marrom select-none"
                >
                  Unidade <SortIcon field="unit" />
                </th>
                <th
                  onClick={() => toggleSort("cost_per_unit")}
                  className="group text-right px-6 py-3 font-body text-xs font-semibold text-dolce-marrom/70 uppercase tracking-wider cursor-pointer hover:text-dolce-marrom select-none"
                >
                  Custo/Unid. <SortIcon field="cost_per_unit" />
                </th>
                <th
                  onClick={() => toggleSort("updated_at")}
                  className="group text-right px-6 py-3 font-body text-xs font-semibold text-dolce-marrom/70 uppercase tracking-wider cursor-pointer hover:text-dolce-marrom select-none hidden sm:table-cell"
                >
                  Atualizado <SortIcon field="updated_at" />
                </th>
                <th className="px-6 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-dolce-marrom/5">
              {pageData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center font-body text-sm text-dolce-marrom/40"
                  >
                    {search
                      ? "Nenhum ingrediente encontrado."
                      : "Nenhum ingrediente cadastrado ainda."}
                  </td>
                </tr>
              )}
              {pageData.map((ingredient) => (
                <IngredientRow
                  key={ingredient.id}
                  ingredient={ingredient}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-dolce-marrom/5 bg-dolce-creme/30">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="font-body text-sm text-dolce-marrom/60 hover:text-dolce-marrom disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>
            <span className="font-body text-xs text-dolce-marrom/50">
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="font-body text-sm text-dolce-marrom/60 hover:text-dolce-marrom disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Próxima →
            </button>
          </div>
        )}
      </div>

      {/* Form modal */}
      {formOpen && (
        <IngredientForm
          ingredient={editingIngredient}
          onClose={() => setFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteConfirmModal
          ingredientName={deleteTarget.name}
          usageCount={deleteUsageCount}
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
