import { SkipToContent } from "@/components/SkipToContent";
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const WhatsAppButton = dynamic(
  () => import("@/components/WhatsAppButton").then((mod) => mod.WhatsAppButton),
  { ssr: false },
);

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dolceneves.com.br";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#C96B7A",
};

export const metadata: Metadata = {
  title: "Dolce Neves | Doces Artesanais Gourmet Personalizados",
  description:
    "Dolce Neves - Confeitaria artesanal gourmet especializada em doces personalizados para festas, eventos e presentes. Trufas, bombons e kits presenteaveis feitos com ingredientes selecionados.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  keywords: [
    "doces artesanais",
    "confeitaria gourmet",
    "doces personalizados",
    "trufas artesanais",
    "bombons gourmet",
    "doces para festas",
    "doces para eventos",
    "kit presenteavel doces",
    "encomenda de doces",
    "Dolce Neves",
    "doces finos",
    "caixa de doces personalizada",
  ],
  authors: [{ name: "Dolce Neves" }],
  creator: "Dolce Neves",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Dolce Neves",
    title: "Dolce Neves | Doces Artesanais Gourmet Personalizados",
    description:
      "Confeitaria artesanal gourmet. Doces personalizados para festas, eventos e presentes. Trufas, bombons e kits feitos com carinho e ingredientes selecionados.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dolce Neves - Doces Artesanais Gourmet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dolce Neves | Doces Artesanais Gourmet Personalizados",
    description:
      "Confeitaria artesanal gourmet. Doces personalizados para festas, eventos e presentes.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function JsonLdLocalBusiness() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: "Dolce Neves",
    url: siteUrl,
    telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      ? `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
      : "+5511999999999",
    description:
      "Confeitaria artesanal gourmet especializada em doces personalizados para festas, eventos e presentes.",
    image: `${siteUrl}/og-image.jpg`,
    priceRange: "$$",
    servesCuisine: "Confeitaria Artesanal",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua RB-18, Residencial Buriti",
      addressLocality: "Senador Canedo",
      addressRegion: "GO",
      postalCode: "75260-459",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -16.692531,
      longitude: -49.078417,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    sameAs: ["https://instagram.com/dolceneves"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-body bg-dolce-creme text-dolce-marrom antialiased">
        <SkipToContent />
        <JsonLdLocalBusiness />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
