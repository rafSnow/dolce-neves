"use client";

import type {
  BoxConfig,
  BoxItem,
  BoxSize,
  BoxSummary,
} from "@/types/box-builder";
import { createEmptySlots } from "@/types/box-builder";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "dolce-neves-box";

function loadFromStorage(): BoxConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BoxConfig;
    if (
      parsed &&
      (parsed.size === 9 || parsed.size === 16 || parsed.size === 25) &&
      Array.isArray(parsed.slots) &&
      parsed.slots.length === parsed.size
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveToStorage(config: BoxConfig) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useBoxBuilder() {
  const [boxConfig, setBoxConfig] = useState<BoxConfig>(() => {
    const saved = loadFromStorage();
    return saved ?? { size: 9, slots: createEmptySlots(9) };
  });
  const [isDragging, setIsDragging] = useState(false);

  // Persist to sessionStorage on every change
  useEffect(() => {
    saveToStorage(boxConfig);
  }, [boxConfig]);

  const filledCount = useMemo(
    () => boxConfig.slots.filter((s) => s.product !== null).length,
    [boxConfig.slots],
  );

  const isEmpty = filledCount === 0;
  const isFull = filledCount === boxConfig.size;

  const boxSummary = useMemo<BoxSummary>(() => {
    const map = new Map<string, BoxItem>();
    for (const slot of boxConfig.slots) {
      if (!slot.product) continue;
      const existing = map.get(slot.product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        map.set(slot.product.id, { product: slot.product, quantity: 1 });
      }
    }
    const items = Array.from(map.values()).sort((a, b) =>
      a.product.name.localeCompare(b.product.name),
    );
    const totalPrice = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    return { items, totalPrice };
  }, [boxConfig.slots]);

  const selectSize = useCallback(
    (size: BoxSize) => {
      if (size === boxConfig.size) return;
      // Keep products that fit in the new size
      const currentProducts = boxConfig.slots
        .filter((s) => s.product !== null)
        .map((s) => s.product!);
      const newSlots = createEmptySlots(size);
      const productsToKeep = currentProducts.slice(0, size);
      productsToKeep.forEach((p, i) => {
        newSlots[i].product = p;
      });
      setBoxConfig({ size, slots: newSlots });
    },
    [boxConfig],
  );

  const addToSlot = useCallback((slotId: string, product: Product) => {
    setBoxConfig((prev) => {
      const newSlots = prev.slots.map((slot) =>
        slot.id === slotId ? { ...slot, product } : slot,
      );
      return { ...prev, slots: newSlots };
    });
  }, []);

  const removeFromSlot = useCallback((slotId: string) => {
    setBoxConfig((prev) => {
      const newSlots = prev.slots.map((slot) =>
        slot.id === slotId ? { ...slot, product: null } : slot,
      );
      return { ...prev, slots: newSlots };
    });
  }, []);

  const clearBox = useCallback(() => {
    setBoxConfig((prev) => ({
      ...prev,
      slots: createEmptySlots(prev.size),
    }));
  }, []);

  const generateWhatsAppMessage = useCallback(() => {
    if (isEmpty) return "";

    const lines = boxSummary.items.map(
      (item) =>
        `• ${item.quantity > 1 ? `${item.quantity}x ` : ""}${item.product.name}`,
    );

    const total = boxSummary.totalPrice.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return [
      `Olá! Montei minha caixa de ${boxConfig.size} bombons na Dolce Neves 🍫`,
      "",
      "Minha seleção:",
      ...lines,
      "",
      `Total estimado: ${total}`,
      "Poderia confirmar disponibilidade?",
    ].join("\n");
  }, [boxConfig.size, boxSummary, isEmpty]);

  return {
    boxConfig,
    boxSummary,
    isDragging,
    setIsDragging,
    filledCount,
    isEmpty,
    isFull,
    selectSize,
    addToSlot,
    removeFromSlot,
    clearBox,
    generateWhatsAppMessage,
  };
}
