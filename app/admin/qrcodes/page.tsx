import QRCodeList from "@/components/admin/qrcodes/QRCodeList";
import QRStats from "@/components/admin/qrcodes/QRStats";
import { getQRCodes, getQRStats } from "@/lib/actions/qr";

export default async function QRCodesPage() {
  const [{ data: items }, stats] = await Promise.all([
    getQRCodes(),
    getQRStats(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-dolce-marrom font-bold">
          QR Codes
        </h1>
        <p className="font-body text-dolce-marrom/60 text-sm mt-1">
          Gerencie os QR Codes das embalagens e veja os feedbacks dos clientes.
        </p>
      </div>

      <div className="space-y-6">
        <QRStats
          total={stats.total}
          scanned={stats.scanned}
          feedbacks={stats.feedbacks}
          avgNPS={stats.avgNPS}
        />
        <QRCodeList items={items || []} />
      </div>
    </div>
  );
}
