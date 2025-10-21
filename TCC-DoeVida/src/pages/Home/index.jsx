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

      {/* MODAL DE INFORMAÇÕES DO USUÁRIO */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
          >
            <h2 id="user-modal-title">Informações do Usuário</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <img
                src={user?.foto_perfil || "/placeholder-profile.png"}
                alt="Foto de perfil"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '20px',
                  border: '3px solid #e74c3c'
                }}
              />
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{user?.nome || "Usuário"}</h3>
                <p style={{ margin: '0', color: '#7f8c8d' }}>{user?.email}</p>
              </div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              {user?.cpf && (
                <p><strong>CPF:</strong> {user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</p>
              )}
              {user?.cep && (
                <p><strong>CEP:</strong> {user.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}</p>
              )}
              {user?.numero && (
                <p><strong>Telefone:</strong> {user.numero.length === 11 ? 
                  user.numero.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') :
                  user.numero.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
                }</p>
              )}
              {user?.data_nascimento && (
                <p><strong>Data de Nascimento:</strong> {new Date(user.data_nascimento).toLocaleDateString('pt-BR')}</p>
              )}
              {user?.tipo_sanguineo && (
                <p><strong>Tipo Sanguíneo:</strong> {user.tipo_sanguineo}</p>
              )}
              {user?.sexo && (
                <p><strong>Sexo:</strong> {user.sexo}</p>
              )}
            </div>

            <button
              type="button"
              className="btn-close-modal"
              onClick={() => setShowUserModal(false)}
            >
              Fechar
            </button>
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
