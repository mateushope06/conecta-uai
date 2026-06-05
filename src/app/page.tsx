import { prisma } from "@/lib/prisma";

// ============================================================
// PÁGINA PÚBLICA — EVENTOS (agenda)
// ------------------------------------------------------------
// Esta versão é FUNCIONAL e já lê os eventos APROVADOS do banco.
// O visual aqui é simples de propósito: é o ponto onde entra o
// seu layout aprovado do protótipo (conecta-uai.jsx) — hero com
// foto, filtros, e os 3 carrosséis (Semana / Próximas / Meses).
// Basta trocar o JSX abaixo pelos seus componentes, alimentando-os
// com a variável `events` (que vem do banco em vez do mock).
// ============================================================

export const dynamic = "force-dynamic";

export default async function Eventos() {
  const events = await prisma.event.findMany({
    where: { status: "APPROVED" },
    include: { city: true, category: true, organizer: true, banner: true },
    orderBy: { date: "asc" },
  });

  return (
    <main style={{ fontFamily: "system-ui,sans-serif", color: "#16203A", maxWidth: 1180, margin: "0 auto", padding: 24 }}>
      <header style={{ background: "#0D3B8C", color: "#fff", borderRadius: 16, padding: "40px 28px", marginBottom: 28 }}>
        <span style={{ fontSize: 13, opacity: 0.85 }}>Sistema Regional de Inovação · Sul de Minas</span>
        <h1 style={{ margin: "8px 0 6px", fontSize: 30 }}>Conectando pessoas, ideias e oportunidades através da inovação.</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Acompanhe os principais eventos do ecossistema de inovação do Sul de Minas.</p>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {events.map((e) => (
          <article key={e.id} style={{ border: "1px solid #E5E9F0", borderRadius: 14, overflow: "hidden" }}>
            {e.banner?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.banner.url} alt="" style={{ width: "100%", height: 150, objectFit: "cover" }} />
            )}
            <div style={{ padding: 16 }}>
              {e.featured && <span style={{ fontSize: 12, color: "#16A57F", fontWeight: 700 }}>★ Destaque</span>}
              <h3 style={{ margin: "4px 0 8px" }}>{e.title}</h3>
              <div style={{ color: "#5B667E", fontSize: 14 }}>
                {e.date.toLocaleDateString("pt-BR")} {e.startTime ?? ""} · {e.city?.name} · {e.modality}
              </div>
              <p style={{ fontSize: 14 }}>{e.description}</p>
              <div style={{ fontSize: 13, color: "#5B667E" }}>{e.organizer?.name} · {e.category?.name}</div>
              {e.registerUrl && (
                <a href={e.registerUrl} target="_blank" rel="noreferrer" style={{ color: "#0D3B8C", fontWeight: 600, fontSize: 14 }}>
                  Inscrever-se →
                </a>
              )}
            </div>
          </article>
        ))}
        {events.length === 0 && <p style={{ color: "#5B667E" }}>Nenhum evento publicado ainda.</p>}
      </section>
    </main>
  );
}
