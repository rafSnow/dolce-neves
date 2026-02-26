"use client";

import QRCodeDisplay from "@/components/qr/QRCodeDisplay";
import type { OrderStatus } from "@/types/orders";
import type { QRCode } from "@/types/qr";
import { useState } from "react";
import GenerateQRModal from "./GenerateQRModal";

interface OrderQRSectionProps {
  orderId: string;
  orderStatus: OrderStatus;
  existingQR: QRCode | null;
}

export default function OrderQRSection({
  orderId,
  orderStatus,
  existingQR,
}: OrderQRSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Só mostra para pedidos entregues
  if (orderStatus !== "entregue" && !existingQR) return null;

  return (
    <div>
      <h3 className="font-display text-sm text-dolce-marrom font-semibold mb-3">
        QR Code da Embalagem
      </h3>

      {existingQR ? (
        <div className="bg-dolce-creme/30 rounded-xl p-4 space-y-3">
          <QRCodeDisplay
            url={`${appUrl}/f/${existingQR.slug}`}
            slug={existingQR.slug}
            size="small"
          />
          <div className="flex items-center gap-4 font-body text-xs text-dolce-marrom/50">
            <span>
              {existingQR.scanned_at ? "📱 Escaneado" : "⏳ Aguardando scan"}
            </span>
            <span>
              {existingQR.feedback_submitted_at
                ? "✅ Feedback recebido"
                : "💬 Sem feedback"}
            </span>
            {existingQR.discount_code && (
              <span>🎁 Cupom: {existingQR.discount_code}</span>
            )}
          </div>
          <a
            href={`${appUrl}/f/${existingQR.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-body text-xs text-dolce-rosa hover:underline"
          >
            Ver página pública →
          </a>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-dolce-rosa text-white font-body text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-dolce-rosa/90 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          Gerar QR Code
        </button>
      )}

      <GenerateQRModal
        orderId={orderId}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
