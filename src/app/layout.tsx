import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const heading = Newsreader({
  subsets: ["latin"],
  variable: "--font-heading",
  style: ["normal", "italic"],
});

const ledger = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ledger",
});

export const metadata: Metadata = {
  title: "Estyalife — Buku Hidup",
  description: "Simulator kehidupan, ekonomi, dan dunia dimulai dari 2012.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${heading.variable} ${ledger.variable}`}>
      <body>{children}</body>
    </html>
  );
}
