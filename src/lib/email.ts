import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export async function notifyNewSubmission(input: {
  title: string;
  organizer?: string;
  city?: string;
  date?: string;
  submitterName?: string;
  submitterEmail?: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY ausente — pulando notificação.");
    return;
  }
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.FROM_EMAIL ?? "Conecta UAI <onboarding@resend.dev>";
  if (!to) return;

  await resend.emails.send({
    from,
    to,
    subject: `Novo evento aguardando aprovação: ${input.title}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.5">
        <h2 style="color:#0D3B8C;margin:0 0 8px">Novo cadastro na Conecta UAI</h2>
        <p>Um evento foi enviado e está esperando sua autorização no painel.</p>
        <table style="border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;color:#5B667E">Evento</td><td><b>${esc(input.title)}</b></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#5B667E">Organizador</td><td>${esc(input.organizer ?? "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#5B667E">Cidade</td><td>${esc(input.city ?? "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#5B667E">Data</td><td>${esc(input.date ?? "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#5B667E">Quem enviou</td><td>${esc(input.submitterName ?? "—")} (${esc(input.submitterEmail ?? "—")})</td></tr>
        </table>
        <p style="margin-top:16px">
          <a href="${process.env.AUTH_URL ?? ""}/admin"
             style="background:#0D3B8C;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">
             Abrir Aprovações
          </a>
        </p>
      </div>`,
  });
}

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
}
