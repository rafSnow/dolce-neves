export default function CapacidadeLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-dolce-marrom/10 rounded-lg mb-2" />
      <div className="h-4 w-80 bg-dolce-marrom/5 rounded mb-8" />
      <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-20 bg-dolce-marrom/5 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
