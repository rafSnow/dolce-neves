"use client";

import OrderForm from "@/components/admin/encomendas/OrderForm";
import { createOrder } from "@/lib/actions/orders";
import type { OrderFormData } from "@/types/orders";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NovoPedidoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetDate = searchParams.get("date") || "";

  async function handleSubmit(data: OrderFormData) {
    const result = await createOrder(data);
    if (result.error) return { error: result.error };
    router.push("/admin/encomendas/pedidos");
    return {};
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/encomendas/pedidos"
          className="font-body text-sm text-dolce-rosa hover:underline flex items-center gap-1 mb-2"
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
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Voltar para pedidos
        </Link>
        <h1 className="font-display text-2xl text-dolce-marrom font-bold">
          Novo Pedido
        </h1>
        <p className="font-body text-sm text-dolce-marrom/50 mt-1">
          Preencha os dados do pedido abaixo.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6">
        <OrderForm
          initialData={{ delivery_date: presetDate }}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/encomendas/pedidos")}
          submitLabel="Criar Pedido"
        />
      </div>
    </div>
  );
}

export default function NovoPedidoPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-dolce-marrom/10 rounded-lg mb-6" />
          <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-dolce-marrom/5 rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <NovoPedidoContent />
    </Suspense>
  );
}
