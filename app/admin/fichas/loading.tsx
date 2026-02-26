export default function FichasLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-dolce-marrom/10 rounded w-52 mb-2" />
      <div className="h-4 bg-dolce-marrom/5 rounded w-80 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-dolce-marrom/5 p-5"
          >
            <div className="h-5 bg-dolce-marrom/10 rounded w-3/4 mb-3" />
            <div className="h-3 bg-dolce-marrom/5 rounded w-1/2 mb-4" />
            <div className="h-8 bg-dolce-marrom/5 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
