"use client";

import type { RevenueData } from "@/lib/actions/dashboard";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OrdersTimelineProps {
  data: RevenueData[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-lg rounded-xl border border-dolce-marrom/10 px-3 py-2">
      <p className="font-body text-xs text-dolce-marrom/50">{label}</p>
      <p className="font-display text-sm font-bold text-dolce-rosa">
        {payload[0].value} pedido{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default function OrdersTimeline({ data }: OrdersTimelineProps) {
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-dolce-marrom/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-base font-semibold text-dolce-marrom">
            📦 Pedidos nos últimos 30 dias
          </h3>
          <p className="font-body text-sm text-dolce-marrom/50">
            Total: {totalOrders} pedido{totalOrders !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
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
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#C96B7A"
                strokeWidth={2}
                dot={{ r: 3, fill: "#C96B7A" }}
                activeDot={{ r: 5, fill: "#C96B7A" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="font-body text-sm text-dolce-marrom/40">
            Nenhum pedido no período
          </p>
        </div>
      )}
    </div>
  );
}
