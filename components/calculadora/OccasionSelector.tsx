"use client";

import type { OccasionType } from "@/types/party-calculator";
import { OCCASION_ICONS, OCCASION_LABELS } from "@/types/party-calculator";

const occasions: OccasionType[] = [
  "casamento",
  "aniversario_infantil",
  "aniversario_adulto",
  "corporativo",
  "cha_bebe",
  "formatura",
];

interface OccasionSelectorProps {
  selected: OccasionType | null;
  onSelect: (occasion: OccasionType) => void;
}

export default function OccasionSelector({
  selected,
  onSelect,
}: OccasionSelectorProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-dolce-marrom mb-1">
        1. Qual é a ocasião?
      </h2>
      <p className="font-body text-sm text-dolce-marrom/50 mb-4">
        Cada tipo de evento tem uma quantidade ideal de doces por pessoa
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {occasions.map((occasion) => {
          const isSelected = selected === occasion;
          return (
            <button
              key={occasion}
              onClick={() => onSelect(occasion)}
              className={`
                relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl
                border-2 transition-all duration-200 font-body text-sm
                ${
                  isSelected
                    ? "border-dolce-rosa bg-dolce-rosa-claro/50 shadow-md scale-[1.02]"
                    : "border-dolce-creme bg-white hover:border-dolce-rosa/30 hover:shadow-sm"
                }
              `}
            >
              <span className="text-2xl" role="img" aria-hidden="true">
                {OCCASION_ICONS[occasion]}
              </span>
              <span
                className={`font-semibold text-center leading-tight ${
                  isSelected ? "text-dolce-rosa" : "text-dolce-marrom"
                }`}
              >
                {OCCASION_LABELS[occasion]}
              </span>
              {isSelected && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-dolce-rosa rounded-full flex items-center justify-center">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
