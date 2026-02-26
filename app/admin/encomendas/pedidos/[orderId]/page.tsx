import OrderStatusBadge from "@/components/admin/encomendas/OrderStatusBadge";
import OrderStatusFlow from "@/components/admin/encomendas/OrderStatusFlow";
import OrderQRSection from "@/components/admin/qrcodes/OrderQRSection";
import { getOrderById } from "@/lib/actions/orders";
import { getQRCodeByOrderId } from "@/lib/actions/qr";
import { ORDER_SOURCE_LABELS } from "@/types/orders";
import Link from "next/link";
import { notFound } from "next/navigation";

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  const [{ data: order, error }, { data: qrCode }] = await Promise.all([
    getOrderById(orderId),
    getQRCodeByOrderId(orderId),
  ]);

  if (error || !order) {
    notFound();
  }

  const totalItems = order.items.reduce((s, it) => s + it.quantity, 0);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/encomendas/pedidos"
          className="font-body text-sm text-dolce-rosa hover:underline flex items-center gap-1 mb-2"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Voltar para pedidos
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-dolce-marrom/5 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl text-dolce-marrom font-bold">
              {order.client_name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              {order.client_phone && (
                <a
                  href={`tel:${order.client_phone}`}
                  className="font-body text-sm text-dolce-marrom/50 hover:text-dolce-rosa"
                >
                  {order.client_phone}
                </a>
              )}
              {order.client_email && (
                <a
                  href={`mailto:${order.client_email}`}
                  className="font-body text-sm text-dolce-marrom/50 hover:text-dolce-rosa"
                >
                  {order.client_email}
                </a>
              )}
            </div>
          </div>
          <OrderStatusBadge status={order.status} size="md" />
        </div>

        {/* Force accepted warning */}
        {order.force_accepted && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#92400E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="font-body text-sm text-amber-800 font-medium">
              Pedido aceito acima da capacidade (forçado)
            </span>
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-dolce-creme/50 rounded-xl p-3">
            <p className="font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide">
              Entrega
            </p>
            <p className="font-body text-sm text-dolce-marrom font-medium mt-0.5">
              {new Date(order.delivery_date + "T12:00:00").toLocaleDateString(
                "pt-BR",
                { day: "2-digit", month: "short", year: "numeric" },
              )}
            </p>
            {order.delivery_time && (
              <p className="font-body text-xs text-dolce-marrom/40">
                {order.delivery_time}
              </p>
            )}
          </div>
          <div className="bg-dolce-creme/50 rounded-xl p-3">
            <p className="font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide">
              Origem
            </p>
            <p className="font-body text-sm text-dolce-marrom font-medium mt-0.5">
              {ORDER_SOURCE_LABELS[order.source]}
            </p>
          </div>
          <div className="bg-dolce-creme/50 rounded-xl p-3">
            <p className="font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide">
              Itens
            </p>
            <p className="font-body text-sm text-dolce-marrom font-medium mt-0.5">
              {totalItems} {totalItems === 1 ? "unidade" : "unidades"}
            </p>
          </div>
          <div className="bg-dolce-creme/50 rounded-xl p-3">
            <p className="font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide">
              Total
            </p>
            <p className="font-display text-lg text-dolce-marrom font-bold mt-0.5">
              R$ {Number(order.total_price).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Items table */}
        <div>
          <h3 className="font-display text-sm text-dolce-marrom font-semibold mb-2">
            Itens do Pedido
          </h3>
          <div className="border border-dolce-marrom/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-dolce-creme/30">
                  <th className="text-left font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide px-4 py-2">
                    Produto
                  </th>
                  <th className="text-center font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide px-4 py-2">
                    Qtd.
                  </th>
                  <th className="text-right font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide px-4 py-2">
                    Preço Un.
                  </th>
                  <th className="text-right font-body text-[10px] text-dolce-marrom/40 uppercase tracking-wide px-4 py-2">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-t border-dolce-marrom/5">
                    <td className="font-body text-sm text-dolce-marrom px-4 py-2">
                      {item.product_name}
                    </td>
                    <td className="font-body text-sm text-dolce-marrom text-center px-4 py-2">
                      {item.quantity}
                    </td>
                    <td className="font-body text-sm text-dolce-marrom/60 text-right px-4 py-2">
                      R$ {item.unit_price.toFixed(2)}
                    </td>
                    <td className="font-body text-sm text-dolce-marrom font-medium text-right px-4 py-2">
                      R$ {(item.quantity * item.unit_price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div>
            <h3 className="font-display text-sm text-dolce-marrom font-semibold mb-2">
              Observações
            </h3>
            <div className="bg-dolce-creme/30 rounded-xl p-4 font-body text-sm text-dolce-marrom/60 whitespace-pre-wrap">
              {order.notes}
            </div>
          </div>
        )}

        {/* Status flow */}
        <div>
          <h3 className="font-display text-sm text-dolce-marrom font-semibold mb-3">
            Fluxo de Status
          </h3>
          <OrderStatusFlow orderId={order.id} currentStatus={order.status} />
        </div>

        {/* QR Code */}
        <OrderQRSection
          orderId={order.id}
          orderStatus={order.status}
          existingQR={qrCode || null}
        />

        {/* Meta */}
        <div className="pt-4 border-t border-dolce-marrom/5 flex items-center justify-between">
          <div className="font-body text-[10px] text-dolce-marrom/30">
            Criado em {new Date(order.created_at).toLocaleString("pt-BR")}
            {order.updated_at !== order.created_at && (
              <>
                {" "}
                — Atualizado em{" "}
                {new Date(order.updated_at).toLocaleString("pt-BR")}
              </>
            )}
          </div>
          <Link
            href={`/admin/encomendas/pedidos/${order.id}/editar`}
            className="px-3 py-1.5 rounded-lg border border-dolce-marrom/10 font-body text-xs text-dolce-marrom/50 hover:bg-dolce-marrom/5 transition-colors"
          >
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
}
