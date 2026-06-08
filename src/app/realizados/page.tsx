import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export default async function Realizados() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventos = await prisma.event.findMany({
    where: { status: "APPROVED", date: { lt: hoje } },
    include: { city: true, category: true, organizer: true, banner: true },
    orderBy: { date: "desc" },
  });

  // agrupa por "Mês de Ano"
  const grupos: Record<string, typeof eventos> = {};
  for (const e of eventos) {
    const d = new Date(e.date);
    const chave = `${MESES[d.getMonth()]} de ${d.getFullYear()}`;
    (grupos[chave] ||= []).push(e);
  }
  const chaves = Object.keys(grupos);

  return (
    <div className="page">
      <h1>Eventos realizados</h1>
      <p style={{ color: "var(--muted)", marginTop: -6 }}>
        Curadoria do que já aconteceu no ecossistema de inovação do Sul de Minas.
      </p>

      {eventos.length === 0 && (
        <p style={{ color: "var(--muted)", marginTop: 20 }}>Ainda não há eventos realizados para mostrar.</p>
      )}

      {chaves.map((mes) => (
        <section key={mes} style={{ marginTop: 28 }}>
          <h3 style={{ color: "var(--blue)", borderBottom: "1px solid #E5E9F0", paddingBottom: 6 }}>{mes}</h3>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {grupos[mes].map((e) => (
              <article key={e.id} style={{ display: "flex", gap: 14, alignItems: "center", border: "1px solid #E5E9F0", borderRadius: 12, padding: 12, background: "#fff" }}>
                {e.banner?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.banner.url} alt="" style={{ width: 84, height: 64, objectFit: "cover", borderRadius: 8, flex: "0 0 auto" }} />
                ) : (
                  <div style={{ width: 84, height: 64, borderRadius: 8, background: "linear-gradient(135deg,#0D3B8C,#16A57F)", flex: "0 0 auto" }} />
                )}
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 15 }}>{e.title}</strong>
                  <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>
                    {new Date(e.date).toLocaleDateString("pt-BR")}
                    {e.city?.name ? ` · ${e.city.name}` : ""}
                    {e.organizer?.name ? ` · ${e.organizer.name}` : ""}
                  </div>
                  {e.category?.name && <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{e.category.name}</div>}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
