"use client";

interface CapacityBarProps {
  current: number;
  max: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function CapacityBar({
  current,
  max,
  showLabel = false,
  size = "sm",
}: CapacityBarProps) {
  const percent = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const isOverbooked = current > max;
  const actualPercent = max > 0 ? (current / max) * 100 : 0;

  const getColor = () => {
    if (isOverbooked) return "bg-red-500";
    if (percent >= 80) return "bg-amber-500";
    if (percent >= 50) return "bg-dolce-rosa";
    return "bg-emerald-500";
  };

  const heights: Record<string, string> = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className="w-full">
      <div
        className={`w-full bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}
      >
        <div
          className={`${heights[size]} rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <p
          className={`font-body mt-1 ${
            isOverbooked ? "text-red-600 font-semibold" : "text-dolce-marrom/50"
          } ${size === "sm" ? "text-[9px]" : "text-xs"}`}
        >
          {current}/{max} un.{" "}
          {isOverbooked && (
            <span className="text-red-600">
              (+{current - max} excesso — {actualPercent.toFixed(0)}%)
            </span>
          )}
          {!isOverbooked && `(${actualPercent.toFixed(0)}%)`}
        </p>
      )}
    </div>
  );
}
