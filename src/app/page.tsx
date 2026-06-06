import { prisma } from "@/lib/prisma";
import Agenda, { type EventDTO } from "./_components/Agenda";

export const dynamic = "force-dynamic";

export default async function Eventos() {
  const rows = await prisma.event.findMany({
    where: { status: "APPROVED" },
    include: { city: true, category: true, organizer: true, banner: true },
    orderBy: { date: "asc" },
  });

  const events: EventDTO[] = rows.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date.toISOString(),
    startTime: e.startTime,
    modality: e.modality,
    featured: e.featured,
    registerUrl: e.registerUrl,
    city: e.city?.name ?? "",
    category: e.category?.name ?? "",
    organizer: e.organizer?.name ?? "",
    banner: e.banner?.url ?? null,
  }));

  const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean))).sort();
  const cities = uniq(events.map((e) => e.city));
  const categories = uniq(events.map((e) => e.category));
  const organizers = uniq(events.map((e) => e.organizer));

  return <Agenda events={events} cities={cities} categories={categories} organizers={organizers} />;
}
