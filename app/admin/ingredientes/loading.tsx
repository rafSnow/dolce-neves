export default function IngredientesLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-dolce-marrom/10 rounded w-48 mb-2" />
      <div className="h-4 bg-dolce-marrom/5 rounded w-72 mb-8" />
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 bg-dolce-marrom/5 rounded-xl w-64" />
        <div className="h-10 bg-dolce-rosa/20 rounded-xl w-40" />
      </div>
      <div className="bg-white rounded-2xl border border-dolce-marrom/5 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-6 py-4 border-b border-dolce-marrom/5"
          >
            <div className="h-4 bg-dolce-marrom/10 rounded flex-1" />
            <div className="h-4 bg-dolce-marrom/5 rounded w-20" />
            <div className="h-4 bg-dolce-marrom/5 rounded w-24" />
            <div className="h-4 bg-dolce-marrom/5 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
