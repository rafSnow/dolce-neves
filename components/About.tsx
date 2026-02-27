import Image from "next/image";

export function About() {
  return (
    <section
      id="sobre"
      className="py-20 bg-white"
      aria-label="Sobre a Dolce Neves"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Imagem */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=600&h=750&fit=crop&q=80"
                alt="Confeiteira da Dolce Neves preparando doces artesanais com ingredientes selecionados"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            {/* Elemento decorativo */}
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-dolce-rosa-claro -z-10"
              aria-hidden="true"
            />
            <div
              className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-dolce-rosa/10 -z-10"
              aria-hidden="true"
            />
          </div>

          {/* Texto */}
          <div>
            <span className="inline-block text-dolce-rosa font-body text-sm font-semibold tracking-widest uppercase mb-3">
              Nossa Historia
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-dolce-marrom mb-6">
              Sobre a Dolce Neves
            </h2>
            <div className="space-y-4 font-body text-dolce-marrom/70 leading-relaxed text-lg">
              <p>
                A Dolce Neves nasceu de uma paixao genuina pela confeitaria
                artesanal. Cada doce que criamos carrega a dedicacao de quem
                acredita que os melhores sabores vem de ingredientes
                cuidadosamente selecionados e receitas desenvolvidas com muito
                carinho.
              </p>
              <p>
                Somos uma confeitaria gourmet especializada em doces
                personalizados para festas, eventos corporativos e presentes
                especiais. Nossas trufas, bombons e kits presenteaveis sao
                preparados sob encomenda, garantindo frescor e qualidade em cada
                unidade.
              </p>
              <p>
                Acreditamos que um doce bem feito tem o poder de transformar
                momentos em memorias inesqueciveis. Por isso, colocamos alma em
                cada detalhe — do sabor a embalagem — para que cada experiencia
                com a Dolce Neves seja verdadeiramente especial.
              </p>
            </div>

            {/* NAP - Name, Address, Phone */}
            <div className="mt-8 p-6 bg-dolce-creme rounded-xl">
              <h3 className="font-display text-lg font-semibold text-dolce-marrom mb-3">
                Onde nos Encontrar
              </h3>
              <address className="not-italic font-body text-dolce-marrom/70 space-y-2">
                <p className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 1.5C5.96 1.5 3.5 3.96 3.5 7C3.5 11.25 9 16.5 9 16.5C9 16.5 14.5 11.25 14.5 7C14.5 3.96 12.04 1.5 9 1.5ZM9 9.25C7.76 9.25 6.75 8.24 6.75 7C6.75 5.76 7.76 4.75 9 4.75C10.24 4.75 11.25 5.76 11.25 7C11.25 8.24 10.24 9.25 9 9.25Z"
                      fill="#C96B7A"
                    />
                  </svg>
                  Rua RB-18, Residencial Buriti - Senador Canedo, GO
                </p>
                <p className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M15.5 12.77L12.87 12.46C12.32 12.39 11.78 12.57 11.39 12.96L9.42 14.93C7.04 13.72 5.09 11.78 3.88 9.39L5.86 7.41C6.25 7.02 6.43 6.48 6.36 5.93L6.05 3.31C5.93 2.29 5.07 1.5 4.04 1.5H2.78C1.64 1.5 0.68 2.46 0.75 3.6C1.28 11.71 7.81 18.22 15.9 18.75C17.04 18.82 18 17.86 18 16.72V15.46C18 14.44 17.22 13.58 16.2 13.46L15.5 12.77Z"
                      fill="#C96B7A"
                    />
                  </svg>
                  WhatsApp: (62) 98146-0127
                </p>
              </address>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
