import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  "#f6f8f6",
          100: "#eaf0ea",
          200: "#d5e2d5",
          300: "#b5cdb5",
          400: "#8fb38f",
          500: "#6d976d",
          600: "#537953",
          700: "#436143",
          800: "#374e37",
          900: "#2e412e",
        },
        cream: {
          50:  "#fdfdfc",
          100: "#fbfbf9",
          200: "#f5f6f2",
          300: "#eceee7",
          400: "#e0e3d8",
          500: "#ccd1c1",
        },
        pearl: {
          50:  "#fcfcfd",
          100: "#f8f9fa",
          200: "#edf0f2",
          300: "#e2e6e9",
        },
        sakti: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        saffron: { 400: "#fb923c", 500: "#f97316", 600: "#ea580c" },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'soft': '0 8px 30px -4px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 16px 40px -6px rgba(0, 0, 0, 0.07)',
      },
    },
  },
  plugins: [],
};
export default config;
