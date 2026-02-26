"use client";

import type { BoxConfig, DragState } from "@/types/box-builder";
import { BoxSlot } from "./BoxSlot";

interface BoxGridProps {
  boxConfig: BoxConfig;
  onRemove: (slotId: string) => void;
  dragState: DragState;
  lastDroppedSlot: string | null;
  invalidSlot: string | null;
}

export function BoxGrid({
  boxConfig,
  onRemove,
  dragState,
  lastDroppedSlot,
  invalidSlot,
}: BoxGridProps) {
  const cols = boxConfig.size === 9 ? 3 : boxConfig.size === 16 ? 4 : 5;

  return (
    <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl mx-auto animate-scaleIn">
      {/* Box container with decorative border */}
      <div
        className="relative rounded-2xl p-3 sm:p-4"
        style={{
          background:
            "linear-gradient(135deg, #F7F0E8 0%, #FAE8EC 50%, #F7F0E8 100%)",
          boxShadow:
            "inset 0 2px 8px rgba(61, 35, 20, 0.08), 0 4px 20px rgba(201, 107, 122, 0.12)",
          border: "3px double rgba(201, 107, 122, 0.3)",
        }}
      >
        {/* Inner decorative frame */}
        <div
          className="rounded-xl p-2 sm:p-3"
          style={{
            border: "1px solid rgba(201, 107, 122, 0.15)",
            background: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <div
            className="grid gap-2 sm:gap-3"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {boxConfig.slots.map((slot) => (
              <BoxSlot
                key={slot.id}
                slot={slot}
                onRemove={() => onRemove(slot.id)}
                isDragActive={
                  dragState === "dragging" || dragState === "over-slot"
                }
                justDropped={lastDroppedSlot === slot.id}
                isInvalid={invalidSlot === slot.id}
              />
            ))}
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-dolce-rosa/20 rounded-tl-lg" />
        <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-dolce-rosa/20 rounded-tr-lg" />
        <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-dolce-rosa/20 rounded-bl-lg" />
        <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-dolce-rosa/20 rounded-br-lg" />
      </div>
    </div>
  );
}
