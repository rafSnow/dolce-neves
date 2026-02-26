import { RelatorioClient } from "@/components/admin/relatorio/RelatorioClient";
import { getProductCostSummary } from "@/lib/actions/pricing";

export default async function RelatorioPage() {
  const summaries = await getProductCostSummary();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl text-dolce-marrom font-bold mb-1">
          Relatório de Preços
        </h1>
        <p className="font-body text-sm text-dolce-marrom/60">
          Visão consolidada da saúde financeira de todos os produtos.
        </p>
      </div>

      <RelatorioClient summaries={summaries} />
    </div>
  );
}
