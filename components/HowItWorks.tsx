export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Escolha",
      description:
        "Navegue pelo nosso cardapio e escolha seus doces favoritos entre trufas, bombons e muito mais.",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="23" stroke="#C96B7A" strokeWidth="2" />
          <path
            d="M16 24L22 30L32 18"
            stroke="#C96B7A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Monte sua Caixa",
      description:
        "Personalize sua selecao montando a caixa perfeita com a quantidade e os sabores que preferir.",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="23" stroke="#C96B7A" strokeWidth="2" />
          <rect
            x="14"
            y="18"
            width="20"
            height="16"
            rx="2"
            stroke="#C96B7A"
            strokeWidth="2"
          />
          <path d="M14 22H34" stroke="#C96B7A" strokeWidth="2" />
          <path
            d="M20 14L18 18H30L28 14"
            stroke="#C96B7A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M24 22V34" stroke="#C96B7A" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Receba",
      description:
        "Receba seus doces fresquinhos na data combinada. Entregamos com todo o cuidado que voce merece.",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="23" stroke="#C96B7A" strokeWidth="2" />
          <path
            d="M16 28L24 20L32 28"
            stroke="#C96B7A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 20V36"
            stroke="#C96B7A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 16H34"
            stroke="#C96B7A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="como-funciona"
      className="py-20 bg-dolce-rosa-claro"
      aria-label="Como funciona"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-dolce-rosa font-body text-sm font-semibold tracking-widest uppercase mb-3">
            Simples e Rapido
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-dolce-marrom mb-4">
            Como Funciona
          </h2>
          <p className="font-body text-dolce-marrom/60 max-w-2xl mx-auto text-lg">
            Em tres passos simples, voce tem seus doces artesanais preferidos
            prontos para saborear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative flex flex-col items-center text-center"
            >
              {/* Linha conectora (visivel apenas em desktop) */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-dolce-rosa/20"
                  aria-hidden="true"
                />
              )}

              {/* Numero do passo */}
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-md">
                  {step.icon}
                </div>
                <span
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-dolce-rosa text-white font-body font-bold text-sm flex items-center justify-center"
                  aria-hidden="true"
                >
                  {step.id}
                </span>
              </div>

              <h3 className="font-display text-xl font-semibold text-dolce-marrom mb-3">
                {step.title}
              </h3>
              <p className="font-body text-dolce-marrom/60 max-w-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
