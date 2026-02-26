"use client";

interface DeleteConfirmModalProps {
  ingredientName: string;
  usageCount: number;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  ingredientName,
  usageCount,
  loading,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const canDelete = usageCount === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C62828"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="font-display text-lg text-dolce-marrom font-bold">
            Excluir ingrediente
          </h2>
        </div>

        {canDelete ? (
          <p className="font-body text-sm text-dolce-marrom/70 mb-6">
            Tem certeza que deseja excluir{" "}
            <strong className="text-dolce-marrom">{ingredientName}</strong>?
            Esta ação não pode ser desfeita.
          </p>
        ) : (
          <div className="mb-6">
            <p className="font-body text-sm text-dolce-marrom/70 mb-3">
              Não é possível excluir{" "}
              <strong className="text-dolce-marrom">{ingredientName}</strong>.
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <p className="font-body text-xs text-amber-800">
                Este ingrediente está sendo usado em{" "}
                <strong>{usageCount}</strong> ficha{usageCount !== 1 ? "s" : ""}{" "}
                técnica{usageCount !== 1 ? "s" : ""}. Remova-o das fichas antes
                de excluir.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl font-body text-sm text-dolce-marrom/70 hover:bg-dolce-marrom/5 transition-colors"
          >
            {canDelete ? "Cancelar" : "Entendi"}
          </button>
          {canDelete && (
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-body text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Excluindo..." : "Excluir"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
