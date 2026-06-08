"use client";

import { useMemo, useRef, useState } from "react";
import {
  Search, Calendar, MapPin, Building2, Sparkles, Rocket, ArrowRight,
  ChevronLeft, ChevronRight,
} from "./icons";

/* ===== Tipo do evento que vem do banco ===== */
export type EventDTO = {
  id: string;
  title: string;
  description: string | null;
  date: string;          // ISO
  startTime: string | null;
  modality: "PRESENCIAL" | "ONLINE" | "HIBRIDO";
  featured: boolean;
  registerUrl: string | null;
  city: string;
  category: string;
  organizer: string;
  banner: string | null; // url
};

/* ===== Tabelas de apoio (mesma identidade do protótipo) ===== */
const CATEGORIES: Record<string, [string, string]> = {
  Startup: ["#0D3B8C", "#2563EB"], Inovação: ["#0E7C66", "#16A57F"],
  Tecnologia: ["#0F4C8C", "#0EA5B5"], IA: ["#3B2C8C", "#6D4AED"],
  Empreendedorismo: ["#0D3B8C", "#16A57F"], Investimentos: ["#0B3B5C", "#0E9F6E"],
  Universidades: ["#1E3A8C", "#3B82F6"], Indústria: ["#1F2A44", "#4B5C82"],
  Agronegócio: ["#1E5C2E", "#3FA34D"], Marketing: ["#7A2C5C", "#C0468C"],
  Educação: ["#0F5C7C", "#22A6C4"], Networking: ["#0D3B8C", "#1B9E8C"],
  Governo: ["#33415C", "#5A6E94"], Pesquisa: ["#2C3B7C", "#4F62C4"],
  Outros: ["#475569", "#94A3B8"],
};
const MOD_LABEL: Record<string, string> = { PRESENCIAL: "Presencial", ONLINE: "Online", HIBRIDO: "Híbrido" };
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const parse = (d: string) => { const x = new Date(d); return new Date(x.getFullYear(), x.getMonth(), x.getDate()); };
const startOfWeek = (date: Date) => { const d = new Date(date); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); d.setHours(0,0,0,0); return d; };
const addDays = (date: Date, n: number) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };
const dm = (d: Date) => `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;
const fmtFull = (iso: string) => { const x = parse(iso); return `${x.getDate()} de ${MESES[x.getMonth()]} de ${x.getFullYear()}`; };

function CatTag({ category }: { category: string }) {
  const [c1] = CATEGORIES[category] || CATEGORIES.Outros;
  return <span className="cat-tag" style={{ color: c1, background: `${c1}14`, border: `1px solid ${c1}26` }}>{category}</span>;
}

function EventCard({ ev, big }: { ev: EventDTO; big?: boolean }) {
  const [c1, c2] = CATEGORIES[ev.category] || CATEGORIES.Outros;
  const open = () => ev.registerUrl && window.open(ev.registerUrl, "_blank", "noopener");
  return (
    <article className="ev-card">
      <div className="ev-banner" style={{ height: big ? 190 : 158, cursor: ev.registerUrl ? "pointer" : "default" }} onClick={open}>
        {ev.banner
          ? <img className="ev-banner-img" src={ev.banner} alt="" />
          : <div className="ev-banner-grad" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }} />}
        <div className="ev-banner-mesh" />
        {ev.featured && <span className="ev-flag"><Sparkles size={11} /> Destaque</span>}
        <span className="ev-mod">{MOD_LABEL[ev.modality]}</span>
        {!ev.banner && <Rocket className="ev-ghost" size={big ? 70 : 56} />}
      </div>
      <div className="ev-body">
        <CatTag category={ev.category} />
        <h3 className="ev-title" onClick={open}>{ev.title}</h3>
        {big && ev.description && <p className="ev-short">{ev.description}</p>}
        <div className="ev-meta">
          <span><Calendar size={14} /> {fmtFull(ev.date)}{ev.startTime ? ` · ${ev.startTime}` : ""}</span>
          <span><MapPin size={14} /> {ev.city} — MG</span>
          <span><Building2 size={14} /> {ev.organizer}</span>
        </div>
        {ev.registerUrl && (
          <a className="ev-cta" href={ev.registerUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            Inscreva-se <ArrowRight size={15} />
          </a>
        )}
      </div>
    </article>
  );
}

function Carousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return (
    <div className="carousel">
      <button className="car-btn prev" aria-label="Anterior" onClick={() => scroll(-1)}><ChevronLeft size={20} /></button>
      <div className="carousel-track" ref={ref}>{children}</div>
      <button className="car-btn next" aria-label="Próximo" onClick={() => scroll(1)}><ChevronRight size={20} /></button>
    </div>
  );
}

const Empty = ({ children }: { children: React.ReactNode }) => (
  <div className="empty-hint">Nenhum evento {children} no momento. Ajuste os filtros.</div>
);

export default function Agenda({ events, cities, categories, organizers }: {
  events: EventDTO[]; cities: string[]; categories: string[]; organizers: string[];
}) {
  const [f, setF] = useState({ search: "", city: "", category: "", mod: "", org: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const active = Object.values(f).some(Boolean);

  const filtered = useMemo(() => {
    const q = f.search.trim().toLowerCase();
    return events.filter((e) =>
      (!f.city || e.city === f.city) && (!f.category || e.category === f.category) &&
      (!f.mod || e.modality === f.mod) && (!f.org || e.organizer === f.org) &&
      (!q || `${e.title} ${e.description ?? ""} ${e.organizer} ${e.category} ${e.city}`.toLowerCase().includes(q))
    ).sort((a, b) => +parse(a.date) - +parse(b.date));
  }, [f, events]);

  const today = new Date();
  const week0 = startOfWeek(today);
  const thisWeek = filtered.filter((e) => { const d = parse(e.date); return d >= week0 && d <= addDays(week0, 6); });
  const nextWeeks = [1, 2, 3, 4].map((w) => {
    const s = addDays(week0, w * 7);
    return { label: `Semana de ${dm(s)}`, events: filtered.filter((e) => { const d = parse(e.date); return d >= s && d <= addDays(s, 6); }) };
  }).filter((w) => w.events.length);

  const monthsToShow = [0,1,2,3,4,5,6,7,8,9,10,11]
    .filter((m) => filtered.some((e) => parse(e.date) > addDays(week0, 34) && parse(e.date).getMonth() === m));
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const monthBase = filtered.filter((e) => parse(e.date) > addDays(week0, 34));
  const monthEvents = activeMonth === null ? monthBase : monthBase.filter((e) => parse(e.date).getMonth() === activeMonth);

  return (
    <>
      <section className="hero">
        <div className="hero-photo" style={{ backgroundImage: "url(/hero.jpg)" }} />
        <div className="hero-overlay" />
        <div className="hero-mesh" />
        <div className="hero-inner">
          
          <h1>Conectando pessoas, ideias e oportunidades através da inovação.</h1>
          <p>Acompanhe os principais eventos do ecossistema de inovação do Sul de Minas.</p>
          <div className="hero-cta">
            <a className="btn-primary lg" href="#agenda">Ver Agenda <ArrowRight size={18} /></a>
            <div className="hero-stats">
              <div><strong>{events.length}</strong><span>eventos</span></div>
              <div><strong>{cities.length}</strong><span>cidades</span></div>
              <div><strong>{categories.length}</strong><span>categorias</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="filterbar" id="agenda">
          <div className="search-wrap">
            <Search size={18} />
            <input placeholder="Buscar eventos, temas, organizadores…" value={f.search} onChange={set("search")} />
          </div>
          <div className="filter-row">
            <select value={f.city} onChange={set("city")}><option value="">Cidade</option>{cities.map((c) => <option key={c}>{c}</option>)}</select>
            <select value={f.category} onChange={set("category")}><option value="">Categoria</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
            <select value={f.mod} onChange={set("mod")}><option value="">Modalidade</option><option value="PRESENCIAL">Presencial</option><option value="ONLINE">Online</option><option value="HIBRIDO">Híbrido</option></select>
            <select value={f.org} onChange={set("org")}><option value="">Organizador</option>{organizers.map((o) => <option key={o}>{o}</option>)}</select>
            {active && <button className="btn-ghost sm" onClick={() => setF({ search:"", city:"", category:"", mod:"", org:"" })}>Limpar</button>}
          </div>
        </div>

        {/* SEMANA */}
        <section className="block">
          <div className="block-head">
            <h2>Eventos da Semana</h2>
            <p>O que está rolando entre {dm(week0)} e {dm(addDays(week0, 6))}.</p>
          </div>
          {thisWeek.length
            ? <Carousel>{thisWeek.map((e) => <div key={e.id} className="slot big"><EventCard ev={e} big /></div>)}</Carousel>
            : <Empty>nesta semana</Empty>}
        </section>

        {/* PRÓXIMAS SEMANAS */}
        <section className="block alt">
          <div className="block-head">
            <h2>Próximas Semanas</h2>
            <p>Planeje-se para o que vem aí, semana a semana.</p>
          </div>
          {nextWeeks.length
            ? nextWeeks.map((w) => (
              <div className="week-group" key={w.label}>
                <h4 className="week-label">{w.label}</h4>
                <Carousel>{w.events.map((e) => <div key={e.id} className="slot small"><EventCard ev={e} /></div>)}</Carousel>
              </div>
            ))
            : <Empty>nas próximas semanas</Empty>}
        </section>

        {/* PRÓXIMOS MESES */}
        <section className="block">
          <div className="block-head">
            <h2>Próximos Meses</h2>
            <p>Visão geral do calendário mais à frente.</p>
          </div>
          <div className="month-chips">
            <button className={`chip ${activeMonth === null ? "on" : ""}`} onClick={() => setActiveMonth(null)}>Todos</button>
            {monthsToShow.map((m) => (
              <button key={m} className={`chip ${activeMonth === m ? "on" : ""}`} onClick={() => setActiveMonth(m)}>{MESES[m]}</button>
            ))}
          </div>
          {monthEvents.length
            ? <Carousel>{monthEvents.map((e) => <div key={e.id} className="slot small"><EventCard ev={e} /></div>)}</Carousel>
            : <Empty>nesse período</Empty>}
        </section>

        {/* FAIXA CTA */}
        <section className="cta-band">
          <div className="cta-band-photo" style={{ backgroundImage: "url(/band.jpg)" }} />
          <div className="cta-band-overlay" />
          <div className="cta-band-inner">
            <div>
              <h3>Tem um evento de inovação na região?</h3>
              <p>Cadastre gratuitamente e alcance todo o ecossistema do Sul de Minas.</p>
            </div>
            <a className="btn-primary lg" href="/cadastrar">Cadastrar evento <ArrowRight size={18} /></a>
          </div>
        </section>
      </div>
    </>
  );
}
