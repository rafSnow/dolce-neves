"use client";

import type { TopProduct } from "@/lib/actions/dashboard";

interface TopProductsProps {
  products: TopProduct[];
}

export default function TopProducts({ products }: TopProductsProps) {
  const maxQuantity =
    products.length > 0 ? Math.max(...products.map((p) => p.quantity)) : 1;

  return (
    <div className="bg-white rounded-2xl p-6 border border-dolce-marrom/5">
      <h3 className="font-display text-base font-semibold text-dolce-marrom mb-4">
        🏆 Produtos Mais Vendidos
      </h3>

      {products.length > 0 ? (
        <div className="space-y-3">
          {products.map((product, i) => (
            <div key={product.name} className="flex items-center gap-3">
              <span className="font-display text-sm font-bold text-dolce-marrom/30 w-5 text-right">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-sm font-semibold text-dolce-marrom truncate">
                    {product.name}
                  </span>
                  <span className="font-body text-xs text-dolce-marrom/50 shrink-0 ml-2">
                    {product.quantity} un · {product.percent}%
                  </span>
                </div>
                <div className="w-full bg-dolce-creme rounded-full h-2">
                  <div
                    className="bg-dolce-rosa rounded-full h-2 transition-all duration-500"
                    style={{
                      width: `${(product.quantity / maxQuantity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-body text-sm text-dolce-marrom/40 text-center py-4">
          Nenhuma venda registrada ainda
        </p>
      )}
    </div>
  );
}
