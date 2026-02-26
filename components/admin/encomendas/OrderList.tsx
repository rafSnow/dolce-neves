"use client";

import type { Order, OrderSource, OrderStatus } from "@/types/orders";
import { ORDER_SOURCE_LABELS, ORDER_STATUS_LABELS } from "@/types/orders";
import { useMemo, useState } from "react";
import OrderRow from "./OrderRow";

interface OrderListProps {
  orders: Order[];
}

const PAGE_SIZE = 25;

export default function OrderList({ orders }: OrderListProps) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<OrderSource | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (sourceFilter !== "all") {
      result = result.filter((o) => o.source === sourceFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.client_name.toLowerCase().includes(q) ||
          o.client_phone?.toLowerCase().includes(q) ||
          o.items.some((it) => it.product_name.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [orders, statusFilter, sourceFilter, search]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // Summary
  const totalRevenue = filtered.reduce((s, o) => s + Number(o.total_price), 0);
  const totalUnits = filtered.reduce(
    (s, o) => s + o.items.reduce((si, it) => si + it.quantity, 0),
    0,
  );

  function exportCSV() {
    const headers = [
      "Cliente",
      "Telefone",
      "Email",
      "Data Entrega",
      "Horário",
      "Itens",
      "Total",
      "Status",
      "Origem",
      "Observações",
    ];
    const rows = filtered.map((o) => [
      o.client_name,
      o.client_phone || "",
      o.client_email || "",
      o.delivery_date,
      o.delivery_time || "",
      o.items.map((it) => `${it.quantity}x ${it.product_name}`).join("; "),
      Number(o.total_price).toFixed(2),
      ORDER_STATUS_LABELS[o.status],
      ORDER_SOURCE_LABELS[o.source],
      (o.notes || "").replace(/\n/g, " "),
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Buscar cliente ou produto..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-64 px-3 py-2 rounded-lg border border-dolce-marrom/10 bg-white font-body text-sm text-dolce-marrom placeholder:text-dolce-marrom/30 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30"
        />

        <div className="flex flex-wrap gap-1">
          {(
            [
              "all",
              "pendente",
              "em_producao",
              "pronto",
              "entregue",
              "cancelado",
            ] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-full font-body text-[11px] border transition-colors ${
                statusFilter === s
                  ? "bg-dolce-rosa text-white border-dolce-rosa"
                  : "bg-white text-dolce-marrom/50 border-dolce-marrom/10 hover:border-dolce-rosa/30"
              }`}
            >
              {s === "all" ? "Todos" : ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <select
          value={sourceFilter}
          onChange={(e) => {
            setSourceFilter(e.target.value as OrderSource | "all");
            setPage(1);
          }}
          className="px-2.5 py-1.5 rounded-lg border border-dolce-marrom/10 bg-white font-body text-xs text-dolce-marrom"
        >
          <option value="all">Todas origens</option>
          {(Object.entries(ORDER_SOURCE_LABELS) as [OrderSource, string][]).map(
            ([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ),
          )}
        </select>

        <button
          onClick={exportCSV}
          className="ml-auto px-3 py-1.5 rounded-lg border border-dolce-marrom/10 font-body text-xs text-dolce-marrom/50 hover:bg-dolce-marrom/5 transition-colors flex items-center gap-1.5"
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-dolce-marrom/5 px-4 py-3">
          <p className="font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide">
            Pedidos
          </p>
          <p className="font-display text-xl text-dolce-marrom font-bold">
            {filtered.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-dolce-marrom/5 px-4 py-3">
          <p className="font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide">
            Unidades
          </p>
          <p className="font-display text-xl text-dolce-marrom font-bold">
            {totalUnits}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-dolce-marrom/5 px-4 py-3">
          <p className="font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide">
            Receita
          </p>
          <p className="font-display text-xl text-emerald-700 font-bold">
            R$ {totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* List */}
      {paginated.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-body text-dolce-marrom/30">
            Nenhum pedido encontrado.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {paginated.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-dolce-marrom/10 font-body text-xs text-dolce-marrom/50 hover:bg-dolce-marrom/5 disabled:opacity-30"
          >
            Anterior
          </button>
          <span className="font-body text-xs text-dolce-marrom/40">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-dolce-marrom/10 font-body text-xs text-dolce-marrom/50 hover:bg-dolce-marrom/5 disabled:opacity-30"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
