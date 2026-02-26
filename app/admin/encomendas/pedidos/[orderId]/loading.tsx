export default function OrderDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-32 bg-dolce-marrom/10 rounded mb-6" />
      <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6 space-y-4">
        <div className="h-8 w-64 bg-dolce-marrom/10 rounded-lg" />
        <div className="h-4 w-48 bg-dolce-marrom/5 rounded" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="h-20 bg-dolce-marrom/5 rounded-xl" />
          <div className="h-20 bg-dolce-marrom/5 rounded-xl" />
        </div>
        <div className="h-32 bg-dolce-marrom/5 rounded-xl mt-4" />
        <div className="h-12 bg-dolce-marrom/5 rounded-xl mt-4" />
      </div>
    </div>
  );
}
