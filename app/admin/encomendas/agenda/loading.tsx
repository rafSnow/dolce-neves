export default function AgendaLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-dolce-marrom/10 rounded-lg mb-2" />
      <div className="h-4 w-72 bg-dolce-marrom/5 rounded mb-8" />
      <div className="flex gap-2 mb-6">
        <div className="h-10 w-24 bg-dolce-marrom/10 rounded-lg" />
        <div className="h-10 w-24 bg-dolce-marrom/10 rounded-lg" />
        <div className="h-10 w-32 bg-dolce-marrom/10 rounded-lg" />
      </div>
      <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6">
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-24 bg-dolce-marrom/5 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
