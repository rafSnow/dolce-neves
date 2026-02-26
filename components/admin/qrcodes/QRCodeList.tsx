"use client";

import type { QRCodeSummary } from "@/types/qr";
import { useState } from "react";
import QRCodeRow from "./QRCodeRow";

interface QRCodeListProps {
  items: QRCodeSummary[];
}

export default function QRCodeList({ items }: QRCodeListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "scanned" | "feedback" | "pending"
  >("all");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const filtered = items.filter((item) => {
    if (
      search &&
      !item.client_name.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filter === "scanned" && !item.scanned) return false;
    if (filter === "feedback" && !item.feedback_submitted) return false;
    if (filter === "pending" && (item.scanned || item.feedback_submitted))
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-dolce-marrom/10 bg-white font-body text-sm text-dolce-marrom placeholder:text-dolce-marrom/30 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/40"
        />
        <div className="flex gap-2">
          {[
            { key: "all", label: "Todos" },
            { key: "scanned", label: "📱 Escaneados" },
            { key: "feedback", label: "✅ Com feedback" },
            { key: "pending", label: "⏳ Pendentes" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-3 py-2 rounded-xl font-body text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-dolce-rosa text-white"
                  : "bg-white border border-dolce-marrom/10 text-dolce-marrom/60 hover:bg-dolce-rosa-claro"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-dolce-marrom/5 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dolce-marrom/10">
              <th className="px-4 py-3 text-left font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
                Cliente
              </th>
              <th className="px-4 py-3 text-left font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
                Entrega
              </th>
              <th className="px-4 py-3 text-left font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
                Gerado em
              </th>
              <th className="px-4 py-3 text-center font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
                Scan
              </th>
              <th className="px-4 py-3 text-center font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
                Feedback
              </th>
              <th className="px-4 py-3 text-center font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
                Nota
              </th>
              <th className="px-4 py-3 text-center font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
                Cupom
              </th>
              <th className="px-4 py-3 font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <QRCodeRow key={item.qr_code_id} item={item} appUrl={appUrl} />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-body text-sm text-dolce-marrom/40">
              {items.length === 0
                ? "Nenhum QR Code gerado ainda."
                : "Nenhum resultado encontrado."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
