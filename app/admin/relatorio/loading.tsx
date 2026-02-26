export default function RelatorioLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-dolce-marrom/10 rounded w-56 mb-2" />
      <div className="h-4 bg-dolce-marrom/5 rounded w-72 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-dolce-marrom/5 p-5 h-24"
          />
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6 h-96" />
    </div>
  );
}
