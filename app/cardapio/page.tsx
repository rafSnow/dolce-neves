import { CategoryFilter } from "@/components/cardapio/CategoryFilter";
import { CategorySkeleton } from "@/components/cardapio/CategorySkeleton";
import { ProductGrid } from "@/components/cardapio/ProductGrid";
import { ProductSkeleton } from "@/components/cardapio/ProductSkeleton";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { getCategories, getProducts } from "@/lib/actions/products";
import { slugToCategory } from "@/types/product";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cardapio | Dolce Neves — Doces Gourmet Personalizados",
  description:
    "Conheca nosso cardapio completo de doces artesanais gourmet: trufas, bombons, kits presenteaveis e docinhos finos. Feitos com ingredientes selecionados e muito carinho.",
  openGraph: {
    title: "Cardapio | Dolce Neves — Doces Gourmet Personalizados",
    description:
      "Trufas, bombons, kits presenteaveis e docinhos finos artesanais. Explore nosso cardapio e faca seu pedido.",
    url: "/cardapio",
    siteName: "Dolce Neves",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cardapio Dolce Neves - Doces Artesanais Gourmet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardapio | Dolce Neves",
    description:
      "Explore nosso cardapio de doces artesanais gourmet. Trufas, bombons, kits e docinhos finos.",
    images: ["/og-image.jpg"],
  },
};

export const revalidate = 60;

interface CardapioPageProps {
  searchParams: { categoria?: string };
}

export default async function CardapioPage({
  searchParams,
}: CardapioPageProps) {
  const categorySlug = searchParams.categoria ?? null;
  const activeCategory = categorySlug ? slugToCategory(categorySlug) : null;

  const [products, categoriesWithCount] = await Promise.all([
    getProducts(activeCategory),
    getCategories(),
  ]);

  return (
    <>
      <SiteHeader withShadow />
      <main id="main-content" className="min-h-screen bg-dolce-creme">
        {/* Breadcrumb */}
        <div className="bg-white/60 border-b border-dolce-rosa/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="font-body text-sm">
              <ol className="flex items-center gap-2 text-dolce-marrom/60">
                <li>
                  <Link
                    href="/"
                    className="hover:text-dolce-rosa transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-dolce-marrom/30"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </li>
                <li>
                  <span className="text-dolce-marrom font-medium">
                    Cardapio
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Header da pagina */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-dolce-rosa font-body text-sm font-semibold tracking-widest uppercase mb-3">
              Nosso Cardapio
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-dolce-marrom mb-4">
              Doces Artesanais Gourmet
            </h1>
            <p className="font-body text-dolce-marrom/60 max-w-2xl mx-auto text-lg leading-relaxed">
              Cada doce e preparado artesanalmente com ingredientes
              selecionados. Escolha seus favoritos e faca seu pedido pelo
              WhatsApp.
            </p>
          </div>
        </section>

        {/* Filtro de categorias */}
        <section className="pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<CategorySkeleton />}>
              <CategoryFilter
                categories={categoriesWithCount}
                activeCategory={activeCategory}
              />
            </Suspense>
          </div>
        </section>

        {/* Grid de produtos */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<ProductSkeleton />}>
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
