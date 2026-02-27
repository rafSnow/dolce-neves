import {
  OCCASION_ICONS,
  OCCASION_LABELS,
  type OccasionType,
} from "@/types/party-calculator";
import Link from "next/link";

const PREVIEW_OCCASIONS: OccasionType[] = [
  "casamento",
  "aniversario_infantil",
  "corporativo",
];

export function PartyCalculatorPreview() {
  return (
    <section
      className="py-20 bg-white"
      id="calculadora"
      aria-label="Calculadora de festas"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <span className="inline-block text-dolce-rosa font-body text-sm font-semibold tracking-widest uppercase mb-3">
              Ferramenta Exclusiva
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-dolce-marrom mb-4">
              Calculadora de <span className="text-dolce-rosa">Festas</span>
            </h2>
            <p className="font-body text-dolce-marrom/60 text-lg mb-6 leading-relaxed">
              Não sabe quantos doces pedir? Nossa calculadora descobre a
              quantidade ideal por pessoa, sugere os melhores produtos e calcula
              o investimento estimado para seu evento.
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Cálculo automático por tipo de evento",
                "Sugestão de produtos do nosso cardápio",
                "Estimativa de preço com margem de segurança",
                "Envio direto do orçamento pelo WhatsApp",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-dolce-rosa-claro flex items-center justify-center mt-0.5 shrink-0">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C96B7A"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="font-body text-dolce-marrom/70">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/calculadora"
              className="inline-flex items-center justify-center px-8 py-4 bg-dolce-rosa text-white font-body font-semibold rounded-full hover:bg-dolce-rosa/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              🎉 Calcular Agora
            </Link>
          </div>

          {/* Preview cards — cada card leva à calculadora com a ocasião pré-selecionada */}
          <div className="relative">
            <div className="grid grid-cols-1 gap-4">
              {PREVIEW_OCCASIONS.map((occasion) => (
                <Link
                  key={occasion}
                  href={`/calculadora?ocasiao=${occasion}`}
                  className="bg-dolce-creme/50 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-3xl">{OCCASION_ICONS[occasion]}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-dolce-marrom">
                      {OCCASION_LABELS[occasion]}
                    </h3>
                    <p className="font-body text-sm text-dolce-marrom/50">
                      Descubra a quantidade ideal de doces
                    </p>
                  </div>
                  <span className="shrink-0 w-10 h-10 rounded-full bg-dolce-rosa/10 flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C96B7A"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>

            {/* Decorative */}
            <div className="pointer-events-none absolute -top-4 -right-4 w-24 h-24 bg-dolce-rosa-claro/30 rounded-full blur-2xl" />
            <div className="pointer-events-none absolute -bottom-4 -left-4 w-32 h-32 bg-dolce-rosa/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
