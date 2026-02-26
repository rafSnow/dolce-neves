import { FichaEditor } from "@/components/admin/fichas/FichaEditor";
import {
  getCostBreakdown,
  getCostConfig,
  getIngredients,
  getProductIngredients,
} from "@/lib/actions/pricing";
import Link from "next/link";

interface FichaDetalhePageProps {
  params: Promise<{ productId: string }>;
}

export default async function FichaDetalhePage({
  params,
}: FichaDetalhePageProps) {
  const { productId } = await params;

  const [breakdown, allIngredients, productIngredients, costConfig] =
    await Promise.all([
      getCostBreakdown(productId),
      getIngredients(),
      getProductIngredients(productId),
      getCostConfig(productId),
    ]);

  return (
    <div>
      <Link
        href="/admin/fichas"
        className="inline-flex items-center gap-1 font-body text-sm text-dolce-marrom/50 hover:text-dolce-rosa transition-colors mb-4"
      >
        ← Voltar para fichas
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-2xl text-dolce-marrom font-bold mb-1">
          {breakdown.product_name}
        </h1>
        <p className="font-body text-sm text-dolce-marrom/50">
          {breakdown.product_category} · Ficha Técnica & Precificação
        </p>
      </div>

      <FichaEditor
        productId={productId}
        breakdown={breakdown}
        allIngredients={allIngredients}
        initialProductIngredients={productIngredients}
        initialCostConfig={costConfig}
      />
    </div>
  );
}
