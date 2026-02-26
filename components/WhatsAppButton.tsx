"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type WhatsAppContext =
  | { type: "default" }
  | { type: "product"; productName: string }
  | { type: "box"; items: string[] }
  | { type: "corporate" };

interface WhatsAppButtonProps {
  context?: WhatsAppContext;
}

function getMessageForContext(context: WhatsAppContext): string {
  switch (context.type) {
    case "product":
      return `Olá! Vi o cardápio da Dolce Neves e quero pedir: ${context.productName}. Poderia me passar mais informações? 🍫`;
    case "box":
      if (context.items.length === 0) {
        return "Olá! Vi o site da Dolce Neves e gostaria de montar uma caixa personalizada. 🍫";
      }
      return `Olá! Montei minha caixa na Dolce Neves com: ${context.items.join(", ")}. 🍫`;
    case "corporate":
      return "Olá! Acabei de enviar um formulário de pedido corporativo pelo site. Aguardo o contato! 🍫";
    default:
      return "Olá! Vi o site da Dolce Neves e gostaria de fazer um pedido. 🍫";
  }
}

function getAriaLabel(context: WhatsAppContext): string {
  switch (context.type) {
    case "product":
      return `Pedir ${context.productName} pelo WhatsApp`;
    case "box":
      return "Enviar caixa personalizada pelo WhatsApp";
    case "corporate":
      return "Reforçar pedido corporativo pelo WhatsApp";
    default:
      return "Fale conosco pelo WhatsApp";
  }
}

export function WhatsAppButton({
  context = { type: "default" },
}: WhatsAppButtonProps) {
  const pathname = usePathname();
  const phoneNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Tooltip appears after 300px scroll, stays 4s, collapses to icon
  useEffect(() => {
    let tooltipTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (tooltipDismissed) return;
      if (window.scrollY > 300) {
        setShowTooltip(true);
        tooltipTimer = setTimeout(() => {
          setShowTooltip(false);
          setTooltipDismissed(true);
          setIsExpanded(false);
        }, 4000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(tooltipTimer);
    };
  }, [tooltipDismissed]);

  // Collapse to icon after 5s on page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const message = getMessageForContext(context);
  const ariaLabel = getAriaLabel(context);

  const handleClick = useCallback(() => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [phoneNumber, message]);

  // Não exibir nas rotas administrativas e login
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="bg-dolce-marrom text-white text-xs font-body px-3 py-2 rounded-lg shadow-lg animate-fadeIn max-w-[180px] text-center">
          Faça seu pedido agora!
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-dolce-marrom rotate-45" />
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleClick}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={`
          group relative flex items-center justify-center rounded-full
          bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:bg-[#20BD5A]
          transition-all duration-300 min-w-[44px] min-h-[44px]
          ${isExpanded ? "pl-4 pr-5 py-3 gap-2" : "w-14 h-14"}
        `}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-whatsapp-pulse bg-[#25D366]/30 -z-10"
          aria-hidden="true"
        />

        <svg
          width={isExpanded ? "22" : "28"}
          height={isExpanded ? "22" : "28"}
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Label — desktop expanded */}
        {isExpanded && (
          <span className="hidden md:inline text-sm font-body font-semibold whitespace-nowrap">
            Pedir pelo WhatsApp
          </span>
        )}
      </button>

      {/* People counter */}
      <div className="bg-white/90 backdrop-blur-sm text-dolce-marrom text-[10px] font-body px-2 py-1 rounded-full shadow-sm border border-dolce-marrom/5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#25D366] mr-1 animate-pulse" />
        12 pessoas pediram hoje
      </div>
    </div>
  );
}
