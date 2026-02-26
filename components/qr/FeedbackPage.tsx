"use client";

import { submitFeedback } from "@/lib/actions/qr";
import type { FeedbackFormData, NPSScore, QRPageData } from "@/types/qr";
import { NPS_EMOJIS } from "@/types/qr";
import Image from "next/image";
import { useState } from "react";
import FeedbackSuccess from "./FeedbackSuccess";
import NPSSelector from "./NPSSelector";

interface FeedbackPageProps {
  data: QRPageData;
  slug: string;
}

export default function FeedbackPage({ data, slug }: FeedbackPageProps) {
  const { qr, order, feedback } = data;
  const [npsScore, setNpsScore] = useState<NPSScore | null>(null);
  const [comment, setComment] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(!!feedback);
  const [discountCode, setDiscountCode] = useState<string | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";

  const formattedDate = new Date(
    order.delivery_date + "T12:00:00",
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Estado 5: Feedback já enviado
  if (feedback && !submitted) {
    setSubmitted(true);
  }

  if (submitted && feedback) {
    return (
      <main className="min-h-screen bg-dolce-creme flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="text-5xl">
            {NPS_EMOJIS[feedback.nps_score as NPSScore]}
          </div>
          <h1 className="font-display text-2xl text-dolce-marrom font-bold">
            Você já avaliou este pedido
          </h1>
          <p className="font-body text-dolce-marrom/60">
            Obrigado pelo seu feedback! 💕
          </p>
          <p className="font-body text-sm text-dolce-marrom/40">
            Sua nota: {feedback.nps_score}/5
          </p>
          <a
            href="/cardapio"
            className="inline-block bg-dolce-rosa text-white font-body font-semibold px-6 py-3 rounded-xl hover:bg-dolce-rosa/90 transition-colors"
          >
            Ver nosso cardápio 🍫
          </a>
        </div>
      </main>
    );
  }

  // Estado 4: Sucesso após envio
  if (submitted && !feedback) {
    return (
      <main className="min-h-screen bg-dolce-creme flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <FeedbackSuccess
            discountCode={discountCode}
            discountPercent={qr.discount_percent}
            discountExpiresAt={qr.discount_expires_at}
            whatsappNumber={whatsappNumber}
          />
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!npsScore) return;

    setLoading(true);
    setError(null);

    const formData: FeedbackFormData = {
      client_name: order.client_name,
      nps_score: npsScore,
      comment: comment.trim() || undefined,
      would_recommend: wouldRecommend,
    };

    const result = await submitFeedback(slug, formData);

    if (result.success) {
      setDiscountCode(result.discountCode);
      setSubmitted(true);
    } else {
      setError(result.error || "Erro ao enviar. Tente novamente.");
    }
    setLoading(false);
  }

  // Estados 2-3: Boas-vindas + Formulário
  return (
    <main className="min-h-screen bg-dolce-creme px-4 py-8 sm:py-12">
      <div className="max-w-md mx-auto space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/icon.png"
            alt="Logo Dolce Neves"
            width={56}
            height={56}
            className="mx-auto mb-2 rounded-full"
          />
          <h1 className="font-display text-2xl text-dolce-marrom font-bold">
            Dolce Neves
          </h1>
        </div>

        {/* Boas-vindas */}
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl text-dolce-marrom font-bold">
            Obrigado, {order.client_name}! 🍫
          </h2>
          <p className="font-body text-dolce-marrom/60">
            Esperamos que você tenha amado cada docinho.
          </p>
        </div>

        {/* Resumo do pedido */}
        <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-5 space-y-3">
          <p className="font-body text-xs text-dolce-marrom/40 uppercase tracking-wider">
            Seu pedido
          </p>
          <div className="space-y-1.5">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between font-body text-sm text-dolce-marrom"
              >
                <span>{item.product_name}</span>
                <span className="text-dolce-marrom/50">{item.quantity}x</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-dolce-marrom/5">
            <p className="font-body text-xs text-dolce-marrom/40">
              Entregue em {formattedDate}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6 space-y-6">
            <div>
              <label className="block font-body text-sm text-dolce-marrom font-medium mb-4 text-center">
                Como foi sua experiência?
              </label>
              <NPSSelector value={npsScore} onChange={setNpsScore} />
            </div>

            <div>
              <label
                htmlFor="comment"
                className="block font-body text-sm text-dolce-marrom font-medium mb-2"
              >
                Conte mais (opcional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="O que mais gostou? O que podemos melhorar? 💛"
                className="w-full px-4 py-3 rounded-xl border border-dolce-marrom/10 bg-dolce-creme/50 font-body text-sm text-dolce-marrom placeholder:text-dolce-marrom/30 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/40 resize-none"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={wouldRecommend}
                onChange={(e) => setWouldRecommend(e.target.checked)}
                className="w-5 h-5 rounded border-dolce-marrom/20 text-dolce-rosa focus:ring-dolce-rosa/40"
              />
              <span className="font-body text-sm text-dolce-marrom">
                Indicaria a Dolce Neves para amigos? 💕
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!npsScore || loading}
            className="w-full bg-dolce-rosa text-white font-body font-semibold py-3.5 rounded-xl hover:bg-dolce-rosa/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar avaliação ✨"}
          </button>
        </form>
      </div>
    </main>
  );
}
