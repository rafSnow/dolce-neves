"use client";

import QRCodeDisplay from "@/components/qr/QRCodeDisplay";
import { generateQRCode } from "@/lib/actions/qr";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GenerateQRModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateQRModal({
  orderId,
  isOpen,
  onClose,
}: GenerateQRModalProps) {
  const router = useRouter();
  const [includeDiscount, setIncludeDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [discountDays, setDiscountDays] = useState(15);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{ slug: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    const result = await generateQRCode(orderId, {
      discountPercent: includeDiscount ? discountPercent : 0,
      discountDays: includeDiscount ? discountDays : undefined,
    });

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setGenerated({ slug: result.data.slug });
      router.refresh();
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-dolce-marrom/5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-dolce-marrom font-bold">
              Gerar QR Code
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-dolce-rosa-claro transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!generated ? (
            <>
              {/* Opções */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDiscount}
                  onChange={(e) => setIncludeDiscount(e.target.checked)}
                  className="w-5 h-5 rounded border-dolce-marrom/20 text-dolce-rosa focus:ring-dolce-rosa/40"
                />
                <span className="font-body text-sm text-dolce-marrom">
                  Incluir cupom de desconto
                </span>
              </label>

              {includeDiscount && (
                <div className="ml-8 space-y-3 animate-fade-in">
                  <div>
                    <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
                      Desconto
                    </label>
                    <select
                      value={discountPercent}
                      onChange={(e) =>
                        setDiscountPercent(Number(e.target.value))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-dolce-marrom/10 font-body text-sm text-dolce-marrom bg-white focus:ring-2 focus:ring-dolce-rosa/40 focus:outline-none"
                    >
                      <option value={5}>5%</option>
                      <option value={10}>10%</option>
                      <option value={15}>15%</option>
                      <option value={20}>20%</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
                      Validade
                    </label>
                    <select
                      value={discountDays}
                      onChange={(e) => setDiscountDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-dolce-marrom/10 font-body text-sm text-dolce-marrom bg-white focus:ring-2 focus:ring-dolce-rosa/40 focus:outline-none"
                    >
                      <option value={7}>7 dias</option>
                      <option value={15}>15 dias</option>
                      <option value={30}>30 dias</option>
                    </select>
                  </div>
                </div>
              )}

              {error && (
                <p className="font-body text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-dolce-rosa text-white font-body font-semibold py-3 rounded-xl hover:bg-dolce-rosa/90 transition-colors disabled:opacity-60"
              >
                {loading ? "Gerando..." : "Gerar QR Code"}
              </button>
            </>
          ) : (
            /* Preview do QR gerado */
            <div className="text-center space-y-4">
              <p className="font-body text-sm text-emerald-600 font-medium">
                ✅ QR Code gerado com sucesso!
              </p>
              <QRCodeDisplay
                url={`${appUrl}/f/${generated.slug}`}
                slug={generated.slug}
                size="small"
              />
              <button
                onClick={onClose}
                className="w-full bg-white border border-dolce-marrom/10 text-dolce-marrom font-body font-semibold py-3 rounded-xl hover:bg-dolce-rosa-claro transition-colors"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
