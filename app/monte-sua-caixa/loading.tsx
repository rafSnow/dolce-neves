export default function MonteSuaCaixaLoading() {
  return (
    <main id="main-content" className="min-h-screen bg-dolce-creme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-12 bg-dolce-marrom/10 rounded animate-pulse" />
          <div className="h-4 w-4 bg-dolce-marrom/10 rounded animate-pulse" />
          <div className="h-4 w-28 bg-dolce-marrom/10 rounded animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="h-10 w-64 bg-dolce-marrom/10 rounded animate-pulse mb-2" />
        <div className="h-5 w-96 max-w-full bg-dolce-marrom/10 rounded animate-pulse mb-8" />

        {/* Size selector skeleton */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 w-40 bg-dolce-marrom/10 rounded-xl animate-pulse"
            />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-96 bg-dolce-marrom/10 rounded-xl animate-pulse" />
          <div className="h-96 bg-dolce-marrom/10 rounded-xl animate-pulse" />
          <div className="h-64 bg-dolce-marrom/10 rounded-xl animate-pulse" />
        </div>
      </div>
    </main>
  );
}
