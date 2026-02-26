export default function QRCodesLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-40 bg-dolce-marrom/10 rounded-lg" />
        <div className="h-4 w-72 bg-dolce-marrom/5 rounded mt-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-dolce-marrom/5"
          >
            <div className="h-3 w-16 bg-dolce-marrom/5 rounded mb-2" />
            <div className="h-8 w-12 bg-dolce-marrom/10 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 py-3 border-b border-dolce-marrom/5 last:border-0"
          >
            <div className="h-4 w-32 bg-dolce-marrom/5 rounded" />
            <div className="h-4 w-20 bg-dolce-marrom/5 rounded" />
            <div className="h-4 w-20 bg-dolce-marrom/5 rounded" />
            <div className="h-4 w-8 bg-dolce-marrom/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
