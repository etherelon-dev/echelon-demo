import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet "buku tabungan": kertas ledger pudar, tinta hijau-gelap,
        // dan stempel merah — bukan tema gelap SaaS generik.
        paper: "#EEF2E9",
        "paper-line": "#C7D3BE",
        "paper-raised": "#E3E9DC",
        ink: "#1C2A20",
        "ink-muted": "#51604F",
        stamp: "#A5372B",
        brass: "#8A6C33",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        ledger: ["var(--font-ledger)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
