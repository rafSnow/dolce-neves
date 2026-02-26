export function ProductSkeleton() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="status"
      aria-label="Carregando produtos"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {/* Imagem skeleton */}
          <div className="aspect-square bg-dolce-rosa/5 animate-pulse" />

          {/* Conteudo skeleton */}
          <div className="p-5 space-y-3">
            <div className="h-3 w-16 bg-dolce-rosa/10 rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-dolce-rosa/10 rounded animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-dolce-rosa/5 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-dolce-rosa/5 rounded animate-pulse" />
            </div>
            <div className="h-7 w-20 bg-dolce-rosa/10 rounded animate-pulse" />
            <div className="flex gap-2 pt-1">
              <div className="h-10 flex-1 bg-dolce-rosa/5 rounded-full animate-pulse" />
              <div className="h-10 flex-1 bg-dolce-rosa/10 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Carregando produtos...</span>
    </div>
  );
}
