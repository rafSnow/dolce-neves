"use client";

import type { Order } from "@/types/orders";
import { ORDER_SOURCE_LABELS } from "@/types/orders";
import Link from "next/link";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const totalItems = order.items.reduce((s, it) => s + it.quantity, 0);

  return (
    <Link
      href={`/admin/encomendas/pedidos/${order.id}`}
      className="block bg-white rounded-xl border border-dolce-marrom/5 p-4 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-body text-sm font-semibold text-dolce-marrom truncate group-hover:text-dolce-rosa transition-colors">
            {order.client_name}
          </h4>
          {order.client_phone && (
            <p className="font-body text-xs text-dolce-marrom/40 mt-0.5">
              {order.client_phone}
            </p>
          )}
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-4 font-body text-xs text-dolce-marrom/50">
          <span className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {new Date(order.delivery_date + "T12:00:00").toLocaleDateString(
              "pt-BR",
            )}
          </span>
          {order.delivery_time && <span>{order.delivery_time}</span>}
          <span>{ORDER_SOURCE_LABELS[order.source]}</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-body text-xs text-dolce-marrom/40">
            {totalItems} {totalItems === 1 ? "item" : "itens"} —{" "}
            {order.items.map((it) => it.product_name).join(", ")}
          </p>
          <p className="font-display text-sm text-dolce-marrom font-bold">
            R$ {Number(order.total_price).toFixed(2)}
          </p>
        </div>
      </div>

      {order.force_accepted && (
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#92400E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="font-body text-[9px] text-amber-800 font-medium">
            Forçado
          </span>
        </div>
      )}
    </Link>
  );
}
