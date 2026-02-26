"use client";

import { updateOrderStatus } from "@/lib/actions/orders";
import type { OrderStatus } from "@/types/orders";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  VALID_TRANSITIONS,
} from "@/types/orders";
import { useState, useTransition } from "react";

interface OrderStatusFlowProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusChange?: (newStatus: OrderStatus) => void;
}

export default function OrderStatusFlow({
  orderId,
  currentStatus,
  onStatusChange,
}: OrderStatusFlowProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const validNextStatuses = VALID_TRANSITIONS[currentStatus] || [];

  async function handleTransition(nextStatus: OrderStatus) {
    if (nextStatus === "cancelado") {
      setShowConfirmCancel(true);
      return;
    }
    await executeTransition(nextStatus);
  }

  async function executeTransition(nextStatus: OrderStatus) {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, nextStatus);
      if (result.error) {
        alert(result.error);
        return;
      }
      if (nextStatus === "entregue") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      setShowConfirmCancel(false);
      onStatusChange?.(nextStatus);
    });
  }

  if (currentStatus === "cancelado" || currentStatus === "entregue") {
    return (
      <div className="flex items-center gap-2 font-body text-sm text-dolce-marrom/50">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            currentStatus === "entregue" ? "bg-emerald-500" : "bg-red-500"
          }`}
        />
        Status final: {ORDER_STATUS_LABELS[currentStatus]}
      </div>
    );
  }

  const statusOrder: OrderStatus[] = [
    "pendente",
    "em_producao",
    "pronto",
    "entregue",
  ];
  const currentIdx = statusOrder.indexOf(currentStatus);

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {statusOrder.map((s, i) => {
          const isCompleted = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`flex-1 h-1.5 rounded-full ${
                  isCompleted
                    ? "bg-emerald-400"
                    : isCurrent
                      ? "bg-dolce-rosa"
                      : "bg-gray-200"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Transition buttons */}
      <div className="flex flex-wrap gap-2">
        {validNextStatuses.map((nextStatus) => {
          const colors = ORDER_STATUS_COLORS[nextStatus];
          const isCancelButton = nextStatus === "cancelado";
          return (
            <button
              key={nextStatus}
              onClick={() => handleTransition(nextStatus)}
              disabled={isPending}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs font-medium
                border transition-colors disabled:opacity-50
                ${
                  isCancelButton
                    ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                    : `${colors.border} ${colors.text} ${colors.bg} hover:opacity-80`
                }
              `}
            >
              {nextStatus === "em_producao" && "Iniciar Produção"}
              {nextStatus === "pronto" && "Marcar Pronto"}
              {nextStatus === "entregue" && "Confirmar Entrega"}
              {nextStatus === "cancelado" && "Cancelar Pedido"}
            </button>
          );
        })}
      </div>

      {/* Cancel confirmation */}
      {showConfirmCancel && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <p className="font-body text-sm text-red-800 font-medium">
            Tem certeza que deseja cancelar este pedido?
          </p>
          <p className="font-body text-xs text-red-600">
            Esta ação não pode ser desfeita. O pedido será marcado como
            cancelado e não contará mais na capacidade.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => executeTransition("cancelado")}
              disabled={isPending}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-body text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isPending ? "Cancelando..." : "Sim, cancelar"}
            </button>
            <button
              onClick={() => setShowConfirmCancel(false)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 font-body text-xs hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* Confetti on entregue */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
          <div className="text-center animate-bounce">
            <span className="text-6xl">🎉</span>
            <p className="font-display text-xl text-dolce-marrom font-bold mt-2">
              Pedido Entregue!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
