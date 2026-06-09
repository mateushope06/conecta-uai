import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const masterEmail = process.env.ADMIN_MASTER_EMAIL ?? "mateushope@hotmail.com";
  const masterPass = process.env.ADMIN_MASTER_PASSWORD ?? "trocar-no-primeiro-acesso";
  const masterHash = await bcrypt.hash(masterPass, 12);

  await prisma.user.upsert({
    where: { email: masterEmail },
    update: { role: Role.ADMIN_MASTER, active: true, passwordHash: masterHash },
    create: {
      name: "Mateus Hope",
      email: masterEmail,
      passwordHash: masterHash,
      role: Role.ADMIN_MASTER,
    },
  });

  console.log("Seed: Admin Master garantido. Nenhum evento de exemplo criado.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
