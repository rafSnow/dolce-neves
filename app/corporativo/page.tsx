import { CorporateBenefits } from "@/components/corporativo/CorporateBenefits";
import { CorporateForm } from "@/components/corporativo/CorporateForm";
import { CorporateHero } from "@/components/corporativo/CorporateHero";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedido Corporativo | Dolce Neves — Brigadeiros Artesanais",
  description:
    "Solicite um orçamento para eventos corporativos, casamentos, formaturas e celebrações. Brigadeiros artesanais com personalização completa a partir de 50 unidades.",
  openGraph: {
    title: "Pedido Corporativo | Dolce Neves",
    description:
      "Brigadeiros artesanais para eventos. Personalização completa, grandes volumes, entrega pontual.",
    type: "website",
  },
};

export default function CorporativoPage() {
  return (
    <main id="main-content">
      <SiteHeader />
      <CorporateHero />
      <CorporateBenefits />
      <CorporateForm />
      <Footer />
    </main>
  );
}
