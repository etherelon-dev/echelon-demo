import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#08080A",
          800: "#111113",
          700: "#17171B",
          600: "#212125",
          500: "#2B2B30",
          400: "#3A3A40"
        },
        bone: {
          DEFAULT: "#ECEAE5",
          dim: "#9B9A97",
          faint: "#67666B"
        },
        gold: {
          300: "#E1C594",
          400: "#D0AD79",
          500: "#B58A54",
          600: "#8F6B3E",
          700: "#5F4A2C"
        },
        steel: {
          300: "#8C99A6",
          400: "#71818F",
          500: "#5B6B79",
          600: "#43505B"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        "map-label": ["var(--font-map-label)", "Georgia", "serif"]
      },
      maxWidth: {
        content: "1320px"
      },
      keyframes: {
        "trade-flow": {
          "0%": { strokeDashoffset: "240" },
          "100%": { strokeDashoffset: "0" }
        },
        "marker-pulse": {
          "0%": { transform: "scale(0.9)", opacity: "0.65" },
          "70%": { transform: "scale(2.2)", opacity: "0" },
          "100%": { transform: "scale(2.2)", opacity: "0" }
        },
        "border-glow": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.9" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "blob-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(24px, -28px) scale(1.08)" }
        },
        "chevron-bounce": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%": { transform: "translateY(6px)", opacity: "1" }
        }
      },
      animation: {
        "trade-flow": "trade-flow 5s linear infinite",
        "marker-pulse": "marker-pulse 2.8s ease-out infinite",
        "border-glow": "border-glow 4s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out forwards",
        "blob-float": "blob-float 11s ease-in-out infinite",
        "chevron-bounce": "chevron-bounce 1.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
