export default function FichaDetalheLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-5 bg-dolce-marrom/10 rounded w-32 mb-4" />
      <div className="h-8 bg-dolce-marrom/10 rounded w-64 mb-2" />
      <div className="h-4 bg-dolce-marrom/5 rounded w-48 mb-8" />
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6 h-64" />
        <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6 h-40" />
        <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6 h-48" />
      </div>
    </div>
  );
}
