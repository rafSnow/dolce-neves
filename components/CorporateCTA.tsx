import Link from "next/link";

const highlights = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Personalização total",
    description: "Sabores, cores e embalagens do seu jeito.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "A partir de 50 un.",
    description: "Preço especial para grandes volumes.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Entrega pontual",
    description: "Planejamento completo para seu evento.",
  },
];

export function CorporateCTA() {
  return (
    <section className="bg-dolce-marrom py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <span className="inline-block text-dolce-rosa font-body text-xs tracking-widest uppercase mb-3">
          Para Empresas & Eventos
        </span>

        <h2 className="font-display text-2xl md:text-4xl text-white mb-4">
          Doces que encantam em{" "}
          <span className="text-dolce-rosa">grandes eventos</span>
        </h2>

        <p className="font-body text-dolce-creme/70 text-sm md:text-base max-w-xl mx-auto mb-10">
          Casamentos, corporativos, formaturas — brigadeiros artesanais com
          personalização completa para tornar seu evento inesquecível.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {highlights.map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-dolce-rosa/20 flex items-center justify-center text-dolce-rosa mb-3">
                {item.icon}
              </div>
              <h3 className="font-display text-base text-white mb-1">
                {item.title}
              </h3>
              <p className="font-body text-xs text-dolce-creme/50">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/corporativo"
          className="inline-flex items-center gap-2 bg-dolce-rosa text-white font-body font-semibold px-8 py-4 rounded-full hover:bg-dolce-rosa/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Solicitar Orçamento Corporativo
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
