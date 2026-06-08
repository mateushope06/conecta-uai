import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

// normaliza link: adiciona https:// se faltar
function normalizeUrl(v: string | undefined): string | null {
  if (!v) return null;
  const t = v.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const title = str(form.get("title"));
    const date = str(form.get("date"));

    // validações mínimas (só o essencial) com mensagem clara
    if (title.length < 3) {
      return NextResponse.json({ error: "Informe o título do evento (mínimo 3 letras)." }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Informe a data do evento." }, { status: 400 });
    }

    const modalityRaw = str(form.get("modality")) || "PRESENCIAL";
    const modality = ["PRESENCIAL", "ONLINE", "HIBRIDO"].includes(modalityRaw) ? modalityRaw : "PRESENCIAL";

    const endDateRaw = str(form.get("endDate"));
    const cityName = str(form.get("city"));
    const categoryName = str(form.get("category"));
    const organizerName = str(form.get("organizer"));

    // upload do banner (se enviado)
    let bannerUrl: string | undefined;
    const file = form.get("banner");
    if (file && file instanceof File && file.size > 0) {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await put(`banners/${Date.now()}-${safe}`, file, { access: "public" });
      bannerUrl = blob.url;
    }

    const city = cityName ? await prisma.city.upsert({ where: { name: cityName }, update: {}, create: { name: cityName } }) : null;
    const category = categoryName ? await prisma.category.upsert({ where: { name: categoryName }, update: {}, create: { name: categoryName } }) : null;
    const organizer = organizerName ? await prisma.organizer.upsert({ where: { name: organizerName }, update: {}, create: { name: organizerName } }) : null;

    const event = await prisma.event.create({
      data: {
        title,
        description: str(form.get("description")) || null,
        date: new Date(date + "T00:00:00-03:00"),
        endDate: endDateRaw ? new Date(endDateRaw + "T00:00:00-03:00") : null,
        startTime: str(form.get("startTime")) || null,
        endTime: str(form.get("endTime")) || null,
        address: str(form.get("address")) || null,
        modality: modality as "PRESENCIAL" | "ONLINE" | "HIBRIDO",
        registerUrl: normalizeUrl(str(form.get("registerUrl"))),
        status: "PENDING",
        cityId: city?.id,
        categoryId: category?.id,
        organizerId: organizer?.id,
        submitterName: str(form.get("submitterName")) || null,
        submitterEmail: str(form.get("submitterEmail")) || null,
        submitterPhone: str(form.get("submitterPhone")) || null,
        ...(bannerUrl ? { banner: { create: { url: bannerUrl } } } : {}),
      },
    });

    return NextResponse.json({ ok: true, id: event.id }, { status: 201 });
  } catch (err) {
    console.error("[submissions] erro:", err);
    return NextResponse.json({ error: "Erro ao enviar o cadastro. Tente novamente em instantes." }, { status: 500 });
  }
}
