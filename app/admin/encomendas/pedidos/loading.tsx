export default function PedidosLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-dolce-marrom/10 rounded-lg mb-2" />
      <div className="h-4 w-72 bg-dolce-marrom/5 rounded mb-8" />
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-dolce-marrom/10 rounded-full" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-white rounded-xl border border-dolce-marrom/5"
          />
        ))}
      </div>
    </div>
  );
}
