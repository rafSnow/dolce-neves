export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-40 bg-dolce-rosa-claro/50 rounded animate-pulse" />
        <div className="h-4 w-64 bg-dolce-rosa-claro/30 rounded animate-pulse mt-2" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-dolce-marrom/5"
          >
            <div className="h-3 w-20 bg-dolce-rosa-claro/30 rounded animate-pulse mb-2" />
            <div className="h-7 w-16 bg-dolce-rosa-claro/50 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Alerts skeleton */}
      <div className="h-12 bg-dolce-rosa-claro/20 rounded-xl animate-pulse" />

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-dolce-marrom/5">
          <div className="h-5 w-48 bg-dolce-rosa-claro/50 rounded animate-pulse mb-4" />
          <div className="h-64 bg-dolce-rosa-claro/10 rounded-xl animate-pulse" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-dolce-marrom/5">
          <div className="h-5 w-48 bg-dolce-rosa-claro/50 rounded animate-pulse mb-4" />
          <div className="h-64 bg-dolce-rosa-claro/10 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
