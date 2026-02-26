export default function CalculadoraLoading() {
  return (
    <div className="min-h-screen bg-dolce-creme">
      {/* Header skeleton */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="h-8 w-64 bg-dolce-rosa-claro/50 rounded animate-pulse mx-auto" />
          <div className="h-4 w-96 bg-dolce-rosa-claro/30 rounded animate-pulse mx-auto mt-3" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Step 1 skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="h-6 w-48 bg-dolce-rosa-claro/50 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-dolce-rosa-claro/20 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Step 2 skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="h-6 w-48 bg-dolce-rosa-claro/50 rounded animate-pulse mb-4" />
          <div className="h-16 bg-dolce-rosa-claro/20 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
