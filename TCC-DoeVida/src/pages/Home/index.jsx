"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import logoBranca from "../../assets/Logo_Branca.png";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.js";

import icHospital from "../../assets/icons/hospital.png";
import icBancoSangue from "../../assets/icons/banco-sangue.png";
import icHistorico from "../../assets/icons/historico.png";
import icRegistrar from "../../assets/icons/registrar.png";

/** Formatador pt-BR */
function useNumberFormatter(locale = "pt-BR") {
  return useMemo(() => new Intl.NumberFormat(locale), [locale]);
}

/** CountUp simples */
function CountUp({ end = 12340, duration = 1800, prefix = "+", className }) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const fmt = useNumberFormatter();
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current) {
      setValue(end);
      return;
    }
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * end));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}
      {fmt.format(value)}
    </span>
  );
}

function Home() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // YouTube embed
  const YT_ID = "97Sx0KiExZM";
  const EMBED_URL =
    `https://www.youtube.com/embed/${YT_ID}` +
    `?autoplay=1&mute=1&loop=1&playlist=${YT_ID}` +
    `&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`;

  useEffect(() => {
    // Verifica se usuário está logado
    const loggedIn = AuthService.isLoggedIn();
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      const userData = AuthService.getUsuario();
      setUsuario(userData);
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setUsuario(null);
    navigate('/');
  };

  const handleNavigation = (path) => {
    if (!isLoggedIn && path !== '/login') {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="header" role="banner">
        <div className="logo-container">
          <div className="logo-icon">
            <img src={logoBranca || "/placeholder.svg"} alt="Logo DoeVida" className="logo-img" />
          </div>
          <h1 className="logo-text">DOEVIDA</h1>
        </div>

        <nav className="nav-buttons" aria-label="Ações principais">
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: 'white', fontSize: '14px' }}>
                Olá, {usuario?.nome || 'Usuário'}!
              </span>
              <button className="btn-donor" onClick={handleLogout} type="button">
                Sair
              </button>
            </div>
          ) : (
            <>
              <button className="btn-donor" onClick={() => navigate("/login")} type="button">
                Sou Doador
              </button>
              <button className="btn-hospital" type="button">
                Sou Hospital
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="main" id="conteudo" role="main">
        {/* HERO */}
        <section className="hero-grid" aria-labelledby="hero-title">
          <div className="hero-left">
            <h2 id="hero-title" className="hero-title">
              Doe sangue,
              <br /> salve até 4 vidas
            </h2>
            <button 
              type="button" 
              className="btn-cta" 
              onClick={() => handleNavigation("/agendamento")}
            >
              Agendar Doação
            </button>
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

        {/* LINHA DE CARDS */}
        <section className="actions-wrapper" aria-labelledby="actions-title">
          <h3 id="actions-title" className="sr-only">
            Atalhos e impacto
          </h3>

          <div className="actions-layout">
            {/* Card de impacto */}
            <div className="impact-card" role="status" aria-label="Vidas salvas este ano">
              <div className="impact-text">
                <CountUp end={12340} duration={1800} prefix="+" className="impact-number" />
                <span className="impact-label">
                  vidas salvas
                  <br />
                  este ano
                </span>
              </div>
            </div>

            {/* Grid dos 4 cards quadrados */}
            <div className="square-cards-grid">
              <article 
                className="feature-card squareSpecificity" 
                role="button" 
                tabIndex={0} 
                aria-label="Hospitais"
                onClick={() => handleNavigation('/hospitais')}
                style={{ cursor: 'pointer' }}
              >
                <img src={icHospital || "/placeholder.svg"} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">Hospitais</h4>
              </article>

              <article
                className="feature-card squareSpecificity"
                role="button"
                tabIndex={0}
                aria-label="Banco de Sangue"
                onClick={() => handleNavigation('/banco-sangue')}
                style={{ cursor: 'pointer' }}
              >
                <img src={icBancoSangue || "/placeholder.svg"} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">
                  Banco de
                  <br />
                  Sangue
                </h4>
              </article>

              <article
                className="feature-card squareSpecificity"
                role="button"
                tabIndex={0}
                aria-label="Histórico"
                onClick={() => handleNavigation('/historico')}
                style={{ cursor: 'pointer' }}
              >
                <img src={icHistorico || "/placeholder.svg"} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">Histórico</h4>
              </article>

              <article
                className="feature-card squareSpecificity"
                role="button"
                tabIndex={0}
                aria-label="Registrar Doação"
                onClick={() => handleNavigation('/registrar-doacao')}
                style={{ cursor: 'pointer' }}
              >
                <img src={icRegistrar || "/placeholder.svg"} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">
                  Registrar
                  <br />
                  Doação
                </h4>
              </article>
            </div>
          </div>

          <aside className="critical-alert" role="alert">
            <span className="alert-icon">⚠</span>
            <span>Estoque de sangue O- está em nível crítico!</span>
          </aside>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="footer-content">
          <a href="#" className="footer-link highlight">
            Saiba Mais
          </a>
          <div className="footer-link-group">
            <a href="#" className="footer-link">
              Política de Privacidade
            </a>
            <a href="#" className="footer-link">
              Termos de Uso
            </a>
            <a href="#" className="footer-link">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
