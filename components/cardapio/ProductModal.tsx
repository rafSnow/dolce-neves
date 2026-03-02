"use client";

import type { Product } from "@/types/product";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

const WhatsAppIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="white"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CloseIcon = () => (
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
);

export function ProductModal({ product, onClose }: ProductModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLAnchorElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";
  const whatsappMessage = encodeURIComponent(
    `Ola! Vi o cardapio da Dolce Neves e quero pedir: ${product.name}. 🍫`,
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusableElements =
          overlayRef.current?.querySelectorAll<HTMLElement>(
            'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
          );
        if (!focusableElements || focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
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
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  if (!mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* ── MOBILE / TABLET: Bottom Sheet ── */}
      <div
        className="
        lg:hidden
        relative bg-white w-full rounded-t-3xl shadow-2xl
        max-h-[92dvh] flex flex-col
        animate-slideUp
      "
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-dolce-marrom/20" />
        </div>

        {/* Botao fechar mobile */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-dolce-marrom/10 flex items-center justify-center hover:bg-dolce-marrom/20 transition-colors z-10"
          aria-label="Fechar detalhes do produto"
        >
          <CloseIcon />
        </button>

        {/* Scroll container */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* Imagem */}
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src={product.image_url}
              alt={`${product.name} - doce artesanal gourmet da Dolce Neves`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-dolce-rosa text-xs font-body font-semibold px-3 py-1 rounded-full shadow-sm">
              {product.category}
            </span>
          </div>

          {/* Conteudo */}
          <div className="p-6">
            <h2
              id="modal-title"
              className="font-display text-2xl font-bold text-dolce-marrom mb-1"
            >
              {product.name}
            </h2>
            <span className="inline-block text-dolce-rosa font-body text-xs font-semibold tracking-wider uppercase mb-3">
              {product.category}
            </span>
            <p className="font-body text-dolce-marrom/70 leading-relaxed mb-5">
              {product.description}
            </p>
            <p className="font-display text-3xl font-bold text-dolce-rosa mb-6">
              {formatPrice(product.price)}
            </p>
            <div className="flex flex-col gap-3 pb-safe">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-dolce-rosa text-white font-body font-semibold rounded-full hover:bg-dolce-rosa/90 transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label={`Pedir ${product.name} pelo WhatsApp`}
              >
                <WhatsAppIcon />
                Pedir pelo WhatsApp
              </a>
              <button
                onClick={onClose}
                className="px-6 py-3.5 border-2 border-dolce-marrom/20 text-dolce-marrom font-body font-semibold rounded-full hover:border-dolce-marrom/40 transition-all duration-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: Modal centralizado grande ── */}
      <div
        className="
        hidden lg:flex
        bg-white rounded-3xl shadow-2xl
        w-full max-w-3xl max-h-[88vh]
        overflow-hidden
        animate-scaleIn
        flex-row
      "
      >
        {/* Imagem lateral esquerda */}
        <div className="relative w-[44%] flex-shrink-0">
          <Image
            src={product.image_url}
            alt={`${product.name} - doce artesanal gourmet da Dolce Neves`}
            fill
            className="object-cover"
            sizes="560px"
            priority
          />
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-dolce-rosa text-xs font-body font-semibold px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Conteudo direito */}
        <div className="flex flex-col flex-1 overflow-y-auto p-8 xl:p-10">
          {/* Botao fechar */}
          <div className="flex justify-end flex-shrink-0 mb-4">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-dolce-marrom/10 flex items-center justify-center hover:bg-dolce-marrom/20 transition-colors"
              aria-label="Fechar detalhes do produto"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1">
            <span className="inline-block text-dolce-rosa font-body text-xs font-semibold tracking-wider uppercase mb-3">
              {product.category}
            </span>
            <h2
              id="modal-title"
              className="font-display text-3xl xl:text-4xl font-bold text-dolce-marrom mb-4 leading-tight"
            >
              {product.name}
            </h2>
            <p className="font-body text-dolce-marrom/70 leading-relaxed mb-6 text-base">
              {product.description}
            </p>
            <p className="font-display text-4xl font-bold text-dolce-rosa mb-8">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Botoes */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <a
              ref={lastFocusableRef}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-dolce-rosa text-white font-body font-semibold rounded-full hover:bg-dolce-rosa/90 transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label={`Pedir ${product.name} pelo WhatsApp`}
            >
              <WhatsAppIcon />
              Pedir pelo WhatsApp
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3.5 border-2 border-dolce-marrom/20 text-dolce-marrom font-body font-semibold rounded-full hover:border-dolce-marrom/40 transition-all duration-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
