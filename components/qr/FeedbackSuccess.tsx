"use client";

import { useEffect, useState } from "react";

interface FeedbackSuccessProps {
  discountCode?: string;
  discountPercent?: number;
  discountExpiresAt?: string | null;
  whatsappNumber: string;
}

export default function FeedbackSuccess({
  discountCode,
  discountPercent,
  discountExpiresAt,
  whatsappNumber,
}: FeedbackSuccessProps) {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const formattedExpiry = discountExpiresAt
    ? new Date(discountExpiresAt).toLocaleDateString("pt-BR")
    : null;

  const handleCopy = async () => {
    if (discountCode) {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMsg = discountCode
    ? `Olá! Quero fazer um novo pedido. Tenho o cupom ${discountCode}. 🍫`
    : "Olá! Quero fazer um novo pedido. 🍫";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="text-center space-y-6 animate-fade-in">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-start justify-center overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {["💕", "🍫", "✨", "🎉", "💝"][i % 5]}
            </span>
          ))}
        </div>
      )}

      <div className="text-5xl animate-bounce">💕</div>
      <h2 className="font-display text-2xl text-dolce-marrom font-bold">
        Sua avaliação foi enviada!
      </h2>
      <p className="font-body text-dolce-marrom/60">
        Muito obrigado pelo carinho 💕
      </p>

      {/* Cupom de desconto */}
      {discountCode && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-dolce-rosa p-6 max-w-sm mx-auto space-y-3">
          <div className="text-2xl">🎁</div>
          <p className="font-body text-sm text-dolce-marrom/70 font-medium">
            Presente especial pra você
          </p>
          <p className="font-display text-3xl text-dolce-rosa font-bold tracking-wider">
            {discountCode}
          </p>
          <p className="font-body text-sm text-dolce-marrom/60">
            {discountPercent}% de desconto
          </p>
          {formattedExpiry && (
            <p className="font-body text-xs text-dolce-marrom/40">
              Válido até {formattedExpiry}
            </p>
          )}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 bg-dolce-rosa-claro text-dolce-rosa font-body font-semibold text-sm px-4 py-2 rounded-xl hover:bg-dolce-rosa hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copiado!
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copiar código
              </>
            )}
          </button>
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-xs mx-auto bg-emerald-600 text-white font-body font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors text-center"
        >
          Fazer novo pedido 💬
        </a>
        <a
          href="/cardapio"
          className="block w-full max-w-xs mx-auto bg-white border border-dolce-marrom/10 text-dolce-marrom font-body font-semibold py-3 rounded-xl hover:bg-dolce-rosa-claro transition-colors text-center"
        >
          Ver nosso cardápio 🍫
        </a>
      </div>
    </div>
  );
}
