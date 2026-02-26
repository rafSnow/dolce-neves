"use client";

import type { OrderItem } from "@/types/orders";

interface ProductOption {
  id: string;
  name: string;
  price: number;
}

interface OrderItemsEditorProps {
  items: OrderItem[];
  products: ProductOption[];
  onChange: (items: OrderItem[]) => void;
}

export default function OrderItemsEditor({
  items,
  products,
  onChange,
}: OrderItemsEditorProps) {
  function updateItem(
    index: number,
    field: keyof OrderItem,
    value: string | number,
  ) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function selectProduct(index: number, productName: string) {
    const product = products.find((p) => p.name === productName);
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      product_name: productName,
      unit_price: product ? product.price : updated[index].unit_price,
    };
    onChange(updated);
  }

  function addItem() {
    onChange([...items, { product_name: "", quantity: 1, unit_price: 0 }]);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  }

  const inputClass =
    "w-full px-2.5 py-2 rounded-lg border border-dolce-marrom/10 bg-white font-body text-sm text-dolce-marrom placeholder:text-dolce-marrom/30 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 focus:border-dolce-rosa/50 transition-colors";

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-end gap-2 bg-dolce-creme/50 p-3 rounded-xl"
        >
          <div className="flex-1 min-w-0">
            <label className="block font-body text-[10px] text-dolce-marrom/50 mb-0.5">
              Produto
            </label>
            <input
              type="text"
              value={item.product_name}
              onChange={(e) => selectProduct(index, e.target.value)}
              list={`products-${index}`}
              placeholder="Nome do produto"
              required
              className={inputClass}
            />
            <datalist id={`products-${index}`}>
              {products.map((p) => (
                <option key={p.id} value={p.name}>
                  R$ {p.price.toFixed(2)}
                </option>
              ))}
            </datalist>
          </div>

          <div className="w-20">
            <label className="block font-body text-[10px] text-dolce-marrom/50 mb-0.5">
              Qtd.
            </label>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, "quantity", parseInt(e.target.value) || 1)
              }
              required
              className={inputClass}
            />
          </div>

          <div className="w-28">
            <label className="block font-body text-[10px] text-dolce-marrom/50 mb-0.5">
              Preço un.
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={item.unit_price}
              onChange={(e) =>
                updateItem(index, "unit_price", parseFloat(e.target.value) || 0)
              }
              required
              className={inputClass}
            />
          </div>

          <div className="w-24 text-right">
            <p className="font-body text-[10px] text-dolce-marrom/50 mb-0.5">
              Subtotal
            </p>
            <p className="font-body text-sm text-dolce-marrom font-medium py-2">
              R$ {(item.quantity * item.unit_price).toFixed(2)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => removeItem(index)}
            disabled={items.length <= 1}
            className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Remover item"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full py-2 rounded-xl border-2 border-dashed border-dolce-marrom/10 text-dolce-marrom/40 font-body text-sm hover:border-dolce-rosa/30 hover:text-dolce-rosa transition-colors"
      >
        + Adicionar item
      </button>
    </div>
  );
}
