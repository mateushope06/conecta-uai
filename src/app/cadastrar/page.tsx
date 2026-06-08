"use client";
import { useState } from "react";

async function compressImage(file: File, maxW = 1600, quality = 0.8): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  const dataUrl: string = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img: HTMLImageElement = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const scale = Math.min(1, maxW / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
  if (!blob) return file;
  const base = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

export default function Cadastrar() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      const formEl = e.currentTarget;
      const fd = new FormData(formEl);
      const file = fd.get("banner");
      if (file && file instanceof File && file.size > 0) {
        const compressed = await compressImage(file);
        fd.set("banner", compressed);
      }
      const res = await fetch("/api/submissions", { method: "POST", body: fd });
      if (res.ok) {
        setStatus("ok");
        formEl.reset();
      } else {
        const data = await res.json().catch(() => null);
        setErrMsg(data?.error || "Verifique os campos e tente novamente.");
        setStatus("error");
      }
    } catch {
      setErrMsg("Não foi possível enviar. Verifique sua conexão e tente de novo.");
      setStatus("error");
    }
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
        {status === "error" && <p style={{ color: "#c0392b" }}>{errMsg || "Algo deu errado. Confira os campos e tente de novo."}</p>}
      </form>
    </main>
  );
}

const wrap: React.CSSProperties = { fontFamily: "system-ui,sans-serif", color: "#16203A", maxWidth: 720, margin: "0 auto", padding: 24 };
const inp: React.CSSProperties = { padding: "10px 12px", border: "1px solid #E5E9F0", borderRadius: 10, fontSize: 15 };
const btn: React.CSSProperties = { padding: "12px", border: 0, borderRadius: 10, background: "#0D3B8C", color: "#fff", fontWeight: 700, cursor: "pointer" };
