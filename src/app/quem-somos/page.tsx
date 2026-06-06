export default function QuemSomos() {
  return (
    <div className="page">
      <h1>Quem somos</h1>
      <p className="about-quote">"Onde o ecossistema do Sul de Minas se encontra."</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="about-photo" src="/about.jpg" alt="Plateia em evento de inovação" />

      <p>
        <strong>Conecta UAI</strong> é a <strong>Única Agenda da Inovação</strong> do Sul de Minas —
        e o "UAI", além da sigla, é a nossa marca mineira. Um ponto único onde o ecossistema da região
        (universidades, startups, mentores, investidores e poder público) encontra, em um só lugar,
        tudo o que está acontecendo.
      </p>

      <div className="uai-grid">
        <div className="uai-card">
          <h4>Para quem busca eventos</h4>
          <p>Uma agenda organizada por semana e por mês, com filtros por cidade, categoria, modalidade e organizador.</p>
        </div>
        <div className="uai-card">
          <h4>Para quem organiza</h4>
          <p>Cadastre seu evento gratuitamente. Após aprovação, ele aparece para todo o ecossistema regional.</p>
        </div>
        <div className="uai-card">
          <h4>Para o ecossistema</h4>
          <p>Mais conexões entre pessoas, ideias e oportunidades — fortalecendo a inovação no Sul de Minas.</p>
        </div>
      </div>

      <p style={{ color: "var(--muted)", marginTop: 28 }}>
        Direitos &amp; produção: <strong>DEEP Tree Inovação Ltda.</strong>
      </p>
    </div>
  );
}
