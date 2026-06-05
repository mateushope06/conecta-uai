"use client";

import { useState } from "react";

// PÁGINA CADASTRAR — formulário completo enviando para /api/submissions
// (inclui upload de banner e link de inscrição). Aqui também é só
// trocar o visual pelo seu layout aprovado; a lógica de envio fica.

export default function Cadastrar() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/submissions", { method: "POST", body: fd });
    setStatus(res.ok ? "ok" : "error");
    if (res.ok) (e.target as HTMLFormElement).reset();
  }

  if (status === "ok") {
    return (
      <main style={wrap}>
        <h1 style={{ color: "#16A57F" }}>Cadastro enviado!</h1>
        <p>Seu evento entrou na fila de aprovação. A equipe da Conecta UAI vai avaliar e autorizar.</p>
      </main>
    );
  }

  return (
    <main style={wrap}>
      <h1 style={{ color: "#0D3B8C" }}>Cadastrar evento</h1>
      <p style={{ color: "#5B667E" }}>Preencha os dados. O evento será publicado após aprovação.</p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <input name="submitterName" placeholder="Seu nome" style={inp} />
        <input name="submitterEmail" type="email" placeholder="Seu e-mail" style={inp} />
        <input name="submitterPhone" placeholder="WhatsApp" style={inp} />
        <hr style={{ border: 0, borderTop: "1px solid #E5E9F0" }} />
        <input name="title" placeholder="Título do evento" required style={inp} />
        <textarea name="description" placeholder="Descrição" rows={3} style={inp} />
        <div style={{ display: "flex", gap: 10 }}>
          <input name="date" type="date" required style={{ ...inp, flex: 1 }} />
          <input name="startTime" type="time" style={{ ...inp, flex: 1 }} />
          <input name="endTime" type="time" style={{ ...inp, flex: 1 }} />
        </div>
        <input name="address" placeholder="Endereço / Local" style={inp} />
        <input name="city" placeholder="Cidade" style={inp} />
        <input name="category" placeholder="Categoria" style={inp} />
        <input name="organizer" placeholder="Organizador" style={inp} />
        <select name="modality" style={inp} defaultValue="PRESENCIAL">
          <option value="PRESENCIAL">Presencial</option>
          <option value="ONLINE">Online</option>
          <option value="HIBRIDO">Híbrido</option>
        </select>
        <input name="registerUrl" type="url" placeholder="Link de inscrição (https://...)" style={inp} />
        <label style={{ fontSize: 14, color: "#5B667E" }}>Banner do evento</label>
        <input name="banner" type="file" accept="image/*" style={inp} />
        <button disabled={status === "sending"} style={btn}>
          {status === "sending" ? "Enviando..." : "Enviar para aprovação"}
        </button>
        {status === "error" && <p style={{ color: "#c0392b" }}>Algo deu errado. Confira os campos e tente de novo.</p>}
      </form>
    </main>
  );
}

const wrap: React.CSSProperties = { fontFamily: "system-ui,sans-serif", color: "#16203A", maxWidth: 720, margin: "0 auto", padding: 24 };
const inp: React.CSSProperties = { padding: "10px 12px", border: "1px solid #E5E9F0", borderRadius: 10, fontSize: 15 };
const btn: React.CSSProperties = { padding: "12px", border: 0, borderRadius: 10, background: "#0D3B8C", color: "#fff", fontWeight: 700, cursor: "pointer" };
