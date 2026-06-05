import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events  -> eventos aprovados (agenda pública)
// filtros opcionais: ?city=&category=&mod=&org=&q=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  const events = await prisma.event.findMany({
    where: {
      status: "APPROVED",
      ...(searchParams.get("city") ? { city: { name: searchParams.get("city")! } } : {}),
      ...(searchParams.get("category") ? { category: { name: searchParams.get("category")! } } : {}),
      ...(searchParams.get("mod") ? { modality: searchParams.get("mod") as never } : {}),
      ...(searchParams.get("org") ? { organizer: { name: searchParams.get("org")! } } : {}),
      ...(q
        ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }
        : {}),
    },
    include: { city: true, category: true, organizer: true, banner: true },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ events });
}
