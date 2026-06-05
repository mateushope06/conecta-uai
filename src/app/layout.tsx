export const metadata = {
  title: "Conecta UAI — Única Agenda da Inovação do Sul de Minas",
  description: "Acompanhe os principais eventos do ecossistema de inovação do Sul de Minas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
