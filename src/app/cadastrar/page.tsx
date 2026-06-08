"use client";
import { useState, useRef } from "react";

// comprime imagem no navegador (evita estourar limite de upload)
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
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}

// mascara WhatsApp (XX) XXXXX-XXXX
function maskPhone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function Cadastrar() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [phone, setPhone] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  function onPickBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBannerFile(f);
    setBannerPreview(URL.createObjectURL(f));
  }

  function removeBanner() {
    setBannerFile(null);
    setBannerPreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrMsg("");

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // validações no cliente (mensagens claras)
    const req = (name: string, label: string) => {
      const v = (fd.get(name) as string || "").trim();
      return v ? null : `Preencha: ${label}.`;
    };
    const checks = [
      req("submitterName", "Seu nome"),
      phone.replace(/\D/g, "").length >= 10 ? null : "Informe um WhatsApp válido: (XX) XXXXX-XXXX.",
      req("title", "Título do evento"),
      req("date", "Data de início"),
      req("city", "Cidade"),
      req("organizer", "Organizador"),
    ];
    const email = (fd.get("submitterEmail") as string || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) checks.push("E-mail inválido (precisa ter @ e domínio).");
    const firstErr = checks.find(Boolean);
    if (firstErr) { setErrMsg(firstErr); setStatus("error"); return; }

    setStatus("sending");
    try {
      // troca banner pelo comprimido
      if (bannerFile) {
        const compressed = await compressImage(bannerFile);
        fd.set("banner", compressed);
      } else {
        fd.delete("banner");
      }
      const res = await fetch("/api/submissions", { method: "POST", body: fd });
      if (res.ok) {
        setStatus("ok");
        formEl.reset();
        removeBanner();
        setPhone("");
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
        <p>Seu evento entrou na fila de aprovação. A equipe da Conecta UAI vai avaliar e publicar.</p>
      </main>
    );
  }

  return (
    <main style={wrap}>
      <h1 style={{ color: "#0D3B8C" }}>Cadastrar evento</h1>
      <p style={{ color: "#5B667E" }}>Campos com * são obrigatórios. O evento é publicado após aprovação.</p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <input name="submitterName" placeholder="Seu nome *" style={inp} />
        <input name="submitterEmail" type="email" placeholder="Seu e-mail (opcional)" style={inp} />
        <input
          name="submitterPhone"
          placeholder="WhatsApp * — (XX) XXXXX-XXXX"
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
          inputMode="numeric"
          style={inp}
        />
        <hr style={{ border: 0, borderTop: "1px solid #E5E9F0" }} />
        <input name="title" placeholder="Título do evento *" style={inp} />
        <textarea name="description" placeholder="Descrição" rows={3} style={inp} />

        <label style={lbl}>Data e horário</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span style={{ flex: 1, minWidth: 140 }}>
            <small style={hint}>Início *</small>
            <input name="date" type="date" style={{ ...inp, width: "100%" }} />
          </span>
          <span style={{ flex: 1, minWidth: 140 }}>
            <small style={hint}>Término (se durar mais de 1 dia)</small>
            <input name="endDate" type="date" style={{ ...inp, width: "100%" }} />
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ flex: 1 }}>
            <small style={hint}>Hora início</small>
            <input name="startTime" type="time" style={{ ...inp, width: "100%" }} />
          </span>
          <span style={{ flex: 1 }}>
            <small style={hint}>Hora término</small>
            <input name="endTime" type="time" style={{ ...inp, width: "100%" }} />
          </span>
        </div>

        <input name="address" placeholder="Endereço / Local" style={inp} />
        <input name="city" placeholder="Cidade *" style={inp} />
        <input name="category" placeholder="Categoria" style={inp} />
        <input name="organizer" placeholder="Organizador *" style={inp} />
        <select name="modality" style={inp} defaultValue="PRESENCIAL">
          <option value="PRESENCIAL">Presencial</option>
          <option value="ONLINE">Online</option>
          <option value="HIBRIDO">Híbrido</option>
        </select>
        <input name="registerUrl" placeholder="Link de inscrição (ex: site.com/inscricao)" style={inp} />

        <label style={lbl}>Banner do evento (opcional)</label>
        <input ref={fileRef} name="banner" type="file" accept="image/*" onChange={onPickBanner} style={inp} />
        {bannerPreview && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bannerPreview} alt="prévia" style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E5E9F0" }} />
            <button type="button" onClick={removeBanner} style={btnGhost}>Remover imagem</button>
          </div>
        )}

        <button disabled={status === "sending"} style={btn}>
          {status === "sending" ? "Enviando..." : "Enviar para aprovação"}
        </button>
        {status === "error" && <p style={{ color: "#c0392b" }}>{errMsg}</p>}
      </form>
    </main>
  );
}

const wrap: React.CSSProperties = { fontFamily: "system-ui,sans-serif", color: "#16203A", maxWidth: 720, margin: "0 auto", padding: 24 };
const inp: React.CSSProperties = { padding: "10px 12px", border: "1px solid #E5E9F0", borderRadius: 10, fontSize: 15 };
const lbl: React.CSSProperties = { fontSize: 14, color: "#0D3B8C", fontWeight: 600, marginTop: 4 };
const hint: React.CSSProperties = { color: "#5B667E", fontSize: 12, display: "block", marginBottom: 4 };
const btn: React.CSSProperties = { padding: "12px", border: 0, borderRadius: 10, background: "#0D3B8C", color: "#fff", fontWeight: 700, cursor: "pointer" };
const btnGhost: React.CSSProperties = { padding: "8px 14px", border: "1px solid #c0392b", borderRadius: 8, background: "#fff", color: "#c0392b", fontWeight: 600, cursor: "pointer" };
