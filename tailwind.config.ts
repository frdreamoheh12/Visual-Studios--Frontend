import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          950: "#07070B",
          900: "#0B0B12",
          850: "#101019",
          800: "#15151F",
        },
        line: "rgba(255,255,255,0.08)",
        accent: {
          violet: "#8B5CF6",
          blue: "#4C7CF3",
          cyan: "#4CD9F0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "vs-glow": "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.18), transparent 60%)",
        "vs-gradient": "linear-gradient(135deg, #8B5CF6 0%, #4C7CF3 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(139,92,246,0.25)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-move": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "gradient-move": "gradient-move 8s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
