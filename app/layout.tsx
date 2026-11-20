import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "JULIA — Bientôt votre nouvelle signature",
  description:
    "JULIA, un nouveau parfum à découvrir le 20 janvier 2027. Une signature à venir.",
  themeColor: "#74131b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
