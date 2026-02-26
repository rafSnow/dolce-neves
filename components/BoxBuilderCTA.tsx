export function BoxBuilderCTA() {
  return (
    <section
      className="py-20 bg-dolce-rosa-claro/40 relative overflow-hidden"
      aria-label="Monte sua caixa personalizada"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          className="absolute -top-16 -right-16 w-64 h-64 opacity-[0.06]"
          viewBox="0 0 256 256"
          fill="none"
        >
          <circle cx="128" cy="128" r="128" fill="#C96B7A" />
        </svg>
        <svg
          className="absolute -bottom-20 -left-20 w-72 h-72 opacity-[0.04]"
          viewBox="0 0 288 288"
          fill="none"
        >
          <circle cx="144" cy="144" r="144" fill="#3D2314" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <span className="inline-block text-dolce-rosa font-body text-sm font-semibold tracking-widest uppercase mb-3">
              Novidade
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-dolce-marrom mb-4">
              Monte a caixa perfeita 🍫
            </h2>
            <p className="font-body text-lg text-dolce-marrom/70 max-w-lg mx-auto lg:mx-0 mb-6 leading-relaxed">
              Escolha seus sabores favoritos, arraste para a caixa e monte o
              presente ideal. Caixas de 9, 16 ou 25 bombons — perfeitas para
              qualquer ocasiao.
            </p>
            <ul className="font-body text-dolce-marrom/60 space-y-2 mb-8 text-left max-w-md mx-auto lg:mx-0">
              <li className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="9" fill="#C96B7A" opacity="0.15" />
                  <path
                    d="M5.5 9L8 11.5L12.5 6.5"
                    stroke="#C96B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Arraste e solte — simples e divertido
              </li>
              <li className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="9" fill="#C96B7A" opacity="0.15" />
                  <path
                    d="M5.5 9L8 11.5L12.5 6.5"
                    stroke="#C96B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Personalize com seus sabores preferidos
              </li>
              <li className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="9" fill="#C96B7A" opacity="0.15" />
                  <path
                    d="M5.5 9L8 11.5L12.5 6.5"
                    stroke="#C96B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Finalize pelo WhatsApp em segundos
              </li>
            </ul>
            <a
              href="/monte-sua-caixa"
              className="inline-flex items-center justify-center px-8 py-4 bg-dolce-rosa text-white font-body font-semibold rounded-full hover:bg-dolce-rosa/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Montar minha caixa
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="ml-2"
                aria-hidden="true"
              >
                <path
                  d="M4 10h12M12 6l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Animated box preview */}
          <div
            className="flex justify-center lg:justify-end"
            aria-hidden="true"
          >
            <div
              className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl p-4"
              style={{
                background:
                  "linear-gradient(135deg, #F7F0E8 0%, #FAE8EC 50%, #F7F0E8 100%)",
                boxShadow:
                  "inset 0 2px 8px rgba(61, 35, 20, 0.08), 0 8px 32px rgba(201, 107, 122, 0.15)",
                border: "3px double rgba(201, 107, 122, 0.3)",
              }}
            >
              <div
                className="h-full rounded-xl p-3"
                style={{
                  border: "1px solid rgba(201, 107, 122, 0.15)",
                  background: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <div className="grid grid-cols-3 gap-2 h-full">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          i < 5
                            ? "rgba(201, 107, 122, 0.12)"
                            : "rgba(255, 255, 255, 0.6)",
                        border:
                          i >= 5
                            ? "2px dashed rgba(201, 107, 122, 0.2)"
                            : "none",
                      }}
                    >
                      {i < 5 ? (
                        <div
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dolce-rosa/30 animate-slot-fill"
                          style={{
                            animationDelay: `${i * 0.4}s`,
                          }}
                        />
                      ) : i === 5 ? (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-dolce-rosa/40 animate-pulse flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M7 2v10M2 7h10"
                              stroke="#C96B7A"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              opacity="0.4"
                            />
                          </svg>
                        </div>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          className="opacity-20"
                        >
                          <path
                            d="M7 2v10M2 7h10"
                            stroke="#C96B7A"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
