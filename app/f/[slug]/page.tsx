import FeedbackPage from "@/components/qr/FeedbackPage";
import { getQRPageData, markQRScanned } from "@/lib/actions/qr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avaliação | Dolce Neves",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function FeedbackSlugPage({ params }: Props) {
  const { slug } = await params;
  const { data } = await getQRPageData(slug);

  if (!data) {
    return (
      <main className="min-h-screen bg-dolce-creme flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🍫</div>
          <h1 className="font-display text-2xl text-dolce-marrom font-bold mb-2">
            Link não encontrado
          </h1>
          <p className="font-body text-dolce-marrom/60 mb-6">
            Este link pode ter expirado ou não existe mais. Que tal visitar
            nosso site?
          </p>
          <a
            href="/"
            className="inline-block bg-dolce-rosa text-white font-body font-semibold px-6 py-3 rounded-xl hover:bg-dolce-rosa/90 transition-colors"
          >
            Ir para o site da Dolce Neves
          </a>
        </div>
      </main>
    );
  }

  // Marcar como escaneado (fire-and-forget)
  await markQRScanned(slug);

  return <FeedbackPage data={data} slug={slug} />;
}
