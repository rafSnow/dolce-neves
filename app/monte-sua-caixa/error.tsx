"use client";

import { useEffect } from "react";

export default function MonteSuaCaixaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Monte sua Caixa error:", error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-dolce-creme flex items-center justify-center"
    >
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dolce-rosa/10 flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="20" cy="20" r="18" stroke="#C96B7A" strokeWidth="2" />
            <path
              d="M20 12V22"
              stroke="#C96B7A"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="20" cy="28" r="1.5" fill="#C96B7A" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-dolce-marrom mb-3">
          Ops! Algo deu errado
        </h1>
        <p className="font-body text-dolce-marrom/60 mb-8">
          Nao conseguimos carregar o montador de caixas. Por favor, tente
          novamente em alguns instantes.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 bg-dolce-rosa text-white font-body font-semibold rounded-full hover:bg-dolce-rosa/90 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Tentar novamente
        </button>
        <div className="mt-6">
          <a
            href="/"
            className="font-body text-dolce-rosa hover:text-dolce-rosa/80 transition-colors text-sm"
          >
            ← Voltar para a pagina inicial
          </a>
        </div>
      </div>
    </main>
  );
}
