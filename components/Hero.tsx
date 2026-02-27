import Image from "next/image";

export function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-dolce-creme"
      aria-label="Secao principal"
    >
      {/* Elementos decorativos SVG */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Circulo decorativo superior direito */}
        <svg
          className="absolute -top-20 -right-20 w-80 h-80 opacity-10"
          viewBox="0 0 320 320"
          fill="none"
        >
          <circle cx="160" cy="160" r="160" fill="#C96B7A" />
        </svg>
        {/* Circulo decorativo inferior esquerdo */}
        <svg
          className="absolute -bottom-32 -left-32 w-96 h-96 opacity-[0.07]"
          viewBox="0 0 384 384"
          fill="none"
        >
          <circle cx="192" cy="192" r="192" fill="#C96B7A" />
        </svg>
        {/* Pontos decorativos */}
        <svg
          className="absolute top-1/4 right-1/4 w-40 h-40 opacity-[0.08]"
          viewBox="0 0 160 160"
          fill="none"
        >
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={16 + col * 32}
                cy={16 + row * 32}
                r="4"
                fill="#C96B7A"
              />
            )),
          )}
        </svg>
        {/* Onda decorativa na base */}
        <svg
          className="absolute bottom-0 left-0 w-full h-24 opacity-20"
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 64L48 58.7C96 53 192 43 288 42.7C384 43 480 53 576 58.7C672 64 768 64 864 58.7C960 53 1056 43 1152 42.7C1248 43 1344 53 1392 58.7L1440 64V96H1392C1344 96 1248 96 1152 96C1056 96 960 96 864 96C768 96 672 96 576 96C480 96 384 96 288 96C192 96 96 96 48 96H0V64Z"
            fill="#C96B7A"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Conteudo textual */}
          <div className="text-center lg:text-left">
            <span className="inline-block text-dolce-rosa font-body text-sm font-semibold tracking-widest uppercase mb-4">
              Confeitaria Artesanal Gourmet
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-dolce-marrom leading-tight mb-6">
              Doces personalizados que encantam em cada{" "}
              <span className="text-dolce-rosa">mordida</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-dolce-marrom/70 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Trufas, bombons e kits presenteaveis feitos artesanalmente com
              ingredientes selecionados. Cada doce e uma experiencia unica,
              criada especialmente para o seu momento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/cardapio"
                className="inline-flex items-center justify-center px-8 py-4 bg-dolce-rosa text-white font-body font-semibold rounded-full hover:bg-dolce-rosa/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
              >
                Ver Cardapio
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999"}?text=${encodeURIComponent("Ola! Vi o site da Dolce Neves e gostaria de fazer um pedido. 🍫")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-dolce-rosa text-dolce-rosa font-body font-semibold rounded-full hover:bg-dolce-rosa hover:text-white transition-all duration-300 text-base"
              >
                Fazer Pedido
              </a>
            </div>
          </div>

          {/* Imagem hero */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem]">
              <div className="absolute inset-0 rounded-full bg-dolce-rosa-claro" />
              <Image
                src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=600&fit=crop&q=75"
                alt="Selecao de doces artesanais gourmet da Dolce Neves dispostos em uma caixa elegant"
                fill
                className="rounded-full object-cover p-3"
                priority
                fetchPriority="high"
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 384px, 448px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
