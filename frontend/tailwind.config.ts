import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Cinzel'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ayur: {
          bg: "#070b0e",
          card: "#0d1319",
          border: "rgba(255, 255, 255, 0.08)",
          muted: "#94a3b8",
        },
        sakti: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        saffron: { 400: "#fb923c", 500: "#f97316", 600: "#ea580c" },
        gold: {
          300: "#fde68a",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
        }
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        }
      },
      boxShadow: {
        "emerald-glow": "0 0 40px -10px rgba(16, 185, 129, 0.35)",
        "gold-glow": "0 0 35px -8px rgba(245, 158, 11, 0.25)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      }
    },
  },
  plugins: [],
};
export default config;
