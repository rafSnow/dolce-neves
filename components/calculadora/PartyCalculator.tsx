"use client";

import { calculateParty } from "@/lib/party-calculator";
import type { OccasionType, PartySuggestion } from "@/types/party-calculator";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CalculatorResult from "./CalculatorResult";
import GuestCountInput from "./GuestCountInput";
import OccasionSelector from "./OccasionSelector";

const VALID_OCCASIONS: OccasionType[] = [
  "casamento",
  "aniversario_infantil",
  "aniversario_adulto",
  "corporativo",
  "cha_bebe",
  "formatura",
];

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
}

export default function PartyCalculator() {
  const searchParams = useSearchParams();
  const initialOccasion = searchParams.get("ocasiao");
  const parsedOccasion =
    initialOccasion && VALID_OCCASIONS.includes(initialOccasion as OccasionType)
      ? (initialOccasion as OccasionType)
      : null;

  const [occasion, setOccasion] = useState<OccasionType | null>(parsedOccasion);
  const [guestCount, setGuestCount] = useState(50);
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestion, setSuggestion] = useState<PartySuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar produtos do cardápio
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch {
        // Fallback: usar produtos mock se API falhar
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Recalcular automaticamente
  const recalculate = useCallback(() => {
    if (!occasion || guestCount < 5) {
      setSuggestion(null);
      return;
    }

    const result = calculateParty({ occasion, guestCount }, products);
    setSuggestion(result);
  }, [occasion, guestCount, products]);

  useEffect(() => {
    recalculate();
  }, [recalculate]);

  const handleToggleProduct = (productId: string) => {
    if (!suggestion) return;

    const updated = {
      ...suggestion,
      products: suggestion.products.map((p) =>
        p.id === productId ? { ...p, included: !p.included } : p,
      ),
    };

    // Recalcular preço com produtos incluídos
    const includedProducts = updated.products.filter((p) => p.included);
    const total = includedProducts.reduce(
      (sum, p) => sum + p.price * p.suggestedQuantity,
      0,
    );
    updated.priceEstimate = {
      min: Math.round(total * 0.9),
      max: Math.round(total * 1.1),
    };

    setSuggestion(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Step 1: Occasion */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <OccasionSelector selected={occasion} onSelect={setOccasion} />
      </div>

      {/* Step 2: Guest count */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <GuestCountInput value={guestCount} onChange={setGuestCount} />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-dolce-rosa border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 font-body text-sm text-dolce-marrom/50">
            Carregando produtos...
          </span>
        </div>
      )}

      {/* Results */}
      {!loading && suggestion && (
        <CalculatorResult
          suggestion={suggestion}
          onToggleProduct={handleToggleProduct}
        />
      )}

      {/* Empty state */}
      {!loading &&
        !suggestion &&
        occasion &&
        guestCount >= 5 &&
        products.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <p className="text-4xl mb-3">📋</p>
            <h3 className="font-display text-lg font-semibold text-dolce-marrom mb-2">
              Nenhum produto disponível
            </h3>
            <p className="font-body text-sm text-dolce-marrom/50">
              Os produtos estão sendo atualizados. Por favor, entre em contato
              pelo WhatsApp.
            </p>
          </div>
        )}

      {/* Prompt */}
      {!occasion && !loading && (
        <div className="text-center py-8">
          <p className="font-body text-dolce-marrom/40 text-sm">
            👆 Selecione a ocasião para começar
          </p>
        </div>
      )}
    </div>
  );
}
