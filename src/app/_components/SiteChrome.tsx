"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarPlus, CalendarDays, Info, Rocket, Menu, X, Lock, WhatsApp,
} from "./icons";

const NAV: [string, string, React.ComponentType<{ size?: number }>][] = [
  ["/cadastrar", "Cadastrar", CalendarPlus],
  ["/", "Eventos", CalendarDays],
  ["/quem-somos", "Quem somos", Info],
  ["/sri", "SRI", Rocket],
];

const WA_MSG =
  "Olá Mateus Hope, quero cadastrar um evento e estou com duvidas. Você pode me ajudar?";
const WA_LINK = `https://wa.me/5535988001006?text=${encodeURIComponent(WA_MSG)}`;

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const isOn = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="brand" onClick={() => setMenu(false)}>
            <span className="brand-mark">UAI</span>
            <span className="brand-txt">
              <b>Conecta UAI</b>
              <span>Única Agenda da Inovação</span>
            </span>
          </Link>

          <nav className="nav-desk">
            {NAV.map(([href, label, Icon]) => (
              <Link key={href} href={href} className={isOn(href) ? "on" : ""}>
                <Icon size={16} /> {label}
              </Link>
            ))}
          </nav>

          <button className="burger" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
            {menu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menu && (
          <nav className="container nav-mob">
            {NAV.map(([href, label, Icon]) => (
              <Link key={href} href={href} className={isOn(href) ? "on" : ""} onClick={() => setMenu(false)}>
                <Icon size={18} /> {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="foot-brand">
            <span className="brand-mark sm">UAI</span>
            <p>
              <strong>Conecta UAI</strong>
              <br />
              Única Agenda da Inovação do Sul de Minas
            </p>
          </div>

          <nav className="foot-links">
            {NAV.map(([href, label, Icon]) => (
              <Link key={href} href={href}>
                <Icon size={15} /> {label}
              </Link>
            ))}
            <a className="foot-wa" href={WA_LINK} target="_blank" rel="noreferrer">
              <WhatsApp size={15} /> Fale no WhatsApp
            </a>
          </nav>

          <Link className="admin-link" href="/admin">
            <Lock size={13} /> Área Administrativa
          </Link>
        </div>

        <div className="foot-bottom">
          <span>© 2026 Conecta UAI · Sistema Regional de Inovação do Sul de Minas</span>
          <span className="rights">
            Direitos &amp; produção: <strong>DEEP Tree Inovação Ltda.</strong>
          </span>
        </div>
        <p className="foot-credits">
          Fotos: Alexandre Pellaes, Jason Yuen e Stem List (Unsplash).
        </p>
      </footer>

      <a className="wa-float" href={WA_LINK} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">
        <WhatsApp size={24} />
        <span className="wa-label">Dúvidas? Chama no WhatsApp</span>
      </a>
    </>
  );
}
