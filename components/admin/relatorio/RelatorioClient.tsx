"use client";

import type { ProductCostSummary } from "@/types/pricing";
import { useMemo, useState } from "react";

type FilterStatus = "all" | "profitable" | "attention" | "loss" | "no-data";
type SortField =
  | "product_name"
  | "total_cost"
  | "current_price"
  | "suggested_price"
  | "price_difference";
type SortDir = "asc" | "desc";

function formatBRL(value: number | string | null) {
  const n = Number(value ?? 0);
  return `R$ ${n.toFixed(2).replace(".", ",")}`;
}

function getStatus(s: ProductCostSummary): FilterStatus {
  const totalCost = Number(s.total_cost ?? 0);
  const currentPrice = Number(s.current_price ?? 0);
  if (totalCost === 0) return "no-data";
  if (currentPrice < totalCost) return "loss";
  const diff = currentPrice - totalCost;
  if (diff < 0.5) return "attention";
  return "profitable";
}

export function RelatorioClient({
  summaries,
}: {
  summaries: ProductCostSummary[];
}) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<SortField>("product_name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Stats
  const stats = useMemo(() => {
    let profitable = 0;
    let attention = 0;
    let loss = 0;
    let noData = 0;
    for (const s of summaries) {
      const st = getStatus(s);
      if (st === "profitable") profitable++;
      else if (st === "attention") attention++;
      else if (st === "loss") loss++;
      else noData++;
    }
    return { total: summaries.length, profitable, attention, loss, noData };
  }, [summaries]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = summaries;
    if (filter !== "all") {
      list = list.filter((s) => getStatus(s) === filter);
    }
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === "product_name") {
        cmp = (a.product_name || "").localeCompare(
          b.product_name || "",
          "pt-BR",
        );
      } else {
        cmp = Number(a[sortField] ?? 0) - Number(b[sortField] ?? 0);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [summaries, filter, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  async function handleExportPDF() {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Dolce Neves — Relatório de Preços", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
      14,
      30,
    );

    // Summary line
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(
      `Total: ${stats.total} | Lucrativos: ${stats.profitable} | Atenção: ${stats.attention} | Prejuízo: ${stats.loss}`,
      14,
      40,
    );

    const rows = filtered.map((s) => {
      const status = getStatus(s);
      const statusLabel =
        status === "profitable"
          ? "Lucrativo"
          : status === "attention"
            ? "Atenção"
            : status === "loss"
              ? "Prejuízo"
              : "Sem ficha";

      return [
        s.product_name,
        Number(s.total_cost ?? 0).toFixed(2),
        Number(s.suggested_price ?? 0).toFixed(2),
        Number(s.current_price ?? 0).toFixed(2),
        Number(s.price_difference ?? 0).toFixed(2),
        statusLabel,
      ];
    });

    autoTable(doc, {
      startY: 48,
      head: [
        [
          "Produto",
          "Custo (R$)",
          "Sugerido (R$)",
          "Atual (R$)",
          "Diferença (R$)",
          "Status",
        ],
      ],
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [61, 35, 20] },
    });

    doc.save("dolce-neves-relatorio-precos.pdf");
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <span className="opacity-0 group-hover:opacity-30 ml-1">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filter === "all"
              ? "border-dolce-rosa bg-dolce-rosa-claro shadow-sm"
              : "border-dolce-marrom/5 bg-white hover:shadow-md"
          }`}
        >
          <p className="font-body text-xs text-dolce-marrom/50 mb-1">Total</p>
          <p className="font-display text-2xl font-bold text-dolce-marrom">
            {stats.total}
          </p>
        </button>
        <button
          onClick={() => setFilter("profitable")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filter === "profitable"
              ? "border-emerald-400 bg-emerald-50 shadow-sm"
              : "border-dolce-marrom/5 bg-white hover:shadow-md"
          }`}
        >
          <p className="font-body text-xs text-dolce-marrom/50 mb-1">
            🟢 Lucrativos
          </p>
          <p className="font-display text-2xl font-bold text-emerald-700">
            {stats.profitable}
          </p>
        </button>
        <button
          onClick={() => setFilter("attention")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filter === "attention"
              ? "border-amber-400 bg-amber-50 shadow-sm"
              : "border-dolce-marrom/5 bg-white hover:shadow-md"
          }`}
        >
          <p className="font-body text-xs text-dolce-marrom/50 mb-1">
            🟡 Atenção
          </p>
          <p className="font-display text-2xl font-bold text-amber-700">
            {stats.attention}
          </p>
        </button>
        <button
          onClick={() => setFilter("loss")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filter === "loss"
              ? "border-red-400 bg-red-50 shadow-sm"
              : "border-dolce-marrom/5 bg-white hover:shadow-md"
          }`}
        >
          <p className="font-body text-xs text-dolce-marrom/50 mb-1">
            🔴 Prejuízo
          </p>
          <p className="font-display text-2xl font-bold text-red-700">
            {stats.loss}
          </p>
        </button>
      </div>

      {/* Export button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dolce-marrom text-white font-body text-sm font-medium hover:bg-dolce-marrom/90 transition-colors"
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar PDF
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-dolce-marrom/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dolce-marrom/5 bg-dolce-creme/50">
                <th
                  onClick={() => toggleSort("product_name")}
                  className="group text-left px-4 py-3 font-body text-xs font-semibold text-dolce-marrom/70 uppercase tracking-wider cursor-pointer hover:text-dolce-marrom select-none"
                >
                  Produto <SortIcon field="product_name" />
                </th>
                <th
                  onClick={() => toggleSort("total_cost")}
                  className="group text-right px-4 py-3 font-body text-xs font-semibold text-dolce-marrom/70 uppercase tracking-wider cursor-pointer hover:text-dolce-marrom select-none"
                >
                  Custo <SortIcon field="total_cost" />
                </th>
                <th
                  onClick={() => toggleSort("suggested_price")}
                  className="group text-right px-4 py-3 font-body text-xs font-semibold text-dolce-marrom/70 uppercase tracking-wider cursor-pointer hover:text-dolce-marrom select-none hidden sm:table-cell"
                >
                  Sugerido <SortIcon field="suggested_price" />
                </th>
                <th
                  onClick={() => toggleSort("current_price")}
                  className="group text-right px-4 py-3 font-body text-xs font-semibold text-dolce-marrom/70 uppercase tracking-wider cursor-pointer hover:text-dolce-marrom select-none"
                >
                  Atual <SortIcon field="current_price" />
                </th>
                <th
                  onClick={() => toggleSort("price_difference")}
                  className="group text-right px-4 py-3 font-body text-xs font-semibold text-dolce-marrom/70 uppercase tracking-wider cursor-pointer hover:text-dolce-marrom select-none hidden sm:table-cell"
                >
                  Diferença <SortIcon field="price_difference" />
                </th>
                <th className="text-center px-4 py-3 font-body text-xs font-semibold text-dolce-marrom/70 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dolce-marrom/5">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center font-body text-sm text-dolce-marrom/40"
                  >
                    Nenhum produto encontrado para este filtro.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const status = getStatus(s);
                  const totalCost = Number(s.total_cost ?? 0);
                  const suggestedPrice = Number(s.suggested_price ?? 0);
                  const currentPrice = Number(s.current_price ?? 0);
                  const priceDiff = Number(s.price_difference ?? 0);

                  return (
                    <tr
                      key={s.product_id}
                      className="hover:bg-dolce-creme/30 transition-colors cursor-pointer"
                      onClick={() =>
                        window.location.assign(`/admin/fichas/${s.product_id}`)
                      }
                    >
                      <td className="px-4 py-3 font-body text-sm text-dolce-marrom font-medium">
                        {s.product_name}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-dolce-marrom/70 text-right tabular-nums">
                        {totalCost > 0 ? formatBRL(totalCost) : "—"}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-dolce-marrom/70 text-right tabular-nums hidden sm:table-cell">
                        {suggestedPrice > 0 ? formatBRL(suggestedPrice) : "—"}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-dolce-marrom text-right tabular-nums font-medium">
                        {formatBRL(currentPrice)}
                      </td>
                      <td
                        className={`px-4 py-3 font-body text-sm text-right tabular-nums hidden sm:table-cell font-medium ${
                          priceDiff >= 0 ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {totalCost > 0
                          ? `${priceDiff >= 0 ? "+" : ""}${formatBRL(priceDiff)}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {status === "profitable" && (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-body text-xs">
                            🟢
                          </span>
                        )}
                        {status === "attention" && (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-body text-xs">
                            🟡
                          </span>
                        )}
                        {status === "loss" && (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-body text-xs">
                            🔴
                          </span>
                        )}
                        {status === "no-data" && (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 font-body text-xs">
                            ⚪
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
