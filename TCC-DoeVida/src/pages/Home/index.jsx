"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import logoBranca from "../../assets/Logo_Branca.png";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../../components/jsx/LogoutModal";
import { useUser } from "../../contexts/UserContext";

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
  const { user, isLoggedIn, logout, loading } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const YT_ID = "97Sx0KiExZM";
  const EMBED_URL =
    `https://www.youtube.com/embed/${YT_ID}` +
    `?autoplay=1&mute=1&loop=1&playlist=${YT_ID}` +
    `&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`;

  // Remover useEffect pois o contexto já gerencia o estado

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleNavigation = (path) => {
    if (!isLoggedIn && !["/login", "/hospital-login", "/saiba-mais", "/home"].includes(path)) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  // Mostrar loading se ainda carregando
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

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
                src={user?.foto_perfil || "/placeholder-profile.png"}
                alt="Foto de perfil"
                className="user-avatar"
                onClick={() => setShowUserModal(true)}
                style={{ cursor: 'pointer' }}
              />
              <div className="user-details">
                <span className="user-name">Olá, {user?.nome || "Usuário"}!</span>
                <span className="user-email">{user?.email}</span>
              </div>
              <button className="btn-donor" onClick={handleLogoutClick} type="button">
                Sair
              </button>
            </div>
          ) : (
            <>
              {/* ✅ Corrigido: hospital → hospital-login */}
              <button
                className="btn-hospital"
                onClick={() => handleNavigation("/hospital-login")}
                type="button"
              >
                Sou Hospital
              </button>

              {/* ✅ Corrigido: doador → login */}
              <button
                className="btn-donor"
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

          <aside 
            className="critical-alert" 
            role="alert"
            onClick={() => handleNavigation("/banco-sangue")}
            style={{ cursor: 'pointer' }}
          >
            <span className="alert-icon">⚠</span>
            <span>Estoque de sangue O- está em nível crítico!</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
              <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
              <strong>Gabriel Soares: </strong> gabriellssoares2016@gmail.com.br
            </p>
            <p>
              <strong>Daniel Torres: </strong> victor.hugo@doevida.com.br
            </p>
            <p>
              <strong>Kauan Rodrigues: </strong> kauan.rodrigues@doevida.com.br
            </p>
            <p>
              <strong>Rafaella Toscano: </strong> rafaella.toscano@doevida.com.br
            </p>
            <p>
              <strong>Victor Hugo: </strong> victor.hugo@doevida.com.br
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

      {/* MODAL PREMIUM DE PERFIL DO USUÁRIO */}
      {showUserModal && (
        <div className="user-modal-overlay" onClick={() => setShowUserModal(false)}>
          <div
            className="user-modal-premium"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
          >
            {/* Header do Modal */}
            <div className="user-modal-header">
              <div className="user-modal-bg-pattern"></div>
              <button
                type="button"
                className="btn-close-user-modal"
                onClick={() => setShowUserModal(false)}
                aria-label="Fechar modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Avatar e Nome */}
            <div className="user-modal-avatar-section">
              <div className="user-modal-avatar-container">
                <img
                  src={user?.foto_perfil || "/placeholder-profile.png"}
                  alt="Foto de perfil"
                  className="user-modal-avatar"
                />
                <div className="user-modal-avatar-glow"></div>
              </div>
              <h2 id="user-modal-title" className="user-modal-name">
                {user?.nome || "Usuário"}
              </h2>
              <p className="user-modal-email">{user?.email}</p>
            </div>

            {/* Informações do Usuário */}
            <div className="user-modal-info-grid">
              {user?.tipo_sanguineo && (
                <div className="user-modal-info-card">
                  <div className="user-modal-info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#990410"/>
                    </svg>
                  </div>
                  <div className="user-modal-info-content">
                    <span className="user-modal-info-label">Tipo Sanguíneo</span>
                    <span className="user-modal-info-value">{user.tipo_sanguineo}</span>
                  </div>
                </div>
              )}

              {user?.cpf && (
                <div className="user-modal-info-card">
                  <div className="user-modal-info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#990410" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="#990410" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="user-modal-info-content">
                    <span className="user-modal-info-label">CPF</span>
                    <span className="user-modal-info-value">{user.cpf}</span>
                  </div>
                </div>
              )}

              {user?.telefone && (
                <div className="user-modal-info-card">
                  <div className="user-modal-info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#990410" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="user-modal-info-content">
                    <span className="user-modal-info-label">Telefone</span>
                    <span className="user-modal-info-value">{user.telefone}</span>
                  </div>
                </div>
              )}

              {user?.data_nascimento && (
                <div className="user-modal-info-card">
                  <div className="user-modal-info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#990410" strokeWidth="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="user-modal-info-content">
                    <span className="user-modal-info-label">Data de Nascimento</span>
                    <span className="user-modal-info-value">{new Date(user.data_nascimento).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="user-modal-actions">
              <button
                type="button"
                className="btn-user-modal-action primary"
                onClick={() => {
                  setShowUserModal(false)
                  handleNavigation('/perfil')
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Editar Perfil</span>
              </button>
              <button
                type="button"
                className="btn-user-modal-action secondary"
                onClick={() => {
                  setShowUserModal(false)
                  handleLogoutClick()
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE LOGOUT */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.nome}
      />
    </>
  );
}

export default Home;
