"use client";

import type { DashboardStats } from "@/lib/actions/dashboard";
import Link from "next/link";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function Badge({ value, positive }: { value: number; positive?: boolean }) {
  if (value === 0) return null;
  const isUp = value > 0;
  return (
    <span
      className={`
        inline-flex items-center gap-0.5 font-body text-xs font-semibold px-1.5 py-0.5 rounded-full
        ${isUp ? (positive ? "bg-emerald-100 text-emerald-700" : "bg-emerald-100 text-emerald-700") : "bg-red-100 text-red-700"}
      `}
    >
      {isUp ? "↑" : "↓"} {Math.abs(value)}%
    </span>
  );
}

interface StatsGridProps {
  stats: DashboardStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const weekCompare =
    stats.prevWeekOrders > 0
      ? Math.round(
          ((stats.weekOrders - stats.prevWeekOrders) / stats.prevWeekOrders) *
            100,
        )
      : null;
  const revenueCompare =
    stats.prevMonthRevenue > 0
      ? Math.round(
          ((stats.monthRevenue - stats.prevMonthRevenue) /
            stats.prevMonthRevenue) *
            100,
        )
      : null;

  const cards = [
    {
      label: "Pedidos Hoje",
      value: stats.todayOrders.toString(),
      href: "/admin/encomendas/agenda",
      color: "text-dolce-marrom",
      badge: null as number | null,
    },
    {
      label: "Pedidos na Semana",
      value: stats.weekOrders.toString(),
      href: "/admin/encomendas/pedidos",
      color: "text-dolce-marrom",
      badge: weekCompare,
    },
    {
      label: "Receita do Mês",
      value: formatBRL(stats.monthRevenue),
      href: "/admin/relatorio",
      color: "text-emerald-700",
      badge: revenueCompare,
    },
    {
      label: "NPS Médio",
      value: stats.avgNPS ? stats.avgNPS.toFixed(1) : "—",
      href: "/admin/qrcodes",
      color:
        stats.avgNPS && stats.avgNPS >= 4
          ? "text-emerald-700"
          : stats.avgNPS && stats.avgNPS >= 3
            ? "text-amber-600"
            : "text-dolce-marrom",
      badge: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="bg-white rounded-2xl p-4 border border-dolce-marrom/5 hover:shadow-md transition-shadow"
        >
          <p className="font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
            {card.label}
          </p>
          <div className="flex items-end gap-2 mt-1">
            <p className={`font-display text-2xl font-bold ${card.color}`}>
              {card.value}
            </p>
            {card.badge !== null && card.badge !== undefined && (
              <Badge value={card.badge} positive />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
