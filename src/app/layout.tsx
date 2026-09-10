import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { LibraryProvider } from "@/context/library-context";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Entrelinhas — Biblioteca & Formação Intelectual",
  description: "Biblioteca pessoal para organização de leituras, reflexões e trajetória intelectual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${karla.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LibraryProvider>
          <AppShell>{children}</AppShell>
        </LibraryProvider>
      </body>
    </html>
  );
}
