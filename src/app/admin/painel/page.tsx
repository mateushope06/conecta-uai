import { auth, isMaster } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { approveEvent, rejectEvent, deleteEvent, grantUser, revokeUser } from "../actions";
import { logout } from "../auth-actions";
import { Check, X, Clock, MapPin, Trash2 } from "lucide-react";

export default async function Painel() {
  const session = await auth();
  if (!session?.user) redirect("/admin");
  const role = (session.user as { role?: string }).role;
  const master = isMaster(role);

  const pending = await prisma.event.findMany({
    where: { status: "PENDING" },
    include: { city: true, category: true, organizer: true, banner: true },
    orderBy: { createdAt: "desc" },
  });
  const published = await prisma.event.findMany({
    where: { status: "APPROVED" },
    include: { city: true, category: true, organizer: true, banner: true },
    orderBy: { date: "desc" },
  });
  const users = master ? await prisma.user.findMany({ orderBy: { createdAt: "asc" } }) : [];

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: 24, fontFamily: "system-ui,sans-serif", color: "#16203A" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, color: "#0D3B8C" }}>Painel · Conecta UAI</h1>
          <p style={{ margin: "4px 0 0", color: "#5B667E", fontSize: 14 }}>
            {session.user.name} — {master ? "Administrador Master" : "Administrador"}
          </p>
        </div>
        <form action={logout}><button style={ghost}>Sair</button></form>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18 }}>Aprovações ({pending.length})</h2>
        {pending.length === 0 && <p style={{ color: "#5B667E" }}>Nenhum evento aguardando aprovação.</p>}
        {pending.map((e) => (
          <div key={e.id} style={card}>
            {e.banner?.url && (
              <a href={e.banner.url} target="_blank" rel="noreferrer" title="Abrir banner em tamanho real">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.banner.url} alt="banner do evento" style={{ width: "100%", maxHeight: 360, objectFit: "contain", background: "#F6F8FB", borderRadius: 10, marginBottom: 6, border: "1px solid #E5E9F0" }} />
              </a>
            )}
            {e.banner?.url && (
              <div style={{ fontSize: 12, color: "#5B667E", marginBottom: 12 }}>
                <a href={e.banner.url} target="_blank" rel="noreferrer" style={{ color: "#0D3B8C" }}>Abrir imagem em nova aba ↗</a>
              </div>
            )}
            <strong style={{ fontSize: 16 }}>{e.title}</strong>
            <div style={{ color: "#5B667E", fontSize: 14, margin: "6px 0" }}>
              <Clock size={13} style={{ verticalAlign: -2 }} /> {e.date.toLocaleDateString("pt-BR")}
              {e.endDate ? ` a ${e.endDate.toLocaleDateString("pt-BR")}` : ""} {e.startTime ?? ""}
              {e.endTime ? `–${e.endTime}` : ""} · {e.category?.name} · {e.modality}
            </div>
            {e.address && <div style={{ color: "#5B667E", fontSize: 14 }}><MapPin size={13} style={{ verticalAlign: -2 }} /> {e.address}{e.city?.name ? ` — ${e.city.name}` : ""}</div>}
            <p style={{ fontSize: 14 }}>{e.description}</p>
            {e.registerUrl && (
              <div style={{ fontSize: 13, margin: "8px 0", padding: "8px 10px", background: "#F6F8FB", borderRadius: 8, wordBreak: "break-all" }}>
                <strong style={{ color: "#16203A" }}>Link de inscrição:</strong>{" "}
                <a href={e.registerUrl} target="_blank" rel="noreferrer" style={{ color: "#0D3B8C" }}>{e.registerUrl} ↗</a>
                <div style={{ color: "#9aa3b5", fontSize: 12, marginTop: 2 }}>Verifique o destino antes de autorizar.</div>
              </div>
            )}
            <div style={{ fontSize: 13, color: "#5B667E" }}>
              {e.organizer?.name} · enviado por {e.submitterName ?? "—"} ({e.submitterEmail ?? "—"}{e.submitterPhone ? ` · ${e.submitterPhone}` : ""})
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <form action={async () => { "use server"; await approveEvent(e.id); }}>
                <button style={{ ...btn, background: "#16A57F" }}><Check size={15} style={{ verticalAlign: -2 }} /> Autorizar</button>
              </form>
              <form action={async () => { "use server"; await rejectEvent(e.id); }}>
                <button style={ghost}><X size={15} style={{ verticalAlign: -2 }} /> Recusar</button>
              </form>
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18 }}>Eventos publicados ({published.length})</h2>
        {published.length === 0 && <p style={{ color: "#5B667E" }}>Nenhum evento publicado.</p>}
        {published.map((e) => (
          <div key={e.id} style={{ ...card, display: "flex", gap: 12, alignItems: "center" }}>
            {e.banner?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.banner.url} alt="" style={{ width: 70, height: 52, objectFit: "cover", borderRadius: 8, flex: "0 0 auto" }} />
            ) : (
              <div style={{ width: 70, height: 52, borderRadius: 8, background: "linear-gradient(135deg,#0D3B8C,#16A57F)", flex: "0 0 auto" }} />
            )}
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: 15 }}>{e.title}</strong>
              <div style={{ color: "#5B667E", fontSize: 13 }}>
                {e.date.toLocaleDateString("pt-BR")}{e.city?.name ? ` · ${e.city.name}` : ""}{e.organizer?.name ? ` · ${e.organizer.name}` : ""}
              </div>
            </div>
            <form action={async () => { "use server"; await deleteEvent(e.id); }}>
              <button style={{ ...ghost, color: "#c0392b", borderColor: "#f2c4c0" }}><Trash2 size={14} style={{ verticalAlign: -2 }} /> Excluir</button>
            </form>
          </div>
        ))}
      </section>

      {master && (
        <section>
          <h2 style={{ fontSize: 18 }}>Usuários autorizados</h2>
          <form action={grantUser} style={{ ...card, display: "grid", gap: 10 }}>
            <strong>Conceder acesso</strong>
            <input name="name" placeholder="Nome" required style={inp} />
            <input name="email" type="email" placeholder="E-mail" required style={inp} />
            <input name="password" type="password" placeholder="Senha (mín. 8)" required style={inp} />
            <select name="role" style={inp} defaultValue="ADMIN">
              <option value="ADMIN">Administrador (aprova eventos)</option>
              <option value="EDITOR">Editor</option>
            </select>
            <button style={btn}>Conceder</button>
          </form>
          {users.map((u) => (
            <div key={u.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{u.name} — {u.email} <em style={{ color: "#5B667E" }}>({u.role}{u.active ? "" : " · inativo"})</em></span>
              {u.role !== "ADMIN_MASTER" && u.active && (
                <form action={async () => { "use server"; await revokeUser(u.id); }}>
                  <button style={ghost}>Revogar</button>
                </form>
              )}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E5E9F0", borderRadius: 14, padding: 16, marginBottom: 14 };
const btn: React.CSSProperties = { padding: "9px 16px", border: 0, borderRadius: 9, background: "#0D3B8C", color: "#fff", fontWeight: 700, cursor: "pointer" };
const ghost: React.CSSProperties = { padding: "9px 16px", border: "1px solid #E5E9F0", borderRadius: 9, background: "#fff", color: "#16203A", cursor: "pointer" };
const inp: React.CSSProperties = { padding: "9px 12px", border: "1px solid #E5E9F0", borderRadius: 9, fontSize: 14 };
