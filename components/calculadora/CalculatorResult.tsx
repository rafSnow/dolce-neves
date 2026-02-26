"use client";

import type { PartySuggestion } from "@/types/party-calculator";
import { OCCASION_LABELS } from "@/types/party-calculator";
import CalculatorCTA from "./CalculatorCTA";
import PriceEstimate from "./PriceEstimate";
import ProductSuggestionCard from "./ProductSuggestionCard";

interface CalculatorResultProps {
  suggestion: PartySuggestion;
  onToggleProduct: (productId: string) => void;
}

export default function CalculatorResult({
  suggestion,
  onToggleProduct,
}: CalculatorResultProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-dolce-rosa-claro rounded-full flex items-center justify-center text-xl">
            🎉
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-dolce-marrom">
              Sugestão para seu evento
            </h3>
            <p className="font-body text-sm text-dolce-marrom/50">
              {OCCASION_LABELS[suggestion.occasion]} · {suggestion.guestCount}{" "}
              convidados
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dolce-creme rounded-xl p-3 text-center">
            <p className="font-body text-xs text-dolce-marrom/50">
              Doces por pessoa
            </p>
            <p className="font-display text-xl font-bold text-dolce-marrom">
              {Math.round(suggestion.totalSweets / suggestion.guestCount)}
            </p>
          </div>
          <div className="bg-dolce-creme rounded-xl p-3 text-center">
            <p className="font-body text-xs text-dolce-marrom/50">
              Total com margem
            </p>
            <p className="font-display text-xl font-bold text-dolce-rosa">
              {suggestion.totalWithBuffer}
            </p>
          </div>
          <div className="bg-dolce-creme rounded-xl p-3 text-center">
            <p className="font-body text-xs text-dolce-marrom/50">
              Margem de segurança
            </p>
            <p className="font-display text-xl font-bold text-dolce-marrom">
              +{suggestion.bufferPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Category distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-display text-base font-semibold text-dolce-marrom mb-3">
          📊 Distribuição por Categoria
        </h3>
        <div className="space-y-2">
          {suggestion.categoryDistribution.map((cat) => (
            <div key={cat.category} className="flex items-center gap-3">
              <span className="font-body text-sm text-dolce-marrom/70 w-32 truncate">
                {cat.category}
              </span>
              <div className="flex-1 bg-dolce-creme rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-dolce-rosa rounded-full transition-all duration-500"
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
              <span className="font-body text-xs text-dolce-marrom/50 w-20 text-right">
                {cat.quantity} un ({cat.percent}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Product suggestions */}
      {suggestion.products.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-display text-base font-semibold text-dolce-marrom mb-1">
            🍫 Produtos Sugeridos
          </h3>
          <p className="font-body text-xs text-dolce-marrom/50 mb-4">
            Toque para incluir ou remover produtos da estimativa
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestion.products.map((product) => (
              <ProductSuggestionCard
                key={product.id}
                product={product}
                onToggle={onToggleProduct}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price estimate */}
      <PriceEstimate
        min={suggestion.priceEstimate.min}
        max={suggestion.priceEstimate.max}
        totalSweets={suggestion.totalWithBuffer}
        guestCount={suggestion.guestCount}
      />

      {/* CTA */}
      <CalculatorCTA
        guestCount={suggestion.guestCount}
        occasion={OCCASION_LABELS[suggestion.occasion]}
        totalSweets={suggestion.totalWithBuffer}
      />
    </div>
  );
}
