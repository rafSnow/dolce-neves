import CalendarView from "@/components/admin/encomendas/CalendarView";
import {
  getDailyOrderSummary,
  getOrdersByDateRange,
} from "@/lib/actions/orders";
import Link from "next/link";

export default async function AgendaPage() {
  // Load 3 months of data for calendar navigation
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  const [ordersResult, summariesResult] = await Promise.all([
    getOrdersByDateRange(startStr, endStr),
    getDailyOrderSummary(startStr, endStr),
  ]);

  const orders = ordersResult.data || [];
  const summaries = summariesResult.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-dolce-marrom font-bold">
            Agenda de Encomendas
          </h1>
          <p className="font-body text-sm text-dolce-marrom/50 mt-1">
            Visualize e gerencie todos os pedidos no calendário.
          </p>
        </div>
        <Link
          href="/admin/encomendas/pedidos/novo"
          className="px-4 py-2.5 rounded-xl bg-dolce-rosa text-white font-body text-sm font-medium hover:bg-dolce-rosa/90 transition-colors flex items-center gap-2"
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
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Pedido
        </Link>
      </div>

      <CalendarView orders={orders} summaries={summaries} />
    </div>
  );
}
