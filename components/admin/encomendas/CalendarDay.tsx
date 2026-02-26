"use client";

import type { DailyOrderSummary, Order } from "@/types/orders";
import CapacityBar from "./CapacityBar";
import OrderStatusBadge from "./OrderStatusBadge";

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  orders: Order[];
  summary?: DailyOrderSummary;
  isSelected: boolean;
  onClick: (date: Date) => void;
}

export default function CalendarDay({
  date,
  isCurrentMonth,
  isToday,
  orders,
  summary,
  isSelected,
  onClick,
}: CalendarDayProps) {
  const totalUnits = summary?.total_units ?? 0;
  const maxUnits = summary?.max_units ?? 100;
  const isOverbooked = totalUnits > maxUnits;
  const displayOrders = orders.slice(0, 3);
  const moreCount = orders.length - 3;

  return (
    <button
      onClick={() => onClick(date)}
      className={`
        relative flex flex-col p-1.5 min-h-[90px] rounded-lg border text-left transition-all
        ${!isCurrentMonth ? "opacity-40" : ""}
        ${isToday ? "border-dolce-rosa ring-1 ring-dolce-rosa/30" : "border-dolce-marrom/5"}
        ${isSelected ? "bg-dolce-rosa-claro border-dolce-rosa" : "bg-white hover:bg-dolce-creme/50"}
        ${isOverbooked && isCurrentMonth ? "border-red-300 bg-red-50/50" : ""}
      `}
    >
      {/* Day number */}
      <span
        className={`
          font-body text-xs font-medium mb-1
          ${isToday ? "text-dolce-rosa font-bold" : "text-dolce-marrom/60"}
        `}
      >
        {date.getDate()}
      </span>

      {/* Capacity bar */}
      {isCurrentMonth && orders.length > 0 && (
        <CapacityBar current={totalUnits} max={maxUnits} size="sm" />
      )}

      {/* Order chips */}
      <div className="flex-1 space-y-0.5 mt-1 overflow-hidden">
        {displayOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-1 truncate"
            title={`${order.client_name} — ${order.items.map((i) => i.product_name).join(", ")}`}
          >
            <OrderStatusBadge status={order.status} size="sm" />
            <span className="font-body text-[9px] text-dolce-marrom/60 truncate">
              {order.client_name}
            </span>
          </div>
        ))}
        {moreCount > 0 && (
          <span className="font-body text-[9px] text-dolce-rosa font-medium">
            +{moreCount} mais
          </span>
        )}
      </div>
    </button>
  );
}
