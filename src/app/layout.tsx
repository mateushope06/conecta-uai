import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./_components/SiteChrome";

export const metadata: Metadata = {
  title: "Conecta UAI — Agenda da Inovação do Sul de Minas",
  description:
    "A Unificada Agenda da Inovação do Sul de Minas. Acompanhe os principais eventos do ecossistema regional.",
  manifest: "/manifest.json",
  themeColor: "#0D3B8C",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Conecta UAI",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
