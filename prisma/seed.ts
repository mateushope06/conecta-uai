import { PrismaClient, Modality, EventStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Eventos do protótipo (jun–jul/2026) usados como semente inicial
const SEED_EVENTS = [
  { title: "Café com Inovação NEMPA", date: "2026-06-06", startTime: "09:00", city: "Pouso Alegre", category: "Networking", mod: "PRESENCIAL", org: "NEMPA", short: "Encontro informal entre fundadores, mentores e investidores." },
  { title: "Demo Day — Aceleração 2026", date: "2026-06-07", startTime: "14:00", city: "Itajubá", category: "Startup", mod: "PRESENCIAL", org: "UNIFEI", featured: true, short: "Startups apresentam tração e abrem rodada para investidores." },
  { title: "Workshop Indústria 4.0", date: "2026-06-10", startTime: "08:30", city: "Santa Rita do Sapucaí", category: "Indústria", mod: "HIBRIDO", org: "INATEL", short: "Automação, IoT e manufatura conectada no Vale da Eletrônica." },
  { title: "Startup Weekend Pouso Alegre", date: "2026-06-12", startTime: "18:00", city: "Pouso Alegre", category: "Empreendedorismo", mod: "PRESENCIAL", org: "NEMPA", featured: true, short: "54 horas para tirar uma ideia do papel ao pitch final." },
  { title: "Rodada de Investimentos Anjo", date: "2026-06-13", startTime: "10:00", city: "Varginha", category: "Investimentos", mod: "PRESENCIAL", org: "Sistema Regional de Inovação", short: "Conexão entre investidores-anjo e startups em estágio inicial." },
  { title: "Hackathon AgroTech", date: "2026-06-18", startTime: "08:00", city: "Lavras", category: "Agronegócio", mod: "PRESENCIAL", org: "UFLA", short: "Desafios reais do campo resolvidos em 24 horas de código." },
  { title: "Trilha de Dados & IA", date: "2026-06-19", startTime: "19:30", city: "Poços de Caldas", category: "IA", mod: "ONLINE", org: "Sebrae Minas", short: "Do dado bruto ao modelo: pipeline prático para iniciantes." },
  { title: "Conexão Universidades & Mercado", date: "2026-06-24", startTime: "15:00", city: "Itajubá", category: "Universidades", mod: "HIBRIDO", org: "UNIFEI", short: "Transferência de tecnologia entre academia e empresas." },
  { title: "Pitch Night Sul de Minas", date: "2026-06-26", startTime: "19:00", city: "Pouso Alegre", category: "Startup", mod: "PRESENCIAL", org: "NEMPA", featured: true, short: "Founders em 3 minutos no palco. Networking com mentores." },
  { title: "Fórum de Desenvolvimento Regional", date: "2026-07-01", startTime: "09:00", city: "Varginha", category: "Governo", mod: "PRESENCIAL", org: "Prefeitura de Pouso Alegre", short: "Políticas públicas para inovação e atração de investimentos." },
  { title: "Bootcamp Marketing Digital", date: "2026-07-03", startTime: "08:30", city: "Alfenas", category: "Marketing", mod: "ONLINE", org: "Sebrae Minas", short: "Aquisição, performance e branding para negócios locais." },
  { title: "Feira de Inovação Vale da Eletrônica", date: "2026-07-15", startTime: "10:00", city: "Santa Rita do Sapucaí", category: "Tecnologia", mod: "PRESENCIAL", org: "INATEL", featured: true, short: "Hardware, eletrônica embarcada e deeptech em exposição." },
];

async function main() {
  // 1) Admin Master — Mateus Hope
  const masterEmail = process.env.ADMIN_MASTER_EMAIL ?? "mateushope@hotmail.com";
  const masterPass = process.env.ADMIN_MASTER_PASSWORD ?? "trocar-no-primeiro-acesso";
  await prisma.user.upsert({
    where: { email: masterEmail },
    update: { role: Role.ADMIN_MASTER, active: true },
    create: {
      name: "Mateus Hope",
      email: masterEmail,
      passwordHash: await bcrypt.hash(masterPass, 12),
      role: Role.ADMIN_MASTER,
    },
  });

  // 2) Catálogos + eventos
  for (const e of SEED_EVENTS) {
    const city = await prisma.city.upsert({ where: { name: e.city }, update: {}, create: { name: e.city } });
    const category = await prisma.category.upsert({ where: { name: e.category }, update: {}, create: { name: e.category } });
    const organizer = await prisma.organizer.upsert({ where: { name: e.org }, update: {}, create: { name: e.org } });

    await prisma.event.create({
      data: {
        title: e.title,
        description: e.short,
        date: new Date(e.date + "T00:00:00-03:00"),
        startTime: e.startTime,
        modality: e.mod as Modality,
        featured: e.featured ?? false,
        status: EventStatus.APPROVED, // já entram publicados na agenda inicial
        cityId: city.id,
        categoryId: category.id,
        organizerId: organizer.id,
      },
    });
  }

  console.log("Seed concluído: Admin Master +", SEED_EVENTS.length, "eventos.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
