import type { Testimonial } from "@/types";
import Image from "next/image";

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Mariana Oliveira",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
    rating: 5,
    text: "Os doces da Dolce Neves sao simplesmente incriveis! Encomendei para o aniversario da minha filha e todos os convidados elogiaram. A caixa personalizada ficou linda e os sabores sao divinos.",
  },
  {
    id: "2",
    name: "Carlos Eduardo Santos",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
    rating: 5,
    text: "Presenteei minha esposa com a caixa premium e ela amou! A apresentacao e impecavel e o sabor, entao, nem se fala. Com certeza vou pedir novamente. Atendimento excelente pelo WhatsApp.",
  },
  {
    id: "3",
    name: "Beatriz Ferreira",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
    rating: 5,
    text: "Estou apaixonada pelas trufas de pistache! Peco toda semana. O que mais gosto e que da para montar a caixa do jeito que eu quiser. Qualidade artesanal de verdade, sem igual na cidade.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-1"
      aria-label={`Avaliacao: ${rating} de 5 estrelas`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill={i < rating ? "#C96B7A" : "none"}
          stroke={i < rating ? "#C96B7A" : "#C96B7A"}
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M10 1.5L12.47 6.97L18.5 7.64L14 11.64L15.18 17.5L10 14.47L4.82 17.5L6 11.64L1.5 7.64L7.53 6.97L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="py-20 bg-dolce-creme"
      aria-label="Depoimentos de clientes"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-dolce-rosa font-body text-sm font-semibold tracking-widest uppercase mb-3">
            Depoimentos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-dolce-marrom mb-4">
            O que Nossos Clientes Dizem
          </h2>
          <p className="font-body text-dolce-marrom/60 max-w-2xl mx-auto text-lg">
            A satisfacao dos nossos clientes e a nossa maior recompensa. Confira
            o que eles dizem sobre a Dolce Neves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Aspas decorativas */}
              <svg
                width="40"
                height="32"
                viewBox="0 0 40 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-4 opacity-20"
                aria-hidden="true"
              >
                <path
                  d="M0 20.8C0 12.16 5.44 4.96 14.08 0L16.64 3.84C11.2 7.36 8.32 11.2 7.68 15.36C8.64 14.88 9.92 14.72 11.2 14.72C15.36 14.72 18.56 17.92 18.56 22.4C18.56 27.2 15.04 31.04 10.24 31.04C4.48 31.04 0 26.88 0 20.8ZM21.44 20.8C21.44 12.16 26.88 4.96 35.52 0L38.08 3.84C32.64 7.36 29.76 11.2 29.12 15.36C30.08 14.88 31.36 14.72 32.64 14.72C36.8 14.72 40 17.92 40 22.4C40 27.2 36.48 31.04 31.68 31.04C25.92 31.04 21.44 26.88 21.44 20.8Z"
                  fill="#C96B7A"
                />
              </svg>

              <p className="font-body text-dolce-marrom/70 leading-relaxed mb-6">
                {testimonial.text}
              </p>

              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.avatar}
                  alt={`Foto de ${testimonial.name}, cliente da Dolce Neves`}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="font-display font-semibold text-dolce-marrom">
                    {testimonial.name}
                  </p>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
