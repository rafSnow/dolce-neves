"use client";

interface QRStatsProps {
  total: number;
  scanned: number;
  feedbacks: number;
  avgNPS: number | null;
}

export default function QRStats({
  total,
  scanned,
  feedbacks,
  avgNPS,
}: QRStatsProps) {
  const npsColor =
    avgNPS !== null
      ? avgNPS >= 4.5
        ? "text-emerald-600"
        : avgNPS >= 3.5
          ? "text-amber-600"
          : "text-red-600"
      : "text-dolce-marrom/40";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white rounded-2xl p-4 border border-dolce-marrom/5">
        <p className="font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
          QR Gerados
        </p>
        <p className="font-display text-2xl text-dolce-marrom font-bold mt-1">
          {total}
        </p>
      </div>
      <div className="bg-white rounded-2xl p-4 border border-dolce-marrom/5">
        <p className="font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
          📱 Escaneados
        </p>
        <p className="font-display text-2xl text-dolce-marrom font-bold mt-1">
          {scanned}
        </p>
      </div>
      <div className="bg-white rounded-2xl p-4 border border-dolce-marrom/5">
        <p className="font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
          Feedbacks
        </p>
        <p className="font-display text-2xl text-dolce-marrom font-bold mt-1">
          {feedbacks}
        </p>
      </div>
      <div className="bg-white rounded-2xl p-4 border border-dolce-marrom/5">
        <p className="font-body text-xs text-dolce-marrom/50 uppercase tracking-wide">
          NPS Médio
        </p>
        <p className={`font-display text-2xl font-bold mt-1 ${npsColor}`}>
          {avgNPS !== null ? `★ ${avgNPS.toFixed(1)}` : "—"}
        </p>
      </div>
    </div>
  );
}
