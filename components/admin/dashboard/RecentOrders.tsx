"use client";

import type { Order } from "@/types/orders";
import Link from "next/link";

interface RecentOrdersProps {
  orders: Order[];
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  pendente: { bg: "bg-amber-100", text: "text-amber-800", label: "Pendente" },
  confirmado: { bg: "bg-blue-100", text: "text-blue-800", label: "Confirmado" },
  em_producao: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    label: "Em Produção",
  },
  pronto: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Pronto" },
  entregue: { bg: "bg-green-100", text: "text-green-800", label: "Entregue" },
  cancelado: { bg: "bg-red-100", text: "text-red-800", label: "Cancelado" },
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-dolce-marrom/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold text-dolce-marrom">
          📋 Pedidos Recentes
        </h3>
        <Link
          href="/admin/encomendas/pedidos"
          className="font-body text-xs text-dolce-rosa hover:underline"
        >
          Ver todos →
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => {
            const style = STATUS_STYLES[order.status] || STATUS_STYLES.pendente;
            return (
              <Link
                key={order.id}
                href={`/admin/encomendas/pedidos/${order.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-dolce-creme/30 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-dolce-marrom truncate group-hover:text-dolce-rosa transition-colors">
                    {order.client_name}
                  </p>
                  <p className="font-body text-xs text-dolce-marrom/50">
                    Entrega: {formatDate(order.delivery_date)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-body text-sm font-semibold text-dolce-marrom">
                    {formatBRL(order.total_price)}
                  </p>
                  <span
                    className={`inline-block font-body text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}
                  >
                    {style.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="font-body text-sm text-dolce-marrom/40 text-center py-6">
          Nenhum pedido recente
        </p>
      )}
    </div>
  );
}
