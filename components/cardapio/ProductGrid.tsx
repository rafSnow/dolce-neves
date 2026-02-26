import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dolce-rosa/10 flex items-center justify-center">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 6C11.373 6 6 11.373 6 18C6 24.627 11.373 30 18 30C24.627 30 30 24.627 30 18C30 11.373 24.627 6 18 6ZM18 28C12.477 28 8 23.523 8 18C8 12.477 12.477 8 18 8C23.523 8 28 12.477 28 18C28 23.523 23.523 28 18 28Z"
              fill="#C96B7A"
              opacity="0.5"
            />
            <path
              d="M13 17H23"
              stroke="#C96B7A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-dolce-marrom mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="font-body text-dolce-marrom/60">
          Nao encontramos produtos nesta categoria. Tente outra categoria ou
          veja todos os nossos doces.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fadeInUp"
          style={{
            animationDelay: `${index * 60}ms`,
            animationFillMode: "both",
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
