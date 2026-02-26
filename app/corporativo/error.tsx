"use client";

import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CorporativoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  return (
    <main className="min-h-screen bg-dolce-creme flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="font-display text-2xl text-dolce-marrom mb-2">
          Algo deu errado
        </h1>
        <p className="font-body text-sm text-dolce-marrom/60 mb-6">
          Não foi possível carregar esta página. Tente novamente.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-dolce-rosa text-white font-body font-semibold px-6 py-3 rounded-full hover:bg-dolce-rosa/90 transition-colors"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="bg-white text-dolce-marrom font-body font-semibold px-6 py-3 rounded-full border border-dolce-marrom/20 hover:bg-dolce-rosa-claro transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
