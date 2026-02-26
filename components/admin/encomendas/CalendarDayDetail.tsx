"use client";

import type { DailyOrderSummary, Order } from "@/types/orders";
import Link from "next/link";
import CapacityBar from "./CapacityBar";
import OrderStatusBadge from "./OrderStatusBadge";

interface CalendarDayDetailProps {
  date: Date;
  orders: Order[];
  summary?: DailyOrderSummary;
  onClose: () => void;
}

export default function CalendarDayDetail({
  date,
  orders,
  summary,
  onClose,
}: CalendarDayDetailProps) {
  const formattedDate = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalUnits = summary?.total_units ?? 0;
  const maxUnits = summary?.max_units ?? 100;
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_price), 0);
  const dateStr = date.toISOString().slice(0, 10);

  return (
    <div className="bg-white rounded-2xl border border-dolce-marrom/5 shadow-lg p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg text-dolce-marrom font-bold capitalize">
            {formattedDate}
          </h3>
          <p className="font-body text-xs text-dolce-marrom/40 mt-0.5">
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"} — R${" "}
            {totalRevenue.toFixed(2)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-dolce-marrom/5 transition-colors"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Capacity */}
      <div>
        <CapacityBar current={totalUnits} max={maxUnits} showLabel size="md" />
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <p className="font-body text-sm text-dolce-marrom/30 text-center py-4">
          Nenhum pedido neste dia.
        </p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/encomendas/pedidos/${order.id}`}
              className="block bg-dolce-creme/50 rounded-xl p-3 hover:bg-dolce-creme transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-body text-sm font-medium text-dolce-marrom">
                  {order.client_name}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="font-body text-xs text-dolce-marrom/40">
                {order.items
                  .map((it) => `${it.quantity}x ${it.product_name}`)
                  .join(", ")}
              </p>
              <div className="flex items-center justify-between mt-1">
                {order.delivery_time && (
                  <span className="font-body text-[10px] text-dolce-marrom/30">
                    {order.delivery_time}
                  </span>
                )}
                <span className="font-display text-sm text-dolce-marrom font-bold">
                  R$ {Number(order.total_price).toFixed(2)}
                </span>
              </div>
              {order.force_accepted && (
                <span className="inline-block mt-1 font-body text-[9px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                  Forçado
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-dolce-marrom/5">
        <Link
          href={`/admin/encomendas/pedidos/novo?date=${dateStr}`}
          className="flex-1 text-center px-3 py-2 rounded-xl bg-dolce-rosa text-white font-body text-xs font-medium hover:bg-dolce-rosa/90 transition-colors"
        >
          + Novo Pedido
        </Link>
        <Link
          href={`/admin/encomendas/capacidade?date=${dateStr}`}
          className="px-3 py-2 rounded-xl border border-dolce-marrom/10 font-body text-xs text-dolce-marrom/50 hover:bg-dolce-marrom/5 transition-colors"
        >
          Capacidade
        </Link>
      </div>
    </div>
  );
}
