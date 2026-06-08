"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin, isMaster } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!isAdmin(role)) throw new Error("Não autorizado.");
  return { session, role };
}

async function requireMaster() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!isMaster(role)) throw new Error("Apenas o Administrador Master pode fazer isso.");
  return { session, id: (session?.user as { id?: string } | undefined)?.id };
}

export async function approveEvent(id: string) {
  const { session } = await requireAdmin();
  await prisma.event.update({
    where: { id },
    data: { status: "APPROVED", approvedAt: new Date(), approvedById: (session?.user as { id?: string })?.id },
  });
  await prisma.auditLog.create({ data: { action: "EVENT_APPROVED", detail: id, userId: (session?.user as { id?: string })?.id } });
  revalidatePath("/admin/painel");
  revalidatePath("/");
}

export async function rejectEvent(id: string) {
  const { session } = await requireAdmin();
  await prisma.event.update({ where: { id }, data: { status: "REJECTED" } });
  await prisma.auditLog.create({ data: { action: "EVENT_REJECTED", detail: id, userId: (session?.user as { id?: string })?.id } });
  revalidatePath("/admin/painel");
}

// ---- gestão de usuários autorizados (só MASTER) ----
export async function grantUser(formData: FormData) {
  const { id: masterId } = await requireMaster();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "ADMIN");
  if (!name || !email || password.length < 8) throw new Error("Preencha nome, e-mail e senha (mín. 8 caracteres).");

  await prisma.user.upsert({
    where: { email },
    update: { name, role: role as never, active: true, passwordHash: await bcrypt.hash(password, 12) },
    create: { name, email, role: role as never, passwordHash: await bcrypt.hash(password, 12) },
  });
  await prisma.auditLog.create({ data: { action: "USER_GRANTED", detail: email, userId: masterId } });
  revalidatePath("/admin/painel");
}

export async function revokeUser(id: string) {
  const { id: masterId } = await requireMaster();
  const target = await prisma.user.findUnique({ where: { id } });
  if (target?.role === "ADMIN_MASTER") throw new Error("Não é possível revogar o Administrador Master.");
  await prisma.user.update({ where: { id }, data: { active: false } });
  await prisma.auditLog.create({ data: { action: "USER_REVOKED", detail: target?.email, userId: masterId } });
  revalidatePath("/admin/painel");
}

export async function deleteEvent(id) {
  const { session } = await requireAdmin();
  await prisma.event.delete({ where: { id } });
  await prisma.auditLog.create({ data: { action: "EVENT_DELETED", detail: id, userId: (session?.user)?.id } });
  revalidatePath("/admin/painel");
  revalidatePath("/");
  revalidatePath("/realizados");
}
