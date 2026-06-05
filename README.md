# Conecta UAI — Plataforma

Agenda de eventos do ecossistema de inovação do Sul de Minas.
**Stack:** Next.js 15 (App Router) · Prisma · PostgreSQL · Auth.js · Resend · Vercel Blob.

Diferente do protótipo (que rodava tudo na memória da sessão), aqui **cadastros, aprovações, login e banners persistem de verdade** no banco.

---

## O que já está pronto

- **Banco** com as tabelas: `users`, `events`, `categories`, `cities`, `organizers`, `banners`, `settings`, `audit_logs`.
- **Login real** (Auth.js + senha com hash) restrito a usuários autorizados. Mateus Hope entra como **Administrador Master** (único que concede/revoga acesso).
- **Cadastro público** (`/cadastrar`) com upload de banner e link de inscrição → entra na **fila de aprovação**.
- **Painel** (`/admin/painel`): aba de **Aprovações** (autorizar/recusar) e **Usuários** (só o Master).
- **E-mail automático** pro Mateus a cada novo cadastro (via Resend).
- **Agenda pública** (`/`) lendo só os eventos aprovados.

> As páginas públicas estão **funcionais, com visual simples de propósito**. O visual aprovado do protótipo (`conecta-uai.jsx`) entra por cima — cada página tem um comentário marcando onde plugar. Me reenvie o `.jsx` que eu faço esse encaixe.

---

## Passo a passo pra subir no seu domínio

### 1. Banco (Neon — grátis, sem cartão)
1. Crie conta em **neon.tech** → novo projeto (escolha região São Paulo / `sa-east-1`).
2. Copie a *connection string* e cole em `DATABASE_URL` e `DIRECT_URL` no seu `.env`.
   - Free tier: 0,5 GB de storage e 100 CU-hours/mês — sobra pra uma agenda regional.

### 2. E-mail (Resend — grátis)
1. Crie conta em **resend.com** → API Key → `RESEND_API_KEY`.
2. Verifique o domínio `conectauai.com.br` (DNS) pra mandar como `eventos@conectauai.com.br`.
   - Free tier: 3.000 e-mails/mês (100/dia), 1 domínio — mais que suficiente pras notificações.

### 3. Variáveis de ambiente
Copie `.env.example` para `.env` e preencha tudo. Gere o `AUTH_SECRET` com:
```bash
openssl rand -base64 32
```

### 4. Banco + primeiro acesso (local)
```bash
npm install
npx prisma migrate dev --name init   # cria as tabelas
npm run db:seed                       # cria o Mateus (Master) + eventos iniciais
npm run dev                           # http://localhost:3000
```
Login do admin: o e-mail e a senha que você definiu em `ADMIN_MASTER_EMAIL` / `ADMIN_MASTER_PASSWORD`.

### 5. Deploy + domínio (Vercel)
1. Suba o projeto pro GitHub e importe na **Vercel**.
2. Em **Storage**, adicione **Blob** (gera o `BLOB_READ_WRITE_TOKEN`) pros banners.
3. Cole todas as variáveis do `.env` em *Settings → Environment Variables*
   (use a `AUTH_URL` = seu domínio, ex. `https://conectauai.com.br`).
4. Em **Domains**, adicione `conectauai.com.br` e aponte o DNS conforme a Vercel indicar.
5. No primeiro deploy, rode a migration de produção:
   ```bash
   npx prisma migrate deploy
   npm run db:seed   # uma única vez, pra criar o Master em produção
   ```

---

## ⚠️ Atenção ao custo de hospedagem (importante)

O plano **Hobby (grátis) da Vercel é só para uso não-comercial**. Como a Conecta UAI
é um produto/serviço (DEEP Tree Inovação Ltda.), o uso legítimo na Vercel exige o
plano **Pro (~US$ 20/mês por usuário)**.

Alternativas pra fugir desse custo, se quiser:
- **Railway**, **Render** ou um **VPS** (Hostinger/Contabo) — permitem uso comercial em planos baratos e rodam Next.js + Postgres.
- Nesses casos, troca-se o **Vercel Blob** por outro storage (ex. **Supabase Storage** ou um bucket S3) — é só ajustar `src/app/api/submissions/route.ts`.

Banco (Neon) e e-mail (Resend) seguem grátis nos free tiers acima independente do host.

---

## Custo estimado pra começar
| Item | Serviço | Custo inicial |
|---|---|---|
| Banco Postgres | Neon | R$ 0 (free tier) |
| E-mail | Resend | R$ 0 (free tier) |
| Hospedagem | Vercel Pro *ou* Railway/Render/VPS | ~US$ 20/mês *ou* ~R$ 25–60/mês |
| Storage de banners | Vercel Blob / Supabase | centavos/mês no início |
| Domínio | (já comprado por você) | — |

---

## Próximos ajustes sugeridos
- Encaixar o visual aprovado do `conecta-uai.jsx` nas páginas públicas.
- Balão flutuante do WhatsApp do Mateus (já existia no protótipo) no layout.
- Página de créditos das fotos do Unsplash (Alexandre Pellaes, Jason Yuen, Stem List).
