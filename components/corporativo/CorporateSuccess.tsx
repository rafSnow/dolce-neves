"use client";

import { WhatsAppButton } from "@/components/WhatsAppButton";
import Link from "next/link";

export function CorporateSuccess() {
  return (
    <section className="bg-dolce-creme py-16 md:py-24">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Check animation */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#25D366]/10 flex items-center justify-center animate-scaleIn">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#25D366"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="font-display text-2xl md:text-3xl text-dolce-marrom mb-3 animate-fadeInUp">
          Recebemos seu pedido!
        </h2>
        <p
          className="font-body text-dolce-marrom/70 text-sm md:text-base mb-8 animate-fadeInUp"
          style={{ animationDelay: "0.1s" }}
        >
          Entraremos em contato em até <strong>48 horas úteis</strong> com o
          orçamento personalizado.
        </p>

        {/* WhatsApp reforço */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999"}?text=${encodeURIComponent("Olá! Acabei de enviar um formulário de pedido corporativo pelo site. Aguardo o contato! 🍫")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-body font-semibold px-6 py-3 rounded-full hover:bg-[#20BD5A] transition-colors duration-300 shadow-md"
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
            Reforçar pelo WhatsApp
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-dolce-marrom font-body font-semibold px-6 py-3 rounded-full border border-dolce-marrom/20 hover:bg-dolce-rosa-claro transition-colors duration-300"
          >
            Voltar ao início
          </Link>
        </div>
      </div>

      {/* Hidden WhatsApp button for global context */}
      <div className="hidden">
        <WhatsAppButton context={{ type: "corporate" }} />
      </div>
    </section>
  );
}
