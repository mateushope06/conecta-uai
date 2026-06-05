import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { login } from "./auth-actions";
import { Lock } from "lucide-react";

export default async function AdminLogin() {
  const session = await auth();
  if (session?.user) redirect("/admin/painel");

  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#F6F8FB", fontFamily: "system-ui,sans-serif" }}>
      <form
        action={async (fd: FormData) => { "use server"; await login(null, fd); }}
        style={{ background: "#fff", padding: 32, borderRadius: 16, width: 360, boxShadow: "0 10px 40px rgba(13,59,140,.10)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0D3B8C", fontWeight: 700, marginBottom: 4 }}>
          <Lock size={18} /> Área Administrativa
        </div>
        <p style={{ color: "#5B667E", fontSize: 14, margin: "0 0 20px" }}>Acesso restrito a usuários autorizados.</p>
        <label style={{ fontSize: 13, color: "#16203A" }}>E-mail</label>
        <input name="email" type="email" required style={inp} />
        <label style={{ fontSize: 13, color: "#16203A" }}>Senha</label>
        <input name="password" type="password" required style={inp} />
        <button type="submit" style={btn}>Entrar</button>
      </form>
    </main>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #E5E9F0", borderRadius: 10, margin: "6px 0 16px", fontSize: 15 };
const btn: React.CSSProperties = { width: "100%", padding: "12px", border: 0, borderRadius: 10, background: "#0D3B8C", color: "#fff", fontWeight: 700, cursor: "pointer" };
