export function CorporateHero() {
  const stats = [
    { value: "500+", label: "Eventos atendidos" },
    { value: "50+", label: "Unidades mínimas" },
    { value: "100%", label: "Personalização" },
  ];

  return (
    <section className="relative bg-dolce-marrom overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, #C96B7A 1px, transparent 1px), radial-gradient(circle at 75% 50%, #C96B7A 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
        <span className="inline-block text-dolce-rosa font-body text-sm tracking-widest uppercase mb-4 animate-fadeIn">
          Para Empresas & Eventos
        </span>

        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 animate-fadeInUp">
          Doces para eventos que{" "}
          <span className="text-dolce-rosa">ficam na memória</span>
        </h1>

        <p
          className="font-body text-dolce-creme/80 text-base md:text-lg max-w-2xl mx-auto mb-10 animate-fadeInUp"
          style={{ animationDelay: "0.15s" }}
        >
          Brigadeiros artesanais para casamentos, eventos corporativos e
          celebrações especiais. Personalização completa, qualidade artesanal.
        </p>

        {/* Stats */}
        <div
          className="flex flex-wrap justify-center gap-8 md:gap-16 mb-10 animate-fadeInUp"
          style={{ animationDelay: "0.3s" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="block font-display text-3xl md:text-4xl text-dolce-rosa">
                {stat.value}
              </span>
              <span className="block font-body text-xs md:text-sm text-dolce-creme/60 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#formulario"
          className="inline-flex items-center gap-2 bg-dolce-rosa text-white font-body font-semibold px-8 py-4 rounded-full hover:bg-dolce-rosa/90 transition-colors duration-300 shadow-lg hover:shadow-xl animate-fadeInUp"
          style={{ animationDelay: "0.45s" }}
        >
          Solicitar Orçamento
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
