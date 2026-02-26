"use client";

import type { DashboardAlert } from "@/lib/actions/dashboard";
import Link from "next/link";

interface AlertsPanelProps {
  alerts: DashboardAlert[];
}

const SEVERITY_STYLES: Record<
  string,
  { bg: string; border: string; text: string; dot: string }
> = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    dot: "bg-red-500",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-xl">✅</span>
        <p className="font-body text-sm text-emerald-800">
          Tudo certo! Nenhum alerta no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => {
        const style = SEVERITY_STYLES[alert.type] || SEVERITY_STYLES.info;
        if (alert.href) {
          return (
            <Link
              key={i}
              href={alert.href}
              className={`
                flex items-center gap-3 rounded-xl px-4 py-3 border font-body text-sm
                ${style.bg} ${style.border} ${style.text}
                hover:opacity-80 transition-opacity cursor-pointer
              `}
            >
              <span
                className={`flex-shrink-0 w-2 h-2 rounded-full ${style.dot} ${alert.type === "critical" ? "animate-pulse" : ""}`}
              />
              <span>
                <strong>{alert.title}</strong> — {alert.description}
              </span>
            </Link>
          );
        }

        return (
          <div
            key={i}
            className={`
              flex items-center gap-3 rounded-xl px-4 py-3 border font-body text-sm
              ${style.bg} ${style.border} ${style.text}
            `}
          >
            <span
              className={`flex-shrink-0 w-2 h-2 rounded-full ${style.dot} ${alert.type === "critical" ? "animate-pulse" : ""}`}
            />
            <span>
              <strong>{alert.title}</strong> — {alert.description}
            </span>
          </div>
        );
      })}
    </div>
  );
}
