"use client";

import type { Product } from "@/types/product";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLAnchorElement>(null);

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";
  const whatsappMessage = encodeURIComponent(
    `Ola! Vi o cardapio da Dolce Neves e quero pedir: ${product.name}. 🍫`,
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Fechar com ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab") {
        const focusableElements = overlayRef.current?.querySelectorAll(
          'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Focus no botao de fechar ao abrir
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Fechar ao clicar no overlay
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
        {/* Imagem */}
        <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
          <Image
            src={product.image_url}
            alt={`${product.name} - doce artesanal gourmet da Dolce Neves`}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
          />
          {/* Botao fechar */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="Fechar detalhes do produto"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 6L14 14M14 6L6 14"
                stroke="#3D2314"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {/* Badge */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-dolce-rosa text-xs font-body font-semibold px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Conteudo */}
        <div className="p-6 sm:p-8">
          <h2
            id="modal-title"
            className="font-display text-2xl sm:text-3xl font-bold text-dolce-marrom mb-2"
          >
            {product.name}
          </h2>

          <span className="inline-block text-dolce-rosa font-body text-xs font-semibold tracking-wider uppercase mb-4">
            {product.category}
          </span>

          <p className="font-body text-dolce-marrom/70 leading-relaxed mb-6">
            {product.description}
          </p>

          <p className="font-display text-3xl font-bold text-dolce-rosa mb-8">
            {formatPrice(product.price)}
          </p>

          {/* Botoes */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              ref={lastFocusableRef}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-dolce-rosa text-white font-body font-semibold rounded-full hover:bg-dolce-rosa/90 transition-all duration-300 shadow-md hover:shadow-lg text-center"
              aria-label={`Pedir ${product.name} pelo WhatsApp`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir pelo WhatsApp
            </a>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-dolce-marrom/20 text-dolce-marrom font-body font-semibold rounded-full hover:border-dolce-marrom/40 transition-all duration-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
