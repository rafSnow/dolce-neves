"use client";

import type { Product } from "@/types/product";
import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";

interface ProductPaletteCardProps {
  product: Product;
  count: number;
  compact?: boolean;
}

export function ProductPaletteCard({
  product,
  count,
  compact = false,
}: ProductPaletteCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: product.id,
    data: { product },
  });

  const price = product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`
          w-24 flex flex-col items-center p-2 rounded-xl border border-dolce-marrom/10
          bg-white cursor-grab active:cursor-grabbing select-none
          transition-all duration-200 touch-none
          ${isDragging ? "opacity-50 shadow-lg scale-95" : "hover:shadow-md hover:border-dolce-rosa/30"}
        `}
        role="button"
        aria-label={`Arrastar ${product.name} para a caixa`}
        aria-roledescription="Sabor arrastável"
      >
        <div className="relative w-16 h-16 rounded-lg overflow-hidden mb-1">
          <Image
            src={product.image_url}
            alt={product.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            unoptimized
          />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-dolce-rosa text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              +{count}
            </span>
          )}
        </div>
        <p className="font-body text-[10px] text-dolce-marrom text-center leading-tight truncate w-full">
          {product.name}
        </p>
        <p className="font-body text-[10px] text-dolce-rosa font-semibold">
          {price}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-2 rounded-xl border border-dolce-marrom/10
        bg-white cursor-grab active:cursor-grabbing select-none
        transition-all duration-200 touch-none
        ${isDragging ? "opacity-50 shadow-lg scale-95" : "hover:shadow-md hover:border-dolce-rosa/30"}
      `}
      role="button"
      aria-label={`Arrastar ${product.name} para a caixa`}
      aria-roledescription="Sabor arrastável"
    >
      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
        <Image
          src={product.image_url}
          alt={product.name}
          width={48}
          height={48}
          className="w-full h-full object-cover"
          unoptimized
        />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-dolce-rosa text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            +{count}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-dolce-marrom font-medium truncate">
          {product.name}
        </p>
        <p className="font-body text-xs text-dolce-rosa font-semibold">
          {price}
        </p>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-dolce-marrom/20 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M4 6h8M4 10h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
