import type { Product } from "./product";

export type BoxSize = 9 | 16 | 25;

export interface BoxSlot {
  id: string;
  product: Product | null;
}

export interface BoxConfig {
  size: BoxSize;
  slots: BoxSlot[];
}

export interface BoxItem {
  product: Product;
  quantity: number;
}

export interface BoxSummary {
  items: BoxItem[];
  totalPrice: number;
}

export type DragState = "idle" | "dragging" | "over-slot" | "invalid";

export const BOX_OPTIONS: {
  size: BoxSize;
  label: string;
  occasion: string;
  cols: number;
}[] = [
  { size: 9, label: "Caixa de 9", occasion: "Para presentear", cols: 3 },
  {
    size: 16,
    label: "Caixa de 16",
    occasion: "Perfeita para festas",
    cols: 4,
  },
  {
    size: 25,
    label: "Caixa de 25",
    occasion: "Eventos especiais",
    cols: 5,
  },
];

export function createEmptySlots(size: BoxSize): BoxSlot[] {
  return Array.from({ length: size }, (_, i) => ({
    id: `slot-${i}`,
    product: null,
  }));
}
