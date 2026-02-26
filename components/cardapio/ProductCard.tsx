"use client";

import type { Product } from "@/types/product";
import Image from "next/image";
import { useState } from "react";
import { ProductModal } from "./ProductModal";

interface ProductCardProps {
  product: Product;
}

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";
  const whatsappMessage = encodeURIComponent(
    `Ola! Vi o cardapio da Dolce Neves e quero pedir: ${product.name}. 🍫`,
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col h-full">
        {/* Imagem */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image_url}
            alt={`${product.name} - doce artesanal gourmet da Dolce Neves`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            loading="lazy"
          />
          {/* Badge da categoria */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-dolce-rosa text-xs font-body font-semibold px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Conteudo */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display text-lg font-semibold text-dolce-marrom mb-2 leading-snug">
            {product.name}
          </h3>
          <p className="font-body text-sm text-dolce-marrom/60 mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Preco */}
          <p className="font-display text-2xl font-bold text-dolce-rosa mb-4">
            {formatPrice(product.price)}
          </p>

          {/* Acoes */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 px-4 py-2.5 border-2 border-dolce-rosa text-dolce-rosa font-body text-sm font-semibold rounded-full hover:bg-dolce-rosa hover:text-white transition-all duration-300"
              aria-label={`Ver detalhes de ${product.name}`}
            >
              Ver detalhes
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 bg-dolce-rosa text-white font-body text-sm font-semibold rounded-full hover:bg-dolce-rosa/90 transition-all duration-300 text-center shadow-sm hover:shadow-md"
              aria-label={`Pedir ${product.name} pelo WhatsApp`}
            >
              Pedir
              <span className="hidden sm:inline"> via WhatsApp</span>
            </a>
          </div>
        </div>
      </article>

      {/* Modal */}
      {isModalOpen && (
        <ProductModal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
