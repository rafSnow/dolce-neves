"use client";

import { useBoxBuilder } from "@/hooks/useBoxBuilder";
import type { DragState } from "@/types/box-builder";
import type { Product } from "@/types/product";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Image from "next/image";
import { useCallback, useState } from "react";
import { BoxGrid } from "./BoxGrid";
import { BoxProgress } from "./BoxProgress";
import { BoxSizeSelector } from "./BoxSizeSelector";
import { BoxSummary } from "./BoxSummary";
import { ProductPalette } from "./ProductPalette";

interface BoxBuilderProps {
  products: Product[];
}

export function BoxBuilder({ products }: BoxBuilderProps) {
  const {
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
  } = useBoxBuilder();

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [dragState, setDragState] = useState<DragState>("idle");
  const [lastDroppedSlot, setLastDroppedSlot] = useState<string | null>(null);
  const [invalidSlot, setInvalidSlot] = useState<string | null>(null);
  const [showSizeConfirm, setShowSizeConfirm] = useState(false);
  const [pendingSize, setPendingSize] = useState<9 | 16 | 25 | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 8 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const productId = event.active.id as string;
      const product = products.find((p) => p.id === productId);
      if (product) {
        setActiveProduct(product);
        setIsDragging(true);
        setDragState("dragging");
        // Haptic feedback on mobile
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    },
    [products, setIsDragging],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (event.over) {
        const slotId = event.over.id as string;
        const slot = boxConfig.slots.find((s) => s.id === slotId);
        if (slot) {
          setDragState(slot.product ? "invalid" : "over-slot");
        }
      } else {
        setDragState("dragging");
      }
    },
    [boxConfig.slots],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setIsDragging(false);
      setDragState("idle");
      setActiveProduct(null);

      if (!over) return;

      const productId = active.id as string;
      const slotId = over.id as string;
      const product = products.find((p) => p.id === productId);
      const slot = boxConfig.slots.find((s) => s.id === slotId);

      if (!product || !slot) return;

      // If slot already has a product, show invalid feedback
      if (slot.product) {
        setInvalidSlot(slotId);
        setTimeout(() => setInvalidSlot(null), 600);
        return;
      }

      // Successful drop
      addToSlot(slotId, product);
      setLastDroppedSlot(slotId);
      setTimeout(() => setLastDroppedSlot(null), 500);

      // Mark first successful drag in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("dolce-first-drag-done", "true");
      }
    },
    [products, boxConfig.slots, addToSlot, setIsDragging],
  );

  const handleSizeChange = useCallback(
    (size: 9 | 16 | 25) => {
      if (!isEmpty) {
        setPendingSize(size);
        setShowSizeConfirm(true);
      } else {
        selectSize(size);
      }
    },
    [isEmpty, selectSize],
  );

  const confirmSizeChange = useCallback(() => {
    if (pendingSize) {
      selectSize(pendingSize);
    }
    setShowSizeConfirm(false);
    setPendingSize(null);
  }, [pendingSize, selectSize]);

  const cancelSizeChange = useCallback(() => {
    setShowSizeConfirm(false);
    setPendingSize(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Size Selector */}
        <BoxSizeSelector
          selectedSize={boxConfig.size}
          onSelectSize={handleSizeChange}
        />

        {/* Size change confirmation modal */}
        {showSizeConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-scaleIn">
              <h3 className="font-display text-lg font-bold text-dolce-marrom mb-2">
                Trocar tamanho da caixa?
              </h3>
              <p className="font-body text-dolce-marrom/60 text-sm mb-6">
                {filledCount > (pendingSize ?? 0)
                  ? `A nova caixa tem menos slots. Apenas os primeiros ${pendingSize} sabores serão mantidos.`
                  : "Seus sabores atuais serão mantidos na nova caixa."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelSizeChange}
                  className="flex-1 px-4 py-2 border-2 border-dolce-rosa text-dolce-rosa rounded-full font-body font-semibold hover:bg-dolce-rosa-claro transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmSizeChange}
                  className="flex-1 px-4 py-2 bg-dolce-rosa text-white rounded-full font-body font-semibold hover:bg-dolce-rosa/90 transition-colors"
                >
                  Trocar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 mt-6">
          {/* Left: Product Palette (desktop) */}
          <aside className="hidden lg:block">
            <ProductPalette
              products={products}
              boxConfig={boxConfig}
              isDragging={isDragging}
            />
          </aside>

          {/* Center: Box Grid + Progress */}
          <div className="flex flex-col items-center">
            <BoxProgress
              filledCount={filledCount}
              totalSlots={boxConfig.size}
              isFull={isFull}
              isEmpty={isEmpty}
            />
            <BoxGrid
              boxConfig={boxConfig}
              onRemove={removeFromSlot}
              dragState={dragState}
              lastDroppedSlot={lastDroppedSlot}
              invalidSlot={invalidSlot}
            />
          </div>

          {/* Right: Summary (desktop) */}
          <aside className="hidden lg:block">
            <BoxSummary
              boxSummary={boxSummary}
              boxSize={boxConfig.size}
              isEmpty={isEmpty}
              isFull={isFull}
              onClear={clearBox}
              generateWhatsAppMessage={generateWhatsAppMessage}
            />
          </aside>
        </div>

        {/* Mobile: Product Palette (horizontal scroll) */}
        <div className="lg:hidden mt-6">
          <ProductPalette
            products={products}
            boxConfig={boxConfig}
            isDragging={isDragging}
            isMobile
          />
        </div>

        {/* Mobile: Summary */}
        <div className="lg:hidden mt-6">
          <BoxSummary
            boxSummary={boxSummary}
            boxSize={boxConfig.size}
            isEmpty={isEmpty}
            isFull={isFull}
            onClear={clearBox}
            generateWhatsAppMessage={generateWhatsAppMessage}
          />
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeProduct ? (
          <div className="w-20 h-20 rounded-xl shadow-2xl border-2 border-dolce-rosa bg-white overflow-hidden opacity-90 rotate-3 scale-110 pointer-events-none">
            <Image
              src={activeProduct.image_url}
              alt={activeProduct.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
