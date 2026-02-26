"use client";

export function EmptySlotHint() {
  return (
    <div className="flex flex-col items-center justify-center gap-1 animate-pulse">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="text-dolce-rosa"
      >
        <path
          d="M10 3v14M10 3l-3 3M10 3l3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[9px] font-body font-medium text-dolce-rosa">
        Solte aqui
      </span>
    </div>
  );
}
