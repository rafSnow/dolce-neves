"use client";

import type { Order } from "@/types/orders";
import { ORDER_SOURCE_LABELS } from "@/types/orders";
import Link from "next/link";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderRowProps {
  order: Order;
}

export default function OrderRow({ order }: OrderRowProps) {
  const totalItems = order.items.reduce((s, it) => s + it.quantity, 0);

  return (
    <Link
      href={`/admin/encomendas/pedidos/${order.id}`}
      className="flex items-center gap-4 px-4 py-3 bg-white rounded-xl border border-dolce-marrom/5 hover:shadow-md transition-shadow group"
    >
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-dolce-marrom truncate group-hover:text-dolce-rosa transition-colors">
          {order.client_name}
        </p>
        <p className="font-body text-xs text-dolce-marrom/40 mt-0.5">
          {order.items
            .map((it) => `${it.quantity}x ${it.product_name}`)
            .join(", ")}
        </p>
      </div>

      <div className="hidden sm:block text-right">
        <p className="font-body text-xs text-dolce-marrom/50">
          {new Date(order.delivery_date + "T12:00:00").toLocaleDateString(
            "pt-BR",
          )}
        </p>
        {order.delivery_time && (
          <p className="font-body text-[10px] text-dolce-marrom/30">
            {order.delivery_time}
          </p>
        )}
      </div>

      <div className="hidden md:block">
        <span className="font-body text-[10px] text-dolce-marrom/40 bg-dolce-creme px-2 py-0.5 rounded">
          {ORDER_SOURCE_LABELS[order.source]}
        </span>
      </div>

      <div className="text-right w-20">
        <p className="font-display text-sm text-dolce-marrom font-bold">
          R$ {Number(order.total_price).toFixed(2)}
        </p>
        <p className="font-body text-[10px] text-dolce-marrom/30">
          {totalItems} un.
        </p>
      </div>

      <div className="w-24 text-right">
        <OrderStatusBadge status={order.status} />
      </div>

      {order.force_accepted && (
        <span
          className="text-amber-500"
          title="Pedido forçado acima da capacidade"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
      )}
    </Link>
  );
}
