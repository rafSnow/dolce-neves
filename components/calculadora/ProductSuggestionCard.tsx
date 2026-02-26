"use client";

import type { ProductSuggestion } from "@/types/party-calculator";
import Image from "next/image";

interface ProductSuggestionCardProps {
  product: ProductSuggestion;
  onToggle: (productId: string) => void;
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function ProductSuggestionCard({
  product,
  onToggle,
}: ProductSuggestionCardProps) {
  const subtotal = product.price * product.suggestedQuantity;

  return (
    <div
      className={`
        relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
        ${
          product.included
            ? "border-dolce-rosa bg-dolce-rosa-claro/20"
            : "border-dolce-creme bg-white opacity-60"
        }
      `}
    >
      {/* Image */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-dolce-creme shrink-0">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            🍫
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-body text-sm font-semibold text-dolce-marrom truncate">
          {product.name}
        </h4>
        <p className="font-body text-xs text-dolce-marrom/50">
          {product.category} · {formatBRL(product.price)}/un
        </p>
        <p className="font-body text-xs text-dolce-rosa font-semibold mt-0.5">
          {product.suggestedQuantity} unidades · {formatBRL(subtotal)}
        </p>
      </div>

      {/* Toggle */}
      <button
        onClick={() => onToggle(product.id)}
        className={`
          shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          transition-all duration-200
          ${
            product.included
              ? "bg-dolce-rosa text-white"
              : "bg-dolce-creme text-dolce-marrom/30 hover:bg-dolce-rosa-claro"
          }
        `}
        aria-label={
          product.included
            ? `Remover ${product.name}`
            : `Incluir ${product.name}`
        }
      >
        {product.included ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
      </button>
    </div>
  );
}
