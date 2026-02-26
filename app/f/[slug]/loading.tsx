export default function FeedbackLoading() {
  return (
    <main className="min-h-screen bg-dolce-creme flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dolce-rosa/20 flex items-center justify-center animate-pulse">
          <span className="text-2xl">🍫</span>
        </div>
        <h1 className="font-display text-xl text-dolce-marrom font-bold animate-pulse">
          Dolce Neves
        </h1>
        <div className="mt-4 w-48 h-2 bg-dolce-marrom/10 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-dolce-rosa rounded-full animate-[loading_1.5s_ease-in-out_infinite]"
            style={{ width: "40%" }}
          />
        </div>
      </div>
    </main>
  );
}
