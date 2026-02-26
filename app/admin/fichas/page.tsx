import { getProductCostSummary } from "@/lib/actions/pricing";
import type { ProductCostSummary } from "@/types/pricing";
import Link from "next/link";

function HealthBadge({ summary }: { summary: ProductCostSummary }) {
  const totalCost = Number(summary.total_cost ?? 0);
  const currentPrice = Number(summary.current_price ?? 0);

  if (totalCost === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-body text-xs">
        ⚪ Sem ficha
      </span>
    );
  }

  if (summary.is_profitable) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-body text-xs">
        🟢 Lucrativo
      </span>
    );
  }

  const diff = currentPrice - totalCost;
  if (Math.abs(diff) < 0.5) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-body text-xs">
        🟡 Atenção
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-body text-xs">
      🔴 Prejuízo
    </span>
  );
}

function formatBRL(value: number | string | null) {
  const n = Number(value ?? 0);
  return `R$ ${n.toFixed(2).replace(".", ",")}`;
}

export default async function FichasPage() {
  const summaries = await getProductCostSummary();

  const lossCount = summaries.filter((s) => {
    const totalCost = Number(s.total_cost ?? 0);
    const price = Number(s.current_price ?? 0);
    return totalCost > 0 && price < totalCost;
  }).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
        <div>
          <h1 className="font-display text-2xl text-dolce-marrom font-bold mb-1">
            Fichas Técnicas
          </h1>
          <p className="font-body text-sm text-dolce-marrom/60">
            Monte as receitas, configure custos e ajuste a precificação.
          </p>
        </div>
        {lossCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200">
            <span className="text-red-600 font-body text-sm font-medium">
              🔴 {lossCount} produto{lossCount !== 1 ? "s" : ""} com prejuízo
            </span>
          </div>
        )}
      </div>

      {summaries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-12 text-center">
          <p className="font-body text-sm text-dolce-marrom/40">
            Nenhum produto cadastrado no cardápio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map((summary) => {
            const totalCost = Number(summary.total_cost ?? 0);
            const suggestedPrice = Number(summary.suggested_price ?? 0);
            const currentPrice = Number(summary.current_price ?? 0);

            return (
              <Link
                key={summary.product_id}
                href={`/admin/fichas/${summary.product_id}`}
                className="bg-white rounded-2xl border border-dolce-marrom/5 p-5 hover:shadow-lg hover:border-dolce-rosa/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-display text-base text-dolce-marrom font-semibold group-hover:text-dolce-rosa transition-colors line-clamp-2">
                    {summary.product_name}
                  </h3>
                  <HealthBadge summary={summary} />
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between font-body text-xs">
                    <span className="text-dolce-marrom/50">Custo total</span>
                    <span className="text-dolce-marrom tabular-nums">
                      {totalCost > 0 ? formatBRL(totalCost) : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-body text-xs">
                    <span className="text-dolce-marrom/50">Preço sugerido</span>
                    <span className="text-dolce-marrom tabular-nums">
                      {suggestedPrice > 0 ? formatBRL(suggestedPrice) : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-body text-xs">
                    <span className="text-dolce-marrom/50">Preço atual</span>
                    <span className="text-dolce-marrom font-medium tabular-nums">
                      {formatBRL(currentPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-dolce-rosa font-body text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Editar ficha →
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
