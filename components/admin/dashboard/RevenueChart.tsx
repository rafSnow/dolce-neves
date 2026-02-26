"use client";

import type { RevenueData } from "@/lib/actions/dashboard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueChartProps {
  data: RevenueData[];
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: { orders: number } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-lg rounded-xl border border-dolce-marrom/10 px-3 py-2">
      <p className="font-body text-xs text-dolce-marrom/50">{label}</p>
      <p className="font-display text-sm font-bold text-dolce-marrom">
        {formatBRL(payload[0].value)}
      </p>
      <p className="font-body text-xs text-dolce-marrom/40">
        {payload[0].payload.orders} pedido
        {payload[0].payload.orders !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const total = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-dolce-marrom/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-base font-semibold text-dolce-marrom">
            📈 Receita dos últimos 30 dias
          </h3>
          <p className="font-body text-sm text-dolce-marrom/50">
            Total: {formatBRL(total)}
          </p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#C96B7A" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C96B7A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F7F0E8" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#3D2314", opacity: 0.4 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#3D2314", opacity: 0.4 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C96B7A"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="font-body text-sm text-dolce-marrom/40">
            Nenhum dado de receita no período
          </p>
        </div>
      )}
    </div>
  );
}
