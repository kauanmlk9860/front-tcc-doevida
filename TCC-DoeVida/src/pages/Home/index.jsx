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
  const [showModal, setShowModal] = useState(false); // ← controle do modal

  const YT_ID = "97Sx0KiExZM";
  const EMBED_URL =
    `https://www.youtube.com/embed/${YT_ID}` +
    `?autoplay=1&mute=1&loop=1&playlist=${YT_ID}` +
    `&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`;

  useEffect(() => {
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
    navigate("/");
  };

  const handleNavigation = (path) => {
    if (!isLoggedIn && !["/login", "/saiba-mais", "/home"].includes(path)) {
      navigate("/login");
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
            <img src={logoBranca} alt="Logo DoeVida" className="logo-img" />
          </div>
          <h1 className="logo-text">DOEVIDA</h1>
        </div>

        <nav className="nav-buttons" aria-label="Ações principais">
          {isLoggedIn ? (
            <div className="user-info">
              <img
                src={usuario?.fotoPerfil || "/placeholder-profile.png"}
                alt="Foto de perfil"
                className="user-avatar"
              />
              <span className="user-name">Olá, {usuario?.nome || "Usuário"}!</span>
              <button className="btn-donor" onClick={handleLogout} type="button">
                Sair
              </button>
            </div>
          ) : (
            <>
              <button
                className="btn-donor"
                onClick={() => handleNavigation("/login")}
                type="button"
              >
                Sou Hospital
              </button>
              <button
                className="btn-hospital"
                type="button"
                onClick={() => handleNavigation("/login")}
              >
                Sou Doador
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
            <div
              className="media-iframe-wrap"
              aria-label="Pessoas doando sangue em um hemocentro"
            >
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
            <div
              className="impact-card"
              role="status"
              aria-label="Vidas salvas este ano"
            >
              <div className="impact-text">
                <CountUp end={12340} duration={1800} prefix="+" className="impact-number" />
                <span className="impact-label">
                  vidas salvas
                  <br />
                  este ano
                </span>
              </div>
            </div>

            <div className="square-cards-grid">
              <article
                className="feature-card squareSpecificity"
                onClick={() => handleNavigation("/hospitais")}
              >
                <img src={icHospital} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">Hospitais</h4>
              </article>

              <article
                className="feature-card squareSpecificity"
                onClick={() => handleNavigation("/banco-sangue")}
              >
                <img src={icBancoSangue} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">
                  Banco de <br /> Sangue
                </h4>
              </article>

              <article
                className="feature-card squareSpecificity"
                onClick={() => handleNavigation("/historico")}
              >
                <img src={icHistorico} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">Histórico</h4>
              </article>

              <article
                className="feature-card squareSpecificity"
                onClick={() => handleNavigation("/registrar-doacao")}
              >
                <img src={icRegistrar} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">
                  Registrar <br /> Doação
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

      {/* FOOTER */}
      <footer className="footer" role="contentinfo">
        <div className="footer-content">
          <button
            type="button"
            className="footer-link highlight"
            onClick={() => handleNavigation("/saiba-mais")}
          >
            Saiba Mais
          </button>

          <div className="footer-link-group">
            <a href="#" className="footer-link">
              Política de Privacidade
            </a>
            <a href="#" className="footer-link">
              Termos de Uso
            </a>
            <button
              type="button"
              className="footer-link btn-link"
              onClick={() => setShowModal(true)}
            >
              Contato
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL DE CONTATO */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <h2 id="modal-title">Contatos dos Responsáveis</h2>
            <p>
              <strong>Gabriel Soares: <br /> </strong> gabriellssoares2016@gmail.com.br
            </p>
            <p>
              <strong>Daniel Torres: <br /> </strong> victor.hugo@doevida.com.br
            </p>
            <p>
              <strong>Kauan Rodrigues: <br /> </strong> kauan.rodrigues@doevida.com.br
            </p>
            <p>
              <strong>Rafaella Toscano: <br /> </strong> kauan.rodrigues@doevida.com.br
            </p>
            <p>
              <strong>Victor Hugo: <br /> </strong> victor.hugo@doevida.com.br
            </p>

            <button
              type="button"
              className="btn-close-modal"
              onClick={() => setShowModal(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
