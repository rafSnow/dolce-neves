import { About } from "@/components/About";
import { BoxBuilderCTA } from "@/components/BoxBuilderCTA";
import { CorporateCTA } from "@/components/CorporateCTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PartyCalculatorPreview } from "@/components/PartyCalculatorPreview";
import { ProductGallery } from "@/components/ProductGallery";
import { SiteHeader } from "@/components/SiteHeader";
import { Testimonials } from "@/components/Testimonials";
import { Suspense } from "react";

export default function Home() {
  return (
    <main id="main-content">
      <SiteHeader />
      <Hero />
      <ProductGallery />
      <Suspense>
        <BoxBuilderCTA />
        <PartyCalculatorPreview />
        <HowItWorks />
        <Testimonials />
        <CorporateCTA />
        <About />
      </Suspense>
      <Footer />
    </main>
  );
}
