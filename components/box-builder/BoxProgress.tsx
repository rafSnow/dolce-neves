"use client";

import { useEffect, useState } from "react";

interface BoxProgressProps {
  filledCount: number;
  totalSlots: number;
  isFull: boolean;
  isEmpty: boolean;
}

export function BoxProgress({
  filledCount,
  totalSlots,
  isFull,
  isEmpty,
}: BoxProgressProps) {
  const percentage = (filledCount / totalSlots) * 100;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isFull) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
    setShowConfetti(false);
  }, [isFull]);

  // Dynamic color based on fill
  const barColor = isFull ? "#3D2314" : percentage > 50 ? "#C96B7A" : "#FAE8EC";

  const barBg = isFull
    ? "bg-dolce-marrom"
    : percentage > 50
      ? "bg-dolce-rosa"
      : "bg-dolce-rosa-claro";

  return (
    <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl mx-auto mb-4 relative">
      {/* Confetti */}
      {showConfetti && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden -top-8"
          aria-hidden="true"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: [
                  "#C96B7A",
                  "#FAE8EC",
                  "#3D2314",
                  "#F7F0E8",
                  "#FFD700",
                ][i % 5],
              }}
            />
          ))}
        </div>
      )}

      {/* Text */}
      <div className="flex items-center justify-between mb-2">
        <p className="font-body text-sm text-dolce-marrom/70">
          {isEmpty ? (
            <span className="flex items-center gap-1">
              Comece arrastando os sabores
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="animate-bounce-x"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M10 5l3 3-3 3"
                  stroke="#C96B7A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          ) : isFull ? (
            <span className="font-semibold text-dolce-marrom">
              Sua caixa esta completa! 🎉
            </span>
          ) : (
            <span>
              <strong>{filledCount}</strong> de <strong>{totalSlots}</strong>{" "}
              slots preenchidos
            </span>
          )}
        </p>
        {!isEmpty && !isFull && (
          <span className="font-body text-xs text-dolce-marrom/40">
            {totalSlots - filledCount} restante
            {totalSlots - filledCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-dolce-marrom/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barBg}`}
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
}
