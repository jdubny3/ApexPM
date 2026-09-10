import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#070b14",
          900: "#0b1120",
          850: "#0f172a",
          800: "#131e36",
          700: "#1e293b",
        },
        gold: {
          400: "#f6c343",
          500: "#eab308",
          600: "#ca8a04",
        },
        gt: {
          gold: "#B3A369",
          navy: "#003057",
        }
      },
    },
  },
  plugins: [],
};
export default config;
