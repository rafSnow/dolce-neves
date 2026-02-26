import { CategorySkeleton } from "@/components/cardapio/CategorySkeleton";
import { ProductSkeleton } from "@/components/cardapio/ProductSkeleton";

export default function CardapioLoading() {
  return (
    <main id="main-content" className="min-h-screen bg-dolce-creme">
      {/* Breadcrumb skeleton */}
      <div className="bg-white/60 border-b border-dolce-rosa/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-10 bg-dolce-rosa/10 rounded animate-pulse" />
            <div className="h-4 w-4 bg-dolce-rosa/10 rounded animate-pulse" />
            <div className="h-4 w-16 bg-dolce-rosa/10 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Header skeleton */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-4 w-32 bg-dolce-rosa/10 rounded animate-pulse mx-auto mb-4" />
          <div className="h-10 w-80 bg-dolce-rosa/10 rounded animate-pulse mx-auto mb-4" />
          <div className="h-6 w-96 max-w-full bg-dolce-rosa/10 rounded animate-pulse mx-auto" />
        </div>
      </section>

      {/* Filter skeleton */}
      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategorySkeleton />
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductSkeleton />
        </div>
      </section>
    </main>
  );
}
