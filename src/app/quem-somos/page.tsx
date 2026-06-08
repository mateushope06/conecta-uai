export default function QuemSomos() {
  return (
    <div className="page">
      <h1>Quem somos</h1>
      <p className="about-quote">"Onde o ecossistema do Sul de Minas se encontra."</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="about-photo" src="/about.jpg" alt="Plateia em evento de inovação" />

      <p>
        <strong>Conecta UAI</strong> é a <strong>Unificada Agenda da Inovação</strong> do Sul de Minas —
        e o "UAI", além da sigla, é a nossa marca mineira. Uma iniciativa independente que reúne, em um só
        lugar, tudo o que está acontecendo no ecossistema regional de inovação.
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

      <p>
        Acreditamos na inovação construída a muitas mãos. Por isso, a plataforma conecta os diferentes atores
        das <strong>quatro hélices da inovação</strong> — governo, academia, iniciativa privada e sociedade civil —
        dando visibilidade aos eventos que aproximam universidades, startups, empresas, investidores, mentores,
        poder público e comunidade.
      </p>

      <p>
        O Conecta UAI nasce do trabalho voluntário e do compromisso com o desenvolvimento regional. Apoiamos e
        caminhamos lado a lado com iniciativas como o <strong>Sistema Regional de Inovação (SRI) do Sul de Minas</strong>,
        somando esforços para fortalecer as conexões da região. É um projeto independente que mantém parceria de
        apoio com as organizações do ecossistema.
      </p>

      <p style={{ color: "var(--muted)", marginTop: 28 }}>
        Iniciativa, direitos &amp; produção: <strong>DEEP Tree Inovação Ltda.</strong>
      </p>
    </div>
  );
}
