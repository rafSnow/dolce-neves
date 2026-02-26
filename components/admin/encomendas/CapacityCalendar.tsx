"use client";

import { setDailyCapacity } from "@/lib/actions/orders";
import type { DailyOrderSummary } from "@/types/orders";
import { SPECIAL_DATES } from "@/types/orders";
import { useMemo, useState, useTransition } from "react";
import CapacityBar from "./CapacityBar";

interface CapacityCalendarProps {
  summaries: DailyOrderSummary[];
  initialDate?: string;
}

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CapacityCalendar({
  summaries,
  initialDate,
}: CapacityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    if (initialDate) return new Date(initialDate + "T12:00:00");
    return new Date();
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialDate || null,
  );
  const [editMax, setEditMax] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [batchMode, setBatchMode] = useState(false);
  const [batchMax, setBatchMax] = useState("100");

  const summaryByDate = useMemo(() => {
    const map = new Map<string, DailyOrderSummary>();
    for (const s of summaries) {
      map.set(s.delivery_date, s);
    }
    return map;
  }, [summaries]);

  // Calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();

    const days: Date[] = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    while (days.length % 7 !== 0 || days.length < 35) {
      const last = days[days.length - 1];
      days.push(
        new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      );
    }
    return days;
  }, [currentDate]);

  function selectDay(date: Date) {
    const key = toDateKey(date);
    const s = summaryByDate.get(key);
    setSelectedDate(key);
    setEditMax(String(s?.max_units ?? 100));
    setEditNotes("");
  }

  async function handleSave() {
    if (!selectedDate) return;
    startTransition(async () => {
      await setDailyCapacity(
        selectedDate,
        parseInt(editMax) || 100,
        editNotes || undefined,
      );
      setSelectedDate(null);
    });
  }

  async function handleBatchApply() {
    const maxVal = parseInt(batchMax) || 100;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    startTransition(async () => {
      for (let d = 1; d <= lastDay; d++) {
        const dateStr = toDateKey(new Date(year, month, d));
        await setDailyCapacity(dateStr, maxVal);
      }
      setBatchMode(false);
    });
  }

  const today = new Date();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(currentDate);
              d.setMonth(d.getMonth() - 1);
              setCurrentDate(d);
            }}
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
            {currentDate.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            onClick={() => {
              const d = new Date(currentDate);
              d.setMonth(d.getMonth() + 1);
              setCurrentDate(d);
            }}
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
        </div>
        <button
          onClick={() => setBatchMode(!batchMode)}
          className={`px-3 py-1.5 rounded-lg font-body text-xs transition-colors ${
            batchMode
              ? "bg-dolce-rosa text-white"
              : "border border-dolce-marrom/10 text-dolce-marrom/50 hover:bg-dolce-marrom/5"
          }`}
        >
          Config. em Lote
        </button>
      </div>

      {/* Batch mode */}
      {batchMode && (
        <div className="bg-dolce-rosa-claro rounded-xl p-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
              Capacidade para todos os dias do mês
            </label>
            <input
              type="number"
              min={1}
              value={batchMax}
              onChange={(e) => setBatchMax(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-dolce-marrom/10 bg-white font-body text-sm"
            />
          </div>
          <button
            onClick={handleBatchApply}
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-dolce-rosa text-white font-body text-sm font-medium hover:bg-dolce-rosa/90 transition-colors disabled:opacity-50"
          >
            {isPending ? "Aplicando..." : "Aplicar"}
          </button>
        </div>
      )}

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
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
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date) => {
          const key = toDateKey(date);
          const s = summaryByDate.get(key);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday =
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
          const isSelected = selectedDate === key;
          const specialDate = SPECIAL_DATES[key];
          const totalUnits = s?.total_units ?? 0;
          const maxUnits = s?.max_units ?? 100;
          const isOverbooked = totalUnits > maxUnits;

          return (
            <button
              key={key}
              onClick={() => selectDay(date)}
              className={`
                flex flex-col p-2 min-h-[80px] rounded-lg border text-left transition-all
                ${!isCurrentMonth ? "opacity-30" : ""}
                ${isToday ? "border-dolce-rosa ring-1 ring-dolce-rosa/30" : "border-dolce-marrom/5"}
                ${isSelected ? "bg-dolce-rosa-claro border-dolce-rosa" : "bg-white hover:bg-dolce-creme/50"}
                ${isOverbooked && isCurrentMonth ? "border-red-300 bg-red-50/50" : ""}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-body text-xs font-medium ${
                    isToday
                      ? "text-dolce-rosa font-bold"
                      : "text-dolce-marrom/60"
                  }`}
                >
                  {date.getDate()}
                </span>
                {specialDate && (
                  <span
                    className="text-[8px] px-1 py-0.5 rounded bg-dolce-rosa-claro text-dolce-rosa font-body font-medium truncate max-w-[60px]"
                    title={specialDate.label}
                  >
                    {specialDate.label}
                  </span>
                )}
              </div>

              {isCurrentMonth && (
                <>
                  <CapacityBar current={totalUnits} max={maxUnits} size="sm" />
                  <p className="font-body text-[9px] text-dolce-marrom/40 mt-1">
                    {totalUnits}/{maxUnits}
                  </p>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Edit selected day */}
      {selectedDate && (
        <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-5 space-y-4">
          <h4 className="font-display text-lg text-dolce-marrom font-semibold">
            Configurar{" "}
            {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h4>

          {(() => {
            const specialDate = selectedDate
              ? SPECIAL_DATES[selectedDate]
              : undefined;
            return specialDate ? (
              <div className="bg-dolce-rosa-claro rounded-lg px-3 py-2">
                <p className="font-body text-xs text-dolce-rosa font-medium">
                  Data especial: {specialDate.label}
                </p>
                <p className="font-body text-[10px] text-dolce-marrom/40 mt-0.5">
                  Capacidade sugerida: {specialDate.suggestedCapacity} unidades
                </p>
              </div>
            ) : null;
          })()}

          <div>
            <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
              Capacidade máxima (unidades)
            </label>
            <input
              type="number"
              min={1}
              value={editMax}
              onChange={(e) => setEditMax(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-dolce-marrom/10 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30"
            />
          </div>

          <div>
            <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
              Observações
            </label>
            <input
              type="text"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Ex: Feriado, equipe reduzida..."
              className="w-full px-3 py-2 rounded-lg border border-dolce-marrom/10 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-4 py-2 rounded-xl bg-dolce-rosa text-white font-body text-sm font-medium hover:bg-dolce-rosa/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={() => setSelectedDate(null)}
              className="px-4 py-2 rounded-xl border border-dolce-marrom/10 font-body text-sm text-dolce-marrom/50 hover:bg-dolce-marrom/5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
