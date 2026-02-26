import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dolce: {
          rosa: "#C96B7A",
          creme: "#F7F0E8",
          marrom: "#3D2314",
          "rosa-claro": "#FAE8EC",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
      },
      animation: {
        "whatsapp-pulse": "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
