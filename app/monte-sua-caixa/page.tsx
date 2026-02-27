import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { getProducts } from "@/lib/actions/products";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const BoxBuilder = dynamic(
  () =>
    import("@/components/box-builder/BoxBuilder").then((mod) => mod.BoxBuilder),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-dolce-rosa border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Monte sua Caixa | Dolce Neves — Doces Personalizados",
  description:
    "Escolha seus sabores favoritos e monte sua caixa de bombons personalizada. Trufas, bombons e docinhos gourmet entregues com amor.",
  openGraph: {
    title: "Monte sua Caixa | Dolce Neves",
    description:
      "Escolha seus sabores favoritos e monte sua caixa de bombons personalizada.",
    type: "website",
    locale: "pt_BR",
    siteName: "Dolce Neves",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monte sua Caixa | Dolce Neves",
    description:
      "Escolha seus sabores favoritos e monte sua caixa de bombons personalizada.",
  },
};

export const revalidate = 60;

export default async function MonteSuaCaixaPage() {
  const products = await getProducts();

  return (
    <>
      <SiteHeader withShadow />
      <main id="main-content" className="min-h-screen bg-dolce-creme">
        {/* Breadcrumb */}
        <nav
          aria-label="Navegacao estrutural"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
        >
          <ol className="flex items-center gap-2 text-sm font-body text-dolce-marrom/50">
            <li>
              <a href="/" className="hover:text-dolce-rosa transition-colors">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-dolce-marrom font-medium">Monte sua Caixa</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-2">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dolce-marrom">
            Monte sua <span className="text-dolce-rosa">Caixa</span>
          </h1>
          <p className="font-body text-dolce-marrom/60 mt-2 max-w-2xl">
            Escolha o tamanho da caixa, arraste seus sabores favoritos e
            finalize seu pedido pelo WhatsApp.
          </p>
        </header>

        <BoxBuilder products={products} />
      </main>
      <Footer />
    </>
  );
}
