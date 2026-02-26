"use client";

interface PriceEstimateProps {
  min: number;
  max: number;
  totalSweets: number;
  guestCount: number;
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function PriceEstimate({
  min,
  max,
  totalSweets,
  guestCount,
}: PriceEstimateProps) {
  const perPerson = guestCount > 0 ? (min + max) / 2 / guestCount : 0;

  return (
    <div className="bg-gradient-to-br from-dolce-marrom to-dolce-marrom/90 rounded-2xl p-6 text-white">
      <h3 className="font-display text-lg font-semibold mb-4">
        💰 Estimativa de Investimento
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="font-body text-xs text-white/60 mb-1">Total de doces</p>
          <p className="font-display text-2xl font-bold">{totalSweets}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="font-body text-xs text-white/60 mb-1">Por pessoa</p>
          <p className="font-display text-2xl font-bold">
            {formatBRL(perPerson)}
          </p>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4 text-center">
        <p className="font-body text-xs text-white/60 mb-2">
          Faixa de preço estimada
        </p>
        <p className="font-display text-3xl font-bold">
          {formatBRL(min)}
          <span className="text-white/50 mx-2">—</span>
          {formatBRL(max)}
        </p>
      </div>

      <p className="font-body text-xs text-white/40 mt-3 text-center">
        * Valores estimados com base nos preços do cardápio atual. O valor final
        pode variar conforme personalização e disponibilidade.
      </p>
    </div>
  );
}
