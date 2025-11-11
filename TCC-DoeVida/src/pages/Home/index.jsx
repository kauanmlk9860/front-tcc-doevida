"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import logoSemFundo from "../../assets/icons/logo_semfundo.png";
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

function formatDateBR(value) {
  if (!value) return "";
  const str = String(value).trim();
  // YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ
  const isoDate = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    const [, y, mo, d] = isoDate;
    return `${d}/${mo}/${y}`;
  }
  // DD/MM/YYYY already
  const brDate = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brDate) return str;
  // Timestamp number
  if (!isNaN(Number(str))) {
    const dt = new Date(Number(str));
    if (!isNaN(dt)) {
      const dd = String(dt.getDate()).padStart(2, "0");
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const yyyy = dt.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }
  }
  // Fallback try Date parsing
  const dt = new Date(str);
  if (isNaN(dt)) return "";
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function Home() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, loading } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Redirecionar hospitais para dashboard específico
  useEffect(() => {
    if (user && (user.role === 'HOSPITAL' || user.tipo === 'HOSPITAL')) {
      navigate('/hospital-dashboard', { replace: true });
    }
  }, [user, navigate]);

  const YT_ID = "97Sx0KiExZM";
  const EMBED_URL =
    `https://www.youtube.com/embed/${YT_ID}` +
    `?autoplay=1&mute=1&loop=1&playlist=${YT_ID}` +
    `&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`;

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
            <img src={logoSemFundo} alt="Logo DoeVida" className="logo-img" />
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
                style={{ cursor: "pointer" }}
              />
              <div className="user-details">
                <span className="user-name">Olá, {user?.nome || "Usuário"}!</span>
                {/* e-mail removido do cabeçalho */}
              </div>
            </div>
          ) : (
            <>
              <button
                className="btn-hospital"
                onClick={() => handleNavigation("/hospital-login")}
                type="button"
              >
                Sou Hospital
              </button>
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
              {isLoggedIn ? (
                <>
                  Olá,
                  <br /> {user?.nome || 'Usuário'}
                </>
              ) : (
                <>
                  Doe sangue,
                  <br /> salve até 4 vidas
                </>
              )}
            </h2>
            {isLoggedIn && (
              <p className="hero-subtitle">
                Doe sangue, salve até 4 vidas
              </p>
            )}
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

        {/* SEÇÃO DE NOTÍCIAS */}
        <section className="news-section" aria-labelledby="news-title">
          <div className="news-container">
            <div className="news-content">
              <div className="news-icon-wrapper">
                <svg className="news-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="news-text">
                <h3 id="news-title" className="news-title">Fique por dentro</h3>
                <p className="news-description">
                  Acompanhe as últimas notícias sobre doação de sangue, campanhas e histórias inspiradoras
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-news"
              onClick={() => handleNavigation("/noticias")}
            >
              <span className="btn-news-text">Ver Notícias</span>
              <svg className="btn-news-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
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
            <button type="button" className="footer-link btn-link" onClick={() => setShowPrivacyModal(true)}>
              Política de Privacidade
            </button>
            <button type="button" className="footer-link btn-link" onClick={() => setShowTermsModal(true)}>
              Termos de Uso
            </button>
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
            <h2 id="modal-title">Fale Conosco</h2>
            <p>Estamos aqui para ajudar. Entre em contato pelos canais abaixo:</p>
            <p>
              <strong>E-mail de Suporte:</strong> suporte@doevida.com.br
            </p>
            <p>
              <strong>Telefone/WhatsApp:</strong> (11) 4002-8922
            </p>
            <p>
              <strong>Horário de Atendimento:</strong> Seg a Sex, 09h às 18h (exceto feriados)
            </p>
            <p>
              <strong>Endereço:</strong> Av. Doe Vida, 123 - São Paulo/SP, 01234-567
            </p>
            <p>
              Para dúvidas gerais sobre doação, consulte também a seção "Saiba Mais".
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

      {showPrivacyModal && (
        <div className="legal-modal-overlay" onClick={() => setShowPrivacyModal(false)}>
          <div className="legal-modal-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="privacy-title">
            <div className="legal-modal-header">
              <div className="legal-header-icon" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" stroke="#fff" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="legal-header-content">
                <h2 id="privacy-title" className="legal-modal-title">Política de Privacidade</h2>
                <p className="legal-modal-subtitle">Como coletamos, usamos e protegemos seus dados. Última atualização: 2025</p>
              </div>
              <button type="button" className="btn-close-legal-modal" aria-label="Fechar" onClick={() => setShowPrivacyModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="legal-modal-content">
              <section className="legal-section">
                <h3 className="legal-section-title">Dados que Coletamos</h3>
                <p className="legal-text">Coletamos dados necessários para operar a plataforma e oferecer uma experiência segura e personalizada.</p>
                <ul className="legal-list">
                  <li><strong>Cadastro:</strong> nome, e-mail, senha e informações de perfil.</li>
                  <li><strong>Uso e navegação:</strong> páginas acessadas, dispositivo, data/horário e IP.</li>
                  <li><strong>Dados voluntários:</strong> informações fornecidas por você (ex.: histórico de doações).</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">Como Utilizamos</h3>
                <ul className="legal-list">
                  <li>Entregar, manter e melhorar os serviços.</li>
                  <li>Comunicar agendamentos, alterações e avisos importantes.</li>
                  <li>Garantir segurança, prevenção a fraudes e cumprimento de obrigações legais.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">Compartilhamento</h3>
                <ul className="legal-list">
                  <li>Com hospitais e parceiros, quando necessário e com base legal.</li>
                  <li>Com fornecedores de tecnologia essenciais para operar a plataforma.</li>
                  <li>Quando exigido por lei ou para proteger direitos.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">Seus Direitos</h3>
                <ul className="legal-list">
                  <li>Acessar, corrigir e excluir dados pessoais.</li>
                  <li>Revogar consentimentos e limitar tratamentos, quando aplicável.</li>
                  <li>Solicitar portabilidade e informações sobre o uso de dados.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">Segurança e Retenção</h3>
                <p className="legal-text">Aplicamos medidas técnicas e organizacionais para proteger seus dados. Mantemos as informações pelo período necessário às finalidades informadas e conforme exigências legais.</p>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">Contato de Privacidade (DPO)</h3>
                <div className="legal-contact-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#990410" strokeWidth="2"/>
                    <path d="M22 6l-10 7L2 6" stroke="#990410" strokeWidth="2"/>
                  </svg>
                  <div className="legal-contact-info">
                    <span className="legal-contact-label">E-mail do DPO</span>
                    <a href="mailto:privacidade@doevida.com.br" className="legal-contact-value">privacidade@doevida.com.br</a>
                  </div>
                </div>
              </section>
            </div>

            <div className="legal-modal-footer">
              <label className="legal-checkbox-container">
                <input 
                  type="checkbox" 
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="legal-checkbox"
                />
                <span className="legal-checkbox-label">Li e aceito a Política de Privacidade</span>
              </label>
              <div className="legal-modal-actions">
                <button type="button" className="btn-legal-action secondary" onClick={() => setShowPrivacyModal(false)}>Fechar</button>
                <button 
                  type="button" 
                  className="btn-legal-action primary" 
                  disabled={!privacyAccepted}
                  onClick={() => {
                    setShowPrivacyModal(false);
                    // Aqui você pode salvar a aceitação no backend se necessário
                  }}
                >
                  Aceitar e Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div className="legal-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="legal-modal-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="terms-title">
            <div className="legal-modal-header">
              <div className="legal-header-icon" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h16v16H4z" stroke="#fff" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="legal-header-content">
                <h2 id="terms-title" className="legal-modal-title">Termos de Uso</h2>
                <p className="legal-modal-subtitle">Condições para uso da plataforma DoeVida. Última atualização: 2025</p>
              </div>
              <button type="button" className="btn-close-legal-modal" aria-label="Fechar" onClick={() => setShowTermsModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="legal-modal-content">
              <section className="legal-section">
                <h3 className="legal-section-title">Acesso e Conta</h3>
                <ul className="legal-list">
                  <li>Guarde suas credenciais com segurança e não compartilhe senhas.</li>
                  <li>Forneça informações verdadeiras, completas e atualizadas.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">Uso da Plataforma</h3>
                <ul className="legal-list">
                  <li>Não utilize a plataforma para fins ilícitos ou que violem direitos de terceiros.</li>
                  <li>Poderemos suspender contas em caso de violação destes Termos.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">Conteúdo e Propriedade</h3>
                <ul className="legal-list">
                  <li>Marcas, nomes e conteúdos pertencem aos respectivos titulares.</li>
                  <li>Reprodução sem autorização é proibida.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">Limitação de Responsabilidade</h3>
                <p className="legal-text">Empregamos esforços para manter a disponibilidade e qualidade dos serviços, sem garantia de funcionamento ininterrupto.</p>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">Alterações</h3>
                <p className="legal-text">Os Termos podem ser atualizados periodicamente. O uso contínuo implica concordância com as versões atualizadas.</p>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">Contato</h3>
                <div className="legal-contact-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#990410" strokeWidth="2"/>
                    <path d="M22 6l-10 7L2 6" stroke="#990410" strokeWidth="2"/>
                  </svg>
                  <div className="legal-contact-info">
                    <span className="legal-contact-label">E-mail</span>
                    <a href="mailto:termos@doevida.com.br" className="legal-contact-value">termos@doevida.com.br</a>
                  </div>
                </div>
              </section>
            </div>

            <div className="legal-modal-footer">
              <label className="legal-checkbox-container">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="legal-checkbox"
                />
                <span className="legal-checkbox-label">Li e aceito os Termos de Uso</span>
              </label>
              <div className="legal-modal-actions">
                <button type="button" className="btn-legal-action secondary" onClick={() => setShowTermsModal(false)}>Fechar</button>
                <button 
                  type="button" 
                  className="btn-legal-action primary" 
                  disabled={!termsAccepted}
                  onClick={() => {
                    setShowTermsModal(false);
                    // Aqui você pode salvar a aceitação no backend se necessário
                  }}
                >
                  Aceitar e Continuar
                </button>
              </div>
            </div>
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
                      <path d="M9 11H7m4 0h2m4 0h2m-9 4h2m4 0h2M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="#990410" strokeWidth="2"/>
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
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#990410" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke="#990410" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="user-modal-info-content">
                    <span className="user-modal-info-label">Data de Nascimento</span>
                    <span className="user-modal-info-value">
                      {(() => {
                        try {
                          // Criar data a partir da string fornecida
                          const data = new Date(user.data_nascimento);
                          if (isNaN(data.getTime())) return 'Data inválida';
                          
                          // Adicionar um dia para compensar a diferença de fuso horário
                          data.setDate(data.getDate() + 1);
                          
                          // Formatar a data no formato brasileiro
                          return data.toLocaleDateString('pt-BR');
                        } catch (error) {
                          console.error('Erro ao formatar data de nascimento:', error);
                          try {
                            // Tentar extrair a data diretamente da string se o formato for conhecido
                            const match = user.data_nascimento.match(/(\d{4})-(\d{2})-(\d{2})/);
                            if (match) {
                              return `${match[3]}/${match[2]}/${match[1]}`; // Formato DD/MM/YYYY
                            }
                            return 'Data inválida';
                          } catch (e) {
                            return 'Data inválida';
                          }
                        }
                      })()}
                    </span>
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
