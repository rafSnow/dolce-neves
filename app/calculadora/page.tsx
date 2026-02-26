import PartyCalculator from "@/components/calculadora/PartyCalculator";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Festas | Dolce Neves",
  description:
    "Descubra a quantidade ideal de doces para sua festa ou evento. Nossa calculadora personalizada sugere os melhores produtos e quantidades por pessoa.",
  openGraph: {
    title: "Calculadora de Festas | Dolce Neves",
    description:
      "Descubra a quantidade ideal de doces para sua festa ou evento.",
  },
};

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen bg-dolce-creme">
      <SiteHeader withShadow />
      {/* Header */}
      <div className="bg-white/60">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dolce-marrom mb-3">
            🎉 Calculadora de Festas
          </h1>
          <p className="font-body text-dolce-marrom/60 max-w-lg mx-auto">
            Descubra a quantidade ideal de doces para seu evento. Selecione a
            ocasião, informe o número de convidados e veja a sugestão perfeita!
          </p>
        </div>
      </div>

      <PartyCalculator />

      <Footer />
    </main>
  );
}
