import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fffaf5",
        foreground: "#3d3a50",
        muted: "#6f7285",
        line: "rgba(92, 94, 122, 0.14)",
        card: "rgba(255, 255, 255, 0.78)",
        "card-strong": "rgba(255, 255, 255, 0.92)",
        sky: "#dcefff",
        rose: "#ffdbe6",
        sun: "#ffe5b2",
        lavender: "#ece4ff",
        mint: "#ddf5ea",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "sans-serif"],
        display: ["var(--font-lora)", "serif"],
      },
      boxShadow: {
        soft: "0 20px 48px rgba(149, 134, 173, 0.16)",
        card: "0 12px 30px rgba(120, 108, 143, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
