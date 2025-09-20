import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarFinder - Encontre o Carro Perfeito com IA",
  description: "Plataforma inteligente para buscar carros com assistente de IA conversacional. Encontre seu veículo ideal de forma rápida e intuitiva.",
  keywords: ["carros", "veículos", "IA", "busca inteligente", "automóveis"],
  authors: [{ name: "CarFinder Team" }],
  openGraph: {
    title: "CarFinder - Busca Inteligente de Carros",
    description: "Encontre o carro perfeito com nossa IA conversacional",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
