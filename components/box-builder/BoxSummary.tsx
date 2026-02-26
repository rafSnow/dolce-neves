"use client";

import type {
  BoxSize,
  BoxSummary as BoxSummaryType,
} from "@/types/box-builder";
import { useCallback, useState } from "react";

interface BoxSummaryProps {
  boxSummary: BoxSummaryType;
  boxSize: BoxSize;
  isEmpty: boolean;
  isFull: boolean;
  onClear: () => void;
  generateWhatsAppMessage: () => string;
}

export function BoxSummary({
  boxSummary,
  boxSize,
  isEmpty,
  isFull,
  onClear,
  generateWhatsAppMessage,
}: BoxSummaryProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const phoneNumber =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999"
      : "5511999999999";

  const handleWhatsApp = useCallback(() => {
    setIsSending(true);
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => setIsSending(false), 1000);
  }, [generateWhatsAppMessage, phoneNumber]);

  const handleClear = useCallback(() => {
    onClear();
    setShowClearConfirm(false);
  }, [onClear]);

  const totalFormatted = boxSummary.totalPrice.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="bg-white rounded-2xl border border-dolce-marrom/10 p-4 sticky top-4">
      <h2 className="font-display text-lg font-bold text-dolce-marrom mb-3">
        Resumo do pedido
      </h2>

      {isEmpty ? (
        <div className="text-center py-8">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className="mx-auto mb-3 text-dolce-marrom/15"
            aria-hidden="true"
          >
            <rect
              x="8"
              y="12"
              width="32"
              height="28"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16 12V8a8 8 0 0116 0v4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="font-body text-sm text-dolce-marrom/40">
            Sua caixa esta vazia.
            <br />
            Arraste sabores para comecar!
          </p>
        </div>
      ) : (
        <>
          {/* Items list */}
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {boxSummary.items.map((item) => {
              const subtotal = (
                item.product.price * item.quantity
              ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
              return (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between py-1.5 border-b border-dolce-marrom/5 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-dolce-marrom truncate">
                      {item.quantity > 1 && (
                        <span className="font-semibold text-dolce-rosa mr-1">
                          {item.quantity}x
                        </span>
                      )}
                      {item.product.name}
                    </p>
                  </div>
                  <span className="font-body text-sm text-dolce-marrom/70 ml-2 shrink-0">
                    {subtotal}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="border-t-2 border-dolce-marrom/10 pt-3 mb-1">
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-bold text-dolce-marrom">
                Total estimado
              </span>
              <span className="font-display text-lg font-bold text-dolce-rosa">
                {totalFormatted}
              </span>
            </div>
          </div>
          <p className="font-body text-[10px] text-dolce-marrom/40 mb-4">
            * Preco final confirmado pela loja no WhatsApp
          </p>
        </>
      )}

      {/* CTA WhatsApp */}
      <button
        onClick={handleWhatsApp}
        disabled={isEmpty || isSending}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full font-body font-semibold text-sm transition-all duration-300
          ${
            isEmpty
              ? "bg-dolce-marrom/10 text-dolce-marrom/30 cursor-not-allowed"
              : "bg-[#25D366] text-white shadow-md hover:shadow-lg hover:bg-[#20BD5A] hover:-translate-y-0.5"
          }
        `}
      >
        {isSending ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-25"
              />
              <path
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-75"
              />
            </svg>
            Abrindo WhatsApp...
          </>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Finalizar pedido pelo WhatsApp
          </>
        )}
      </button>

      {/* Secondary actions */}
      {!isEmpty && (
        <div className="mt-3 space-y-2">
          {showClearConfirm ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-3 py-2 text-xs font-body font-medium text-dolce-marrom/60 border border-dolce-marrom/10 rounded-full hover:bg-dolce-creme transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClear}
                className="flex-1 px-3 py-2 text-xs font-body font-medium text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
              >
                Confirmar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full px-4 py-2 text-sm font-body font-medium text-dolce-marrom/50 border border-dolce-marrom/10 rounded-full hover:border-dolce-rosa/30 hover:text-dolce-rosa transition-colors"
            >
              Limpar caixa
            </button>
          )}
        </div>
      )}

      {/* Box info */}
      {isFull && (
        <div className="mt-3 p-3 bg-dolce-rosa-claro/50 rounded-xl">
          <p className="font-body text-xs text-dolce-marrom/60 text-center">
            🎁 Caixa de {boxSize} bombons completa e pronta para enviar!
          </p>
        </div>
      )}
    </div>
  );
}
