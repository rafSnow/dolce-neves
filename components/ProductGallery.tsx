import type { Product } from "@/types";
import Image from "next/image";

const products: Product[] = [
  {
    id: "1",
    name: "Trufa de Chocolate Belga",
    category: "Trufas",
    description:
      "Ganache cremoso de chocolate belga 70% cacau com cobertura crocante",
    price: 8.5,
    imageUrl:
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop&q=80",
    active: true,
  },
  {
    id: "2",
    name: "Bombom de Maracuja",
    category: "Bombons",
    description:
      "Bombom artesanal com recheio cremoso de maracuja e chocolate ao leite",
    price: 7.0,
    imageUrl:
      "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&h=400&fit=crop&q=80",
    active: true,
  },
  {
    id: "3",
    name: "Trufa de Pistache",
    category: "Trufas",
    description:
      "Trufa premium com pasta de pistache siciliano e cobertura de chocolate branco",
    price: 12.0,
    imageUrl:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80",
    active: true,
  },
  {
    id: "4",
    name: "Caixa Presenteavel 9un",
    category: "Kits",
    description:
      "Caixa elegante com 9 doces sortidos, perfeita para presentear",
    price: 65.0,
    imageUrl:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop&q=80",
    active: true,
  },
  {
    id: "5",
    name: "Brigadeiro Gourmet",
    category: "Classicos",
    description:
      "Brigadeiro feito com chocolate nobre e granulado belga premium",
    price: 6.0,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80",
    active: true,
  },
  {
    id: "6",
    name: "Palha Italiana",
    category: "Classicos",
    description:
      "Palha italiana com biscoito amanteigado e chocolate meio amargo",
    price: 7.5,
    imageUrl:
      "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=400&h=400&fit=crop&q=80",
    active: true,
  },
  {
    id: "7",
    name: "Trufa de Limao Siciliano",
    category: "Trufas",
    description:
      "Ganache perfumado de limao siciliano com cobertura de chocolate branco",
    price: 9.0,
    imageUrl:
      "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=400&h=400&fit=crop&q=80",
    active: true,
  },
  {
    id: "8",
    name: "Caixa Premium 16un",
    category: "Kits",
    description:
      "Caixa luxo com 16 doces sortidos, ideale para ocasioes especiais",
    price: 110.0,
    imageUrl:
      "https://images.unsplash.com/photo-1549312142-d1b299e4570d?w=400&h=400&fit=crop&q=80",
    active: true,
  },
];

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ProductGallery() {
  return (
    <section
      id="produtos"
      className="py-20 bg-white"
      aria-label="Galeria de produtos"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-dolce-rosa font-body text-sm font-semibold tracking-widest uppercase mb-3">
            Nossos Doces
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-dolce-marrom mb-4">
            Feitos com Amor e Ingredientes Selecionados
          </h2>
          <p className="font-body text-dolce-marrom/60 max-w-2xl mx-auto text-lg">
            Cada doce e preparado artesanalmente com ingredientes de alta
            qualidade, garantindo sabor e apresentacao impecaveis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="group bg-dolce-creme rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} - doce artesanal da Dolce Neves`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <span className="text-dolce-rosa text-xs font-semibold tracking-wider uppercase">
                  {product.category}
                </span>
                <h3 className="font-display text-lg font-semibold text-dolce-marrom mt-1 mb-2">
                  {product.name}
                </h3>
                <p className="font-body text-sm text-dolce-marrom/60 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <p className="font-display text-xl font-bold text-dolce-rosa">
                  {formatPrice(product.price)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
