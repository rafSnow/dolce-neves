"use client";

import type { BoxSlot as BoxSlotType } from "@/types/box-builder";
import { useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import { EmptySlotHint } from "./EmptySlotHint";

interface BoxSlotProps {
  slot: BoxSlotType;
  onRemove: () => void;
  isDragActive: boolean;
  justDropped: boolean;
  isInvalid: boolean;
}

export function BoxSlot({
  slot,
  onRemove,
  isDragActive,
  justDropped,
  isInvalid,
}: BoxSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: slot.id,
  });

  const isEmpty = !slot.product;
  const showDropHint = isEmpty && isDragActive;
  const showDropHere = isEmpty && isOver;

  return (
    <div
      ref={setNodeRef}
      className={`
        relative aspect-square rounded-xl transition-all duration-200
        ${
          isEmpty
            ? `border-2 border-dashed flex items-center justify-center
               ${
                 isInvalid
                   ? "border-red-400 bg-red-50 animate-box-shake"
                   : showDropHere
                     ? "border-dolce-rosa bg-dolce-rosa-claro/60 scale-105"
                     : showDropHint
                       ? "border-dolce-rosa/50 bg-dolce-rosa-claro/30"
                       : "border-dolce-marrom/15 bg-white/60 hover:border-dolce-rosa/40"
               }`
            : `border-2 border-transparent bg-white shadow-sm group
               ${justDropped ? "animate-box-bounce" : ""}
               ${isInvalid ? "border-red-400 animate-box-shake" : "hover:shadow-md"}`
        }
      `}
    >
      {isEmpty ? (
        <>
          {showDropHere ? (
            <EmptySlotHint />
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={`transition-opacity ${showDropHint ? "opacity-40" : "opacity-20"}`}
              aria-hidden="true"
            >
              <path
                d="M10 4v12M4 10h12"
                stroke="#C96B7A"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </>
      ) : (
        <>
          {/* Product image */}
          <div className="absolute inset-1.5 rounded-lg overflow-hidden">
            <Image
              src={slot.product!.image_url}
              alt={slot.product!.name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>

          {/* Product name */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg p-1">
            <p className="text-white text-[8px] sm:text-[9px] font-body font-medium truncate text-center leading-tight">
              {slot.product!.name}
            </p>
          </div>

          {/* Remove button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-dolce-marrom/80 text-white flex items-center justify-center
              opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100
              max-sm:opacity-100
              transition-opacity duration-200 hover:bg-red-500 z-10"
            aria-label={`Remover ${slot.product!.name}`}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2l6 6M8 2l-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
