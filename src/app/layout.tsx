import type { Metadata } from "next";
import "@/styles/globals.css";
import ThemeEffects from "@/components/ui/ThemeEffects";

export const metadata: Metadata = {
  title: "CompetitorIQ — Competitor Intelligence",
  description: "Портал анализа конкурентов для Weekend Бильярд. Мониторинг цен, рейтингов, активности и AI-аналитика.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-style="01" data-theme="dark" suppressHydrationWarning>
      <head />
      <body>
        <ThemeEffects />
        {children}
      </body>
    </html>
  );
}


