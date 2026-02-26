"use client";

import type { NPSScore } from "@/types/qr";
import { NPS_EMOJIS, NPS_LABELS } from "@/types/qr";
import { useState } from "react";

interface NPSSelectorProps {
  value: NPSScore | null;
  onChange: (score: NPSScore) => void;
}

const scores: NPSScore[] = [1, 2, 3, 4, 5];

export default function NPSSelector({ value, onChange }: NPSSelectorProps) {
  const [hovered, setHovered] = useState<NPSScore | null>(null);
  const displayScore = hovered || value;

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-3 sm:gap-5">
        {scores.map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            onMouseEnter={() => setHovered(score)}
            onMouseLeave={() => setHovered(null)}
            className={`
              flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200
              ${
                value === score
                  ? "scale-125 bg-dolce-rosa-claro ring-2 ring-dolce-rosa"
                  : "hover:scale-110 hover:bg-dolce-rosa-claro/50"
              }
            `}
          >
            <span
              className={`text-3xl sm:text-4xl transition-transform duration-200 ${
                value === score ? "animate-bounce" : ""
              }`}
            >
              {NPS_EMOJIS[score]}
            </span>
            <span className="font-body text-xs text-dolce-marrom/60">
              {score}
            </span>
          </button>
        ))}
      </div>
      {displayScore && (
        <p className="text-center font-body text-sm text-dolce-rosa font-medium animate-fade-in">
          {NPS_LABELS[displayScore]}
        </p>
      )}
    </div>
  );
}
