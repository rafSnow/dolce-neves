"use client";

import type { CapacityCheck } from "@/types/orders";

interface CapacityWarningProps {
  capacity: CapacityCheck;
  onForceAccept?: () => void;
}

export default function CapacityWarning({
  capacity,
  onForceAccept,
}: CapacityWarningProps) {
  if (capacity.has_capacity) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C62828"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <div className="flex-1">
          <h4 className="font-body text-sm font-semibold text-red-800">
            Capacidade Excedida
          </h4>
          <p className="font-body text-xs text-red-700 mt-1">
            Este dia já tem <strong>{capacity.current_units}</strong> de{" "}
            <strong>{capacity.max_units}</strong> unidades ocupadas (
            {capacity.occupation_percent.toFixed(0)}%). Não há espaço para mais{" "}
            {capacity.max_units - capacity.current_units < 0
              ? "nenhuma"
              : capacity.available_units}{" "}
            unidades.
          </p>
          {onForceAccept && (
            <button
              type="button"
              onClick={onForceAccept}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white font-body text-xs font-medium hover:bg-red-700 transition-colors"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Forçar aceitação mesmo assim
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
