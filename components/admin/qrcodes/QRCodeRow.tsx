"use client";

import { deleteQRCode } from "@/lib/actions/qr";
import type { QRCodeSummary } from "@/types/qr";
import { NPS_EMOJIS, type NPSScore } from "@/types/qr";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface QRCodeRowProps {
  item: QRCodeSummary;
  appUrl: string;
}

export default function QRCodeRow({ item, appUrl }: QRCodeRowProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const formattedDate = new Date(item.created_at).toLocaleDateString("pt-BR");
  const deliveryDate = new Date(
    item.delivery_date + "T12:00:00",
  ).toLocaleDateString("pt-BR");
  const feedbackUrl = `${appUrl}/f/${item.slug}`;

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este QR Code?")) return;
    setDeleting(true);
    await deleteQRCode(item.qr_code_id);
    router.refresh();
  }

  return (
    <tr className="border-t border-dolce-marrom/5 hover:bg-dolce-rosa-claro/20 transition-colors">
      <td className="px-4 py-3 font-body text-sm text-dolce-marrom font-medium">
        {item.client_name}
      </td>
      <td className="px-4 py-3 font-body text-xs text-dolce-marrom/60">
        {deliveryDate}
      </td>
      <td className="px-4 py-3 font-body text-xs text-dolce-marrom/60">
        {formattedDate}
      </td>
      <td className="px-4 py-3 text-center">
        <span title={item.scanned ? "Escaneado" : "Não escaneado"}>
          {item.scanned ? "📱" : "⬜"}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span
          title={item.feedback_submitted ? "Feedback recebido" : "Sem feedback"}
        >
          {item.feedback_submitted ? "✅" : "⬜"}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        {item.nps_score ? (
          <span title={`Nota ${item.nps_score}`}>
            {NPS_EMOJIS[item.nps_score as NPSScore]}
          </span>
        ) : (
          <span className="text-dolce-marrom/30">—</span>
        )}
      </td>
      <td className="px-4 py-3 font-body text-xs text-center">
        {item.discount_code ? (
          <span className="bg-dolce-rosa-claro text-dolce-rosa px-2 py-0.5 rounded-full font-medium">
            {item.discount_code}
          </span>
        ) : (
          <span className="text-dolce-marrom/30">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <a
            href={feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-dolce-rosa-claro transition-colors text-dolce-marrom/50 hover:text-dolce-rosa"
            title="Ver página"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-dolce-marrom/50 hover:text-red-600 disabled:opacity-50"
            title="Excluir"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
