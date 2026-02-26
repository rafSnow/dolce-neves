"use client";

import type {
  CalendarView as CalendarViewType,
  DailyOrderSummary,
  Order,
} from "@/types/orders";
import { useMemo, useState } from "react";
import CalendarDay from "./CalendarDay";
import CalendarDayDetail from "./CalendarDayDetail";

interface CalendarViewProps {
  orders: Order[];
  summaries: DailyOrderSummary[];
}

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarView({ orders, summaries }: CalendarViewProps) {
  const [view, setView] = useState<CalendarViewType>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();

  // Build order map by date
  const ordersByDate = useMemo(() => {
    const map = new Map<string, Order[]>();
    for (const order of orders) {
      const key = order.delivery_date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(order);
    }
    return map;
  }, [orders]);

  // Build summary map by date
  const summaryByDate = useMemo(() => {
    const map = new Map<string, DailyOrderSummary>();
    for (const s of summaries) {
      map.set(s.delivery_date, s);
    }
    return map;
  }, [summaries]);

  // Calendar days computation
  const calendarDays = useMemo(() => {
    if (view === "month") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startOffset = firstDay.getDay(); // 0=Sun

      const days: Date[] = [];
      // Previous month padding
      for (let i = startOffset - 1; i >= 0; i--) {
        days.push(new Date(year, month, -i));
      }
      // Current month
      for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
      }
      // Next month padding to fill 6 rows
      while (days.length % 7 !== 0 || days.length < 35) {
        const last = days[days.length - 1];
        days.push(
          new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
        );
      }
      return days;
    } else {
      // Week view
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const days: Date[] = [];
      for (let i = 0; i < 7; i++) {
        days.push(
          new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
        );
      }
      return days;
    }
  }, [currentDate, view]);

  function navigatePrev() {
    const d = new Date(currentDate);
    if (view === "month") {
      d.setMonth(d.getMonth() - 1);
    } else {
      d.setDate(d.getDate() - 7);
    }
    setCurrentDate(d);
  }

  function navigateNext() {
    const d = new Date(currentDate);
    if (view === "month") {
      d.setMonth(d.getMonth() + 1);
    } else {
      d.setDate(d.getDate() + 7);
    }
    setCurrentDate(d);
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  const headerLabel = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  function handleDayClick(date: Date) {
    if (selectedDate && isSameDay(selectedDate, date)) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  }

  const selectedOrders = selectedDate
    ? ordersByDate.get(toDateKey(selectedDate)) || []
    : [];
  const selectedSummary = selectedDate
    ? summaryByDate.get(toDateKey(selectedDate))
    : undefined;

  return (
    <div className="flex gap-4">
      {/* Calendar */}
      <div className="flex-1 min-w-0">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={navigatePrev}
              className="p-2 rounded-lg hover:bg-dolce-marrom/5 transition-colors"
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
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h3 className="font-display text-lg text-dolce-marrom font-semibold capitalize min-w-[180px] text-center">
              {headerLabel}
            </h3>
            <button
              onClick={navigateNext}
              className="p-2 rounded-lg hover:bg-dolce-marrom/5 transition-colors"
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
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 rounded-lg border border-dolce-marrom/10 font-body text-xs text-dolce-marrom/50 hover:bg-dolce-marrom/5 transition-colors ml-2"
            >
              Hoje
            </button>
          </div>

          <div className="flex rounded-lg border border-dolce-marrom/10 overflow-hidden">
            <button
              onClick={() => setView("month")}
              className={`px-3 py-1.5 font-body text-xs transition-colors ${
                view === "month"
                  ? "bg-dolce-rosa text-white"
                  : "text-dolce-marrom/50 hover:bg-dolce-marrom/5"
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1.5 font-body text-xs transition-colors ${
                view === "week"
                  ? "bg-dolce-rosa text-white"
                  : "text-dolce-marrom/50 hover:bg-dolce-marrom/5"
              }`}
            >
              Semana
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wider py-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          className={`grid grid-cols-7 gap-1 ${view === "week" ? "grid-rows-1" : ""}`}
        >
          {calendarDays.map((date) => {
            const key = toDateKey(date);
            const dayOrders = ordersByDate.get(key) || [];
            const daySummary = summaryByDate.get(key);
            return (
              <CalendarDay
                key={key}
                date={date}
                isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                isToday={isSameDay(date, today)}
                orders={dayOrders}
                summary={daySummary}
                isSelected={
                  selectedDate ? isSameDay(selectedDate, date) : false
                }
                onClick={handleDayClick}
              />
            );
          })}
        </div>
      </div>

      {/* Side detail panel */}
      {selectedDate && (
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <CalendarDayDetail
            date={selectedDate}
            orders={selectedOrders}
            summary={selectedSummary}
            onClose={() => setSelectedDate(null)}
          />
        </div>
      )}

      {/* Mobile detail (bottom sheet) */}
      {selectedDate && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 p-4 bg-white border-t border-dolce-marrom/10 shadow-2xl max-h-[70vh] overflow-y-auto rounded-t-2xl">
          <CalendarDayDetail
            date={selectedDate}
            orders={selectedOrders}
            summary={selectedSummary}
            onClose={() => setSelectedDate(null)}
          />
        </div>
      )}
    </div>
  );
}
