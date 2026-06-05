import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyNewSubmission } from "@/lib/email";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  date: z.string(), // "2026-06-20"
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  address: z.string().optional(),
  modality: z.enum(["PRESENCIAL", "ONLINE", "HIBRIDO"]).default("PRESENCIAL"),
  registerUrl: z.string().url().optional().or(z.literal("")),
  city: z.string().optional(),
  category: z.string().optional(),
  organizer: z.string().optional(),
  submitterName: z.string().optional(),
  submitterEmail: z.string().email().optional().or(z.literal("")),
  submitterPhone: z.string().optional(),
});

// POST /api/submissions  (multipart/form-data — campos + arquivo "banner")
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const raw = Object.fromEntries(form.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;

    // upload do banner (se enviado) para o Vercel Blob
    let bannerUrl: string | undefined;
    const file = form.get("banner");
    if (file && file instanceof File && file.size > 0) {
      const blob = await put(`banners/${Date.now()}-${file.name}`, file, { access: "public" });
      bannerUrl = blob.url;
    }

    const city = d.city ? await prisma.city.upsert({ where: { name: d.city }, update: {}, create: { name: d.city } }) : null;
    const category = d.category ? await prisma.category.upsert({ where: { name: d.category }, update: {}, create: { name: d.category } }) : null;
    const organizer = d.organizer ? await prisma.organizer.upsert({ where: { name: d.organizer }, update: {}, create: { name: d.organizer } }) : null;

    const event = await prisma.event.create({
      data: {
        title: d.title,
        description: d.description,
        date: new Date(d.date + "T00:00:00-03:00"),
        startTime: d.startTime,
        endTime: d.endTime,
        address: d.address,
        modality: d.modality,
        registerUrl: d.registerUrl || null,
        status: "PENDING", // entra na fila de aprovação
        cityId: city?.id,
        categoryId: category?.id,
        organizerId: organizer?.id,
        submitterName: d.submitterName,
        submitterEmail: d.submitterEmail || null,
        submitterPhone: d.submitterPhone,
        ...(bannerUrl ? { banner: { create: { url: bannerUrl } } } : {}),
      },
    });

    // avisa o Mateus (não bloqueia a resposta se o e-mail falhar)
    notifyNewSubmission({
      title: event.title,
      organizer: d.organizer,
      city: d.city,
      date: d.date,
      submitterName: d.submitterName,
      submitterEmail: d.submitterEmail || undefined,
    }).catch((e) => console.error("[notify] falhou:", e));

    return NextResponse.json({ ok: true, id: event.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao enviar cadastro." }, { status: 500 });
  }
}
