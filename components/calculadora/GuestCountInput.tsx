"use client";

import { useEffect, useState } from "react";

interface GuestCountInputProps {
  value: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
}

const PRESETS = [10, 25, 50, 100, 150, 200];

export default function GuestCountInput({
  value,
  onChange,
  min = 5,
  max = 500,
}: GuestCountInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < min) {
      onChange(min);
      setInputValue(min.toString());
    } else if (num > max) {
      onChange(max);
      setInputValue(max.toString());
    } else {
      onChange(num);
    }
  };

  const adjust = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChange(next);
  };

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-dolce-marrom mb-1">
        2. Quantos convidados?
      </h2>
      <p className="font-body text-sm text-dolce-marrom/50 mb-4">
        Inclua uma margem se não tiver certeza do número exato
      </p>

      <div className="flex items-center gap-4">
        {/* Stepper */}
        <div className="flex items-center gap-2 bg-white border-2 border-dolce-creme rounded-xl px-2">
          <button
            onClick={() => adjust(-5)}
            disabled={value <= min}
            className="w-10 h-10 flex items-center justify-center text-dolce-marrom/50 hover:text-dolce-rosa disabled:opacity-30 transition-colors text-xl font-bold"
            aria-label="Diminuir 5 convidados"
          >
            −
          </button>
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ""))}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && handleBlur()}
            className="w-16 text-center font-display text-2xl font-bold text-dolce-marrom bg-transparent outline-none"
            aria-label="Número de convidados"
          />
          <button
            onClick={() => adjust(5)}
            disabled={value >= max}
            className="w-10 h-10 flex items-center justify-center text-dolce-marrom/50 hover:text-dolce-rosa disabled:opacity-30 transition-colors text-xl font-bold"
            aria-label="Aumentar 5 convidados"
          >
            +
          </button>
        </div>

        <span className="font-body text-sm text-dolce-marrom/40">pessoas</span>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mt-3">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`
              px-3 py-1.5 rounded-full font-body text-xs font-medium transition-all
              ${
                value === preset
                  ? "bg-dolce-rosa text-white"
                  : "bg-white text-dolce-marrom/60 hover:bg-dolce-rosa-claro/50 border border-dolce-creme"
              }
            `}
          >
            {preset} pessoas
          </button>
        ))}
      </div>

      {/* Range slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={5}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full mt-3 accent-dolce-rosa h-2 rounded-full appearance-none bg-dolce-rosa-claro/50 cursor-pointer"
        aria-label="Slider de convidados"
      />
      <div className="flex justify-between font-body text-xs text-dolce-marrom/30 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
