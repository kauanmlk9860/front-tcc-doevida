import { useEffect, useMemo, useRef, useState } from 'react';
import './style.css';
import logoBranca from '../../assets/Logo_Branca.png';
import { useNavigate } from 'react-router-dom'

/* ÍCONES (ajuste os nomes se forem diferentes) */
import icHospital     from '../../assets/icons/hospital.png';
import icBancoSangue  from '../../assets/icons/banco-sangue.png';
import icHistorico    from '../../assets/icons/historico.png';
import icRegistrar    from '../../assets/icons/registrar.png';

/** Formatador pt-BR */
function useNumberFormatter(locale = 'pt-BR') {
  return useMemo(() => new Intl.NumberFormat(locale), [locale]);
}

/** CountUp simples */
function CountUp({ end = 12340, duration = 1800, prefix = '+', className }) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const fmt = useNumberFormatter();
  const reduced = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reduced.current) { setValue(end); return; }
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * end));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [end, duration]);

  return <span className={className}>{prefix}{fmt.format(value)}</span>;
}

function Home() {
  const navigate = useNavigate();
  // YouTube embed
  const YT_ID = '97Sx0KiExZM';
  const EMBED_URL =
    `https://www.youtube.com/embed/${YT_ID}` +
    `?autoplay=1&mute=1&loop=1&playlist=${YT_ID}` +
    `&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`;

  return (
    <>
      {/* HEADER antigo (com botões, sem navegação) */}
      <header className="header" role="banner">
        <div className="logo-container">
          <div className="logo-icon">
            <img src={logoBranca} alt="Logo DoeVida" className="logo-img" />
          </div>
          <h1 className="logo-text">DOEVIDA</h1>
        </div>

        <nav className="nav-buttons" aria-label="Ações principais">
          <button className="btn-donor" onClick={() => navigate('/Login')} type="button">Sou Doador</button>
          <button className="btn-hospital" type="button">Sou Hospital</button>
        </nav>
      </header>

      <main className="main" id="conteudo" role="main">
        {/* HERO */}
        <section className="hero-grid" aria-labelledby="hero-title">
          <div className="hero-left">
            <h2 id="hero-title" className="hero-title">
              Doe sangue,<br /> salve até 4 vidas
            </h2>
            <button type="button" className="btn-cta">Agendar Doação</button>
          </div>

          <div className="hero-media">
            <div className="media-iframe-wrap" aria-label="Pessoas doando sangue em um hemocentro">
              <iframe
                className="media-iframe"
                src={EMBED_URL}
                title="Blood donation"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* LINHA DE CARDS (quadrados) + card de impacto na MESMA linha */}
        <section className="actions" aria-labelledby="actions-title">
          <h3 id="actions-title" className="sr-only">Atalhos e impacto</h3>

          <div className="actions-grid">
            {/* Impacto */}
            <div className="impact-card impact-in-grid" role="status" aria-label="Vidas salvas este ano">
              <div className="impact-text">
                <CountUp end={12340} duration={1800} prefix="+" className="impact-number" />
                <span className="impact-label">vidas salvas<br/>este ano</span>
              </div>
            </div>

            {/* 4 cards quadrados */}
            <article className="feature-card square" role="button" tabIndex={0} aria-label="Hospitais">
              <img src={icHospital} alt="" className="feature-emoji big" />
              <h4 className="feature-title-only bigger">Hospitais</h4>
            </article>

            <article className="feature-card square" role="button" tabIndex={0} aria-label="Banco de Sangue">
              <img src={icBancoSangue} alt="" className="feature-emoji big" />
              <h4 className="feature-title-only bigger">Banco de<br/>Sangue</h4>
            </article>

            <article className="feature-card square" role="button" tabIndex={0} aria-label="Histórico">
              <img src={icHistorico} alt="" className="feature-emoji big" />
              <h4 className="feature-title-only bigger">Histórico</h4>
            </article>

            <article className="feature-card square" role="button" tabIndex={0} aria-label="Registrar Doação">
              <img src={icRegistrar} alt="" className="feature-emoji big" />
              <h4 className="feature-title-only bigger">Registrar<br/>Doação</h4>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
