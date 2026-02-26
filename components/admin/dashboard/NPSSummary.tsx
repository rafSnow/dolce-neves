"use client";

import type { NPSSummary as NPSSummaryType } from "@/lib/actions/dashboard";

interface NPSSummaryProps {
  nps: NPSSummaryType;
}

const NPS_COLORS = ["#EF4444", "#F97316", "#EAB308", "#84CC16", "#22C55E"];
const NPS_EMOJIS = ["😞", "😐", "🙂", "😍", "🤩"];

export default function NPSSummary({ nps }: NPSSummaryProps) {
  const totalResponses = Object.values(nps.distribution).reduce(
    (s, d) => s + d,
    0,
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-dolce-marrom/5">
      <h3 className="font-display text-base font-semibold text-dolce-marrom mb-4">
        💬 Satisfação dos Clientes (NPS)
      </h3>

      {totalResponses > 0 ? (
        <>
          {/* Average */}
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-dolce-marrom">
                {nps.average?.toFixed(1) ?? "—"}
              </p>
              <p className="font-body text-xs text-dolce-marrom/50">de 5.0</p>
            </div>
            <div className="flex-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${
                      star <= Math.round(nps.average ?? 0) ? "" : "opacity-20"
                    }`}
                  >
                    {NPS_EMOJIS[star - 1]}
                  </span>
                ))}
              </div>
              <p className="font-body text-xs text-dolce-marrom/50 mt-1">
                {totalResponses} avaliação{totalResponses !== 1 ? "ões" : ""}
              </p>
            </div>
          </div>

          {/* Distribution bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = nps.distribution[score] || 0;
              const pct =
                totalResponses > 0 ? (count / totalResponses) * 100 : 0;
              return (
                <div key={score} className="flex items-center gap-2">
                  <span className="font-body text-xs text-dolce-marrom/50 w-4 text-right">
                    {score}
                  </span>
                  <span className="text-sm w-5">{NPS_EMOJIS[score - 1]}</span>
                  <div className="flex-1 bg-dolce-creme rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: NPS_COLORS[score - 1],
                      }}
                    />
                  </div>
                  <span className="font-body text-xs text-dolce-marrom/40 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recent comments */}
          {nps.recentComments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dolce-creme">
              <p className="font-body text-xs text-dolce-marrom/50 font-semibold mb-2 uppercase tracking-wide">
                Comentários recentes
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {nps.recentComments.map((comment, i) => (
                  <div
                    key={i}
                    className="bg-dolce-creme/50 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm">
                        {NPS_EMOJIS[comment.nps_score - 1]}
                      </span>
                      <span className="font-body text-xs font-semibold text-dolce-marrom">
                        {comment.client_name}
                      </span>
                    </div>
                    <p className="font-body text-xs text-dolce-marrom/60">
                      &ldquo;{comment.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-3xl mb-2">💬</p>
          <p className="font-body text-sm text-dolce-marrom/40">
            Nenhuma avaliação recebida ainda
          </p>
        </div>
      )}
    </div>
  );
}
