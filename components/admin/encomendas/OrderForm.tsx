"use client";

import {
  checkCapacity,
  getClientSuggestions,
  getProducts,
} from "@/lib/actions/orders";
import type { OrderFormData, OrderItem } from "@/types/orders";
import { useEffect, useState, useTransition } from "react";
import CapacityWarning from "./CapacityWarning";
import OrderItemsEditor from "./OrderItemsEditor";

interface ProductOption {
  id: string;
  name: string;
  price: number;
}

interface OrderFormProps {
  initialData?: Partial<OrderFormData> & { id?: string };
  onSubmit: (data: OrderFormData) => Promise<{ error?: string }>;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function OrderForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Salvar Pedido",
}: OrderFormProps) {
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [clientSuggestions, setClientSuggestions] = useState<
    { name: string; phone: string; email: string | null }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [capacityWarning, setCapacityWarning] = useState<{
    has_capacity: boolean;
    current_units: number;
    max_units: number;
    available_units: number;
    occupation_percent: number;
  } | null>(null);
  const [forceAccepted, setForceAccepted] = useState(
    initialData?.force_accepted || false,
  );
  const [error, setError] = useState("");

  const [form, setForm] = useState<OrderFormData>({
    client_name: initialData?.client_name || "",
    client_phone: initialData?.client_phone || "",
    client_email: initialData?.client_email || "",
    items: initialData?.items || [
      { product_name: "", quantity: 1, unit_price: 0 },
    ],
    delivery_date: initialData?.delivery_date || "",
    delivery_time: initialData?.delivery_time || "",
    source: initialData?.source || "manual",
    notes: initialData?.notes || "",
    force_accepted: false,
  });

  useEffect(() => {
    getProducts().then(({ data }) => {
      if (data) setProducts(data);
    });
  }, []);

  // Client autocomplete
  async function handleClientSearch(name: string) {
    setForm((f) => ({ ...f, client_name: name }));
    if (name.length >= 2) {
      const { data } = await getClientSuggestions(name);
      if (data && data.length > 0) {
        setClientSuggestions(data);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }

  function selectClient(client: {
    name: string;
    phone: string;
    email: string | null;
  }) {
    setForm((f) => ({
      ...f,
      client_name: client.name,
      client_phone: client.phone || f.client_phone,
      client_email: client.email || f.client_email,
    }));
    setShowSuggestions(false);
  }

  // Phone mask
  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "");
    let masked = digits;
    if (digits.length >= 2) {
      masked = `(${digits.slice(0, 2)}) `;
      if (digits.length >= 7) {
        masked += `${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
      } else {
        masked += digits.slice(2);
      }
    }
    setForm((f) => ({ ...f, client_phone: masked }));
  }

  // Capacity check on date change
  async function handleDateChange(date: string) {
    setForm((f) => ({ ...f, delivery_date: date }));
    if (date) {
      const totalUnits = form.items.reduce((s, it) => s + it.quantity, 0);
      const result = await checkCapacity(date, totalUnits, initialData?.id);
      if (result.data) {
        setCapacityWarning(result.data);
        setForceAccepted(false);
      }
    } else {
      setCapacityWarning(null);
    }
  }

  function handleItemsChange(items: OrderItem[]) {
    setForm((f) => ({ ...f, items }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const finalData: OrderFormData = {
      ...form,
      force_accepted: forceAccepted,
    };

    startTransition(async () => {
      const result = await onSubmit(finalData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-dolce-marrom/10 bg-white font-body text-sm text-dolce-marrom placeholder:text-dolce-marrom/30 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/30 focus:border-dolce-rosa/50 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 font-body text-sm">
          {error}
        </div>
      )}

      {/* Client info */}
      <fieldset className="space-y-4">
        <legend className="font-display text-lg text-dolce-marrom font-semibold mb-2">
          Dados do Cliente
        </legend>

        <div className="relative">
          <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
            Nome *
          </label>
          <input
            type="text"
            required
            value={form.client_name}
            onChange={(e) => handleClientSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Nome do cliente"
            className={inputClass}
            autoComplete="off"
          />
          {showSuggestions && clientSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-dolce-marrom/10 shadow-lg max-h-40 overflow-y-auto">
              {clientSuggestions.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectClient(c)}
                  className="w-full text-left px-3 py-2 font-body text-sm text-dolce-marrom hover:bg-dolce-rosa-claro transition-colors"
                >
                  <span className="font-medium">{c.name}</span>
                  {c.phone && (
                    <span className="text-dolce-marrom/40 ml-2">{c.phone}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={form.client_phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="(00) 00000-0000"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={form.client_email}
              onChange={(e) =>
                setForm((f) => ({ ...f, client_email: e.target.value }))
              }
              placeholder="email@exemplo.com"
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* Items */}
      <fieldset className="space-y-3">
        <legend className="font-display text-lg text-dolce-marrom font-semibold mb-2">
          Itens do Pedido
        </legend>
        <OrderItemsEditor
          items={form.items}
          products={products}
          onChange={handleItemsChange}
        />
      </fieldset>

      {/* Delivery */}
      <fieldset className="space-y-4">
        <legend className="font-display text-lg text-dolce-marrom font-semibold mb-2">
          Entrega
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
              Data de Entrega *
            </label>
            <input
              type="date"
              required
              value={form.delivery_date}
              onChange={(e) => handleDateChange(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
              Horário
            </label>
            <input
              type="time"
              value={form.delivery_time}
              onChange={(e) =>
                setForm((f) => ({ ...f, delivery_time: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Capacity warning */}
        {capacityWarning && !capacityWarning.has_capacity && (
          <CapacityWarning
            capacity={capacityWarning}
            onForceAccept={() => setForceAccepted(true)}
          />
        )}
        {forceAccepted && capacityWarning && !capacityWarning.has_capacity && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-body text-xs text-amber-800">
            Aceitação forçada ativada. O pedido será criado mesmo acima da
            capacidade.
          </div>
        )}
      </fieldset>

      {/* Source + Notes */}
      <fieldset className="space-y-4">
        <div>
          <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
            Origem
          </label>
          <select
            value={form.source}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                source: e.target.value as OrderFormData["source"],
              }))
            }
            className={inputClass}
          >
            <option value="manual">Manual</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="corporativo">Corporativo</option>
            <option value="site">Site</option>
          </select>
        </div>
        <div>
          <label className="block font-body text-xs text-dolce-marrom/60 mb-1">
            Observações
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={3}
            placeholder="Observações sobre o pedido..."
            className={inputClass}
          />
        </div>
      </fieldset>

      {/* Total preview */}
      <div className="bg-dolce-creme rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="font-body text-sm text-dolce-marrom/60">
          Total estimado
        </span>
        <span className="font-display text-xl text-dolce-marrom font-bold">
          R${" "}
          {form.items
            .reduce((sum, it) => sum + it.quantity * it.unit_price, 0)
            .toFixed(2)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-dolce-marrom/10 font-body text-sm text-dolce-marrom/60 hover:bg-dolce-marrom/5 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl bg-dolce-rosa text-white font-body text-sm font-medium hover:bg-dolce-rosa/90 transition-colors disabled:opacity-50"
        >
          {isPending ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
