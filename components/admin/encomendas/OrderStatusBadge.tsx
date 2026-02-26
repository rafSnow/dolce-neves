"use client";

import type { OrderStatus } from "@/types/orders";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/types/orders";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export default function OrderStatusBadge({
  status,
  size = "sm",
}: OrderStatusBadgeProps) {
  const colors = ORDER_STATUS_COLORS[status];
  const label = ORDER_STATUS_LABELS[status];

  return (
    <span
      className={`
        inline-flex items-center font-body font-medium border rounded-full
        ${colors.bg} ${colors.text} ${colors.border}
        ${size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"}
      `}
    >
      {label}
    </span>
  );
}
