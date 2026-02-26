"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  url: string;
  size?: "small" | "large";
  slug: string;
}

export default function QRCodeDisplay({
  url,
  size = "small",
  slug,
}: QRCodeDisplayProps) {
  const qrSize = size === "large" ? 500 : 200;

  const handleDownload = () => {
    const svg = document.getElementById(`qr-${slug}`);
    if (!svg) return;

    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#F7F0E8";
      ctx.fillRect(0, 0, 500, 500);
      ctx.drawImage(img, 0, 0, 500, 500);

      const link = document.createElement("a");
      link.download = `dolce-neves-qr-${slug}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-3">
      <div className="bg-[#F7F0E8] rounded-xl p-4 inline-block">
        <QRCodeSVG
          id={`qr-${slug}`}
          value={url}
          size={qrSize}
          fgColor="#C96B7A"
          bgColor="#F7F0E8"
          level="M"
          imageSettings={{
            src: "/icon.png",
            x: undefined,
            y: undefined,
            height: qrSize * 0.15,
            width: qrSize * 0.15,
            excavate: true,
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-dolce-rosa text-white font-body text-sm font-semibold px-4 py-2 rounded-lg hover:bg-dolce-rosa/90 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PNG
        </button>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 bg-white border border-dolce-marrom/10 text-dolce-marrom font-body text-sm px-4 py-2 rounded-lg hover:bg-dolce-rosa-claro transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copiar link
        </button>
      </div>
    </div>
  );
}
