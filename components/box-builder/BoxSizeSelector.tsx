"use client";

import type { BoxSize } from "@/types/box-builder";
import { BOX_OPTIONS } from "@/types/box-builder";

interface BoxSizeSelectorProps {
  selectedSize: BoxSize;
  onSelectSize: (size: BoxSize) => void;
}

function BoxIcon({ size }: { size: BoxSize }) {
  const cols = size === 9 ? 3 : size === 16 ? 4 : 5;
  const cellSize = 6;
  const gap = 2;
  const totalSize = cols * cellSize + (cols - 1) * gap;

  const cells: { key: string; x: number; y: number }[] = [];
  for (let row = 0; row < cols; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        key: `${row}-${col}`,
        x: col * (cellSize + gap),
        y: row * (cellSize + gap),
      });
    }
  }

  return (
    <svg
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      fill="none"
      aria-hidden="true"
      className="mx-auto mb-2"
      suppressHydrationWarning
    >
      {cells.map((cell) => (
        <rect
          key={cell.key}
          x={cell.x}
          y={cell.y}
          width={cellSize}
          height={cellSize}
          rx={1}
          fill="currentColor"
          opacity={0.6}
        />
      ))}
    </svg>
  );
}

export function BoxSizeSelector({
  selectedSize,
  onSelectSize,
}: BoxSizeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {BOX_OPTIONS.map((option) => {
        const isSelected = selectedSize === option.size;
        return (
          <button
            key={option.size}
            onClick={() => onSelectSize(option.size)}
            className={`
              relative flex-1 p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-center group
              ${
                isSelected
                  ? "border-dolce-rosa bg-dolce-rosa-claro/50 shadow-md"
                  : "border-dolce-marrom/10 bg-white hover:border-dolce-rosa/40 hover:shadow-sm"
              }
            `}
            aria-pressed={isSelected}
          >
            {/* Check mark */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-dolce-rosa flex items-center justify-center animate-scaleIn">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 7L6 10L11 4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            <div
              className={`transition-colors ${isSelected ? "text-dolce-rosa" : "text-dolce-marrom/40 group-hover:text-dolce-rosa/60"}`}
            >
              <BoxIcon size={option.size} />
            </div>

            <p
              className={`font-display text-lg font-bold mb-1 ${isSelected ? "text-dolce-marrom" : "text-dolce-marrom/80"}`}
            >
              {option.size} un
            </p>
            <p className="font-body text-xs text-dolce-marrom/50">
              {option.occasion}
            </p>
          </button>
        );
      })}
    </div>
  );
}
