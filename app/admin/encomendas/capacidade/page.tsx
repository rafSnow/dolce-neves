import CapacityCalendar from "@/components/admin/encomendas/CapacityCalendar";
import { getDailyOrderSummary } from "@/lib/actions/orders";

export default async function CapacidadePage() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 3, 0);
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  const { data: summaries } = await getDailyOrderSummary(startStr, endStr);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-dolce-marrom font-bold">
          Capacidade de Produção
        </h1>
        <p className="font-body text-sm text-dolce-marrom/50 mt-1">
          Configure a capacidade diária e visualize a ocupação. Clique em um dia
          para ajustar o limite.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6">
        <CapacityCalendar summaries={summaries || []} />
      </div>
    </div>
  );
}
