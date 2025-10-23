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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

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
                style={{ cursor: "pointer" }}
              />
              <div className="user-details">
                <span className="user-name">Olá, {user?.nome || "Usuário"}!</span>
                {/* e-mail removido do cabeçalho */}
              </div>
              <button className="btn-donor" onClick={handleLogoutClick} type="button">
                Sair
              </button>
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
            <button
              type="button"
              className="footer-link btn-link"
              onClick={() => setShowPrivacyModal(true)}
            >
              Política de Privacidade
            </button>
            <button
              type="button"
              className="footer-link btn-link"
              onClick={() => setShowTermsModal(true)}
            >
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

      {/* MODAL DE TERMOS DE USO */}
      {showTermsModal && (
        <div className="legal-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div
            className="legal-modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
          >
            {/* Header do Modal */}
            <div className="legal-modal-header">
              <div className="legal-header-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="legal-header-content">
                <h2 id="terms-modal-title" className="legal-modal-title">Termos de Uso</h2>
                <p className="legal-modal-subtitle">Última atualização: 23 de outubro de 2025</p>
              </div>
              <button
                type="button"
                className="btn-close-legal-modal"
                onClick={() => setShowTermsModal(false)}
                aria-label="Fechar modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="legal-modal-content">
              <section className="legal-section">
                <h3 className="legal-section-title">1. Aceitação dos Termos</h3>
                <p className="legal-text">
                  Ao acessar e usar a plataforma DoeVida, você concorda em cumprir e estar vinculado aos seguintes 
                  termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá 
                  utilizar nossos serviços.
                </p>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">2. Descrição do Serviço</h3>
                <p className="legal-text">
                  O DoeVida é uma plataforma digital que conecta doadores de sangue a hospitais e hemocentros, 
                  facilitando o agendamento de doações e fornecendo informações sobre a disponibilidade de 
                  estoques sanguíneos.
                </p>
                <ul className="legal-list">
                  <li>Localização de hospitais e hemocentros próximos</li>
                  <li>Agendamento online de doações de sangue</li>
                  <li>Consulta de estoque de sangue em tempo real</li>
                  <li>Histórico de doações pessoal</li>
                  <li>Notificações sobre necessidades urgentes</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">3. Cadastro e Conta de Usuário</h3>
                <p className="legal-text">
                  Para utilizar determinadas funcionalidades, você deve criar uma conta fornecendo informações 
                  precisas e completas. Você é responsável por:
                </p>
                <ul className="legal-list">
                  <li>Manter a confidencialidade de sua senha</li>
                  <li>Todas as atividades que ocorrem em sua conta</li>
                  <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                  <li>Garantir que suas informações estejam sempre atualizadas</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">4. Requisitos para Doação</h3>
                <p className="legal-text">
                  O usuário declara estar ciente dos requisitos básicos para doação de sangue:
                </p>
                <ul className="legal-list">
                  <li>Ter entre 16 e 69 anos (menores de 18 anos com autorização)</li>
                  <li>Pesar no mínimo 50kg</li>
                  <li>Estar em boas condições de saúde</li>
                  <li>Apresentar documento oficial com foto</li>
                  <li>Respeitar o intervalo mínimo entre doações (60 dias para homens, 90 dias para mulheres)</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">5. Uso Adequado da Plataforma</h3>
                <p className="legal-text">
                  Você concorda em NÃO:
                </p>
                <ul className="legal-list">
                  <li>Fornecer informações falsas ou enganosas</li>
                  <li>Usar a plataforma para fins ilegais ou não autorizados</li>
                  <li>Interferir ou interromper o funcionamento da plataforma</li>
                  <li>Tentar acessar áreas restritas do sistema</li>
                  <li>Compartilhar suas credenciais de acesso com terceiros</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">6. Propriedade Intelectual</h3>
                <p className="legal-text">
                  Todo o conteúdo da plataforma DoeVida, incluindo textos, gráficos, logos, ícones, imagens e 
                  software, é propriedade exclusiva do DoeVida e está protegido por leis de direitos autorais.
                </p>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">7. Limitação de Responsabilidade</h3>
                <p className="legal-text">
                  O DoeVida não se responsabiliza por:
                </p>
                <ul className="legal-list">
                  <li>Decisões médicas tomadas com base nas informações da plataforma</li>
                  <li>Disponibilidade ou qualidade dos serviços prestados pelos hospitais</li>
                  <li>Interrupções temporárias no serviço</li>
                  <li>Perda de dados devido a falhas técnicas</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">8. Modificações nos Termos</h3>
                <p className="legal-text">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão 
                  em vigor imediatamente após sua publicação na plataforma. O uso continuado após as modificações 
                  constitui aceitação dos novos termos.
                </p>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">9. Contato</h3>
                <p className="legal-text">
                  Para questões sobre estes Termos de Uso, entre em contato através do email: 
                  <strong> contato@doevida.com.br</strong>
                </p>
              </section>
            </div>

            {/* Footer com Ações */}
            <div className="legal-modal-footer">
              <label className="legal-checkbox-container">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="legal-checkbox"
                />
                <span className="legal-checkbox-label">
                  Li e aceito os Termos de Uso
                </span>
              </label>
              <div className="legal-modal-actions">
                <button
                  type="button"
                  className="btn-legal-action secondary"
                  onClick={() => setShowTermsModal(false)}
                >
                  Fechar
                </button>
                <button
                  type="button"
                  className="btn-legal-action primary"
                  disabled={!termsAccepted}
                  onClick={() => {
                    setShowTermsModal(false);
                    // Aqui você pode salvar a aceitação no backend
                  }}
                >
                  Aceitar e Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE POLÍTICA DE PRIVACIDADE */}
      {showPrivacyModal && (
        <div className="legal-modal-overlay" onClick={() => setShowPrivacyModal(false)}>
          <div
            className="legal-modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
          >
            {/* Header do Modal */}
            <div className="legal-modal-header">
              <div className="legal-header-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="legal-header-content">
                <h2 id="privacy-modal-title" className="legal-modal-title">Política de Privacidade</h2>
                <p className="legal-modal-subtitle">Última atualização: 23 de outubro de 2025</p>
              </div>
              <button
                type="button"
                className="btn-close-legal-modal"
                onClick={() => setShowPrivacyModal(false)}
                aria-label="Fechar modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="legal-modal-content">
              <section className="legal-section">
                <h3 className="legal-section-title">1. Introdução</h3>
                <p className="legal-text">
                  A privacidade dos nossos usuários é de extrema importância para o DoeVida. Esta Política de 
                  Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
                </p>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">2. Informações que Coletamos</h3>
                <p className="legal-text">
                  Coletamos as seguintes categorias de informações:
                </p>
                
                <h4 className="legal-subsection-title">2.1 Informações Pessoais</h4>
                <ul className="legal-list">
                  <li>Nome completo</li>
                  <li>CPF</li>
                  <li>Data de nascimento</li>
                  <li>Tipo sanguíneo</li>
                  <li>Email e telefone</li>
                  <li>Endereço residencial</li>
                </ul>

                <h4 className="legal-subsection-title">2.2 Informações de Saúde</h4>
                <ul className="legal-list">
                  <li>Histórico de doações</li>
                  <li>Condições de saúde relevantes para doação</li>
                  <li>Resultados de triagem (quando aplicável)</li>
                </ul>

                <h4 className="legal-subsection-title">2.3 Informações de Uso</h4>
                <ul className="legal-list">
                  <li>Dados de navegação e interação com a plataforma</li>
                  <li>Endereço IP e localização geográfica</li>
                  <li>Tipo de dispositivo e navegador</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">3. Como Usamos suas Informações</h3>
                <p className="legal-text">
                  Utilizamos suas informações para:
                </p>
                <ul className="legal-list">
                  <li>Facilitar o agendamento de doações de sangue</li>
                  <li>Conectar doadores com hospitais e hemocentros</li>
                  <li>Enviar notificações sobre necessidades urgentes de sangue</li>
                  <li>Manter seu histórico de doações</li>
                  <li>Melhorar nossos serviços e experiência do usuário</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                  <li>Prevenir fraudes e garantir a segurança da plataforma</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">4. Compartilhamento de Informações</h3>
                <p className="legal-text">
                  Suas informações podem ser compartilhadas com:
                </p>
                <ul className="legal-list">
                  <li><strong>Hospitais e Hemocentros:</strong> Informações necessárias para processar sua doação</li>
                  <li><strong>Autoridades de Saúde:</strong> Quando exigido por lei ou regulamentação</li>
                  <li><strong>Prestadores de Serviços:</strong> Empresas que nos ajudam a operar a plataforma</li>
                  <li><strong>Parceiros de Negócios:</strong> Apenas com seu consentimento explícito</li>
                </ul>
                <p className="legal-text legal-highlight">
                  <strong>Importante:</strong> Nunca vendemos suas informações pessoais a terceiros.
                </p>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">5. Segurança dos Dados</h3>
                <p className="legal-text">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
                </p>
                <ul className="legal-list">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controles de acesso rigorosos</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Auditorias regulares de segurança</li>
                  <li>Treinamento de equipe em proteção de dados</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">6. Seus Direitos (LGPD)</h3>
                <p className="legal-text">
                  De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                </p>
                <ul className="legal-list">
                  <li><strong>Acesso:</strong> Solicitar cópia de seus dados pessoais</li>
                  <li><strong>Correção:</strong> Atualizar informações incorretas ou incompletas</li>
                  <li><strong>Exclusão:</strong> Solicitar a remoção de seus dados</li>
                  <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                  <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                  <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados</li>
                  <li><strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">7. Retenção de Dados</h3>
                <p className="legal-text">
                  Mantemos suas informações pelo tempo necessário para:
                </p>
                <ul className="legal-list">
                  <li>Fornecer nossos serviços</li>
                  <li>Cumprir obrigações legais (mínimo de 5 anos para dados de saúde)</li>
                  <li>Resolver disputas e fazer cumprir nossos acordos</li>
                </ul>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">8. Cookies e Tecnologias Similares</h3>
                <p className="legal-text">
                  Utilizamos cookies para melhorar sua experiência. Você pode gerenciar suas preferências de 
                  cookies nas configurações do navegador.
                </p>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">9. Alterações nesta Política</h3>
                <p className="legal-text">
                  Podemos atualizar esta Política periodicamente. Notificaremos você sobre mudanças significativas 
                  através de email ou aviso na plataforma.
                </p>
              </section>

              <section className="legal-section">
                <h3 className="legal-section-title">10. Contato e Encarregado de Dados</h3>
                <p className="legal-text">
                  Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
                </p>
                <ul className="legal-list">
                  <li><strong>Email:</strong> privacidade@doevida.com.br</li>
                  <li><strong>Encarregado de Dados (DPO):</strong> dpo@doevida.com.br</li>
                  <li><strong>Telefone:</strong> (11) 3000-0000</li>
                </ul>
              </section>
            </div>

            {/* Footer com Ações */}
            <div className="legal-modal-footer">
              <label className="legal-checkbox-container">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="legal-checkbox"
                />
                <span className="legal-checkbox-label">
                  Li e aceito a Política de Privacidade
                </span>
              </label>
              <div className="legal-modal-actions">
                <button
                  type="button"
                  className="btn-legal-action secondary"
                  onClick={() => setShowPrivacyModal(false)}
                >
                  Fechar
                </button>
                <button
                  type="button"
                  className="btn-legal-action primary"
                  disabled={!privacyAccepted}
                  onClick={() => {
                    setShowPrivacyModal(false);
                    // Aqui você pode salvar a aceitação no backend
                  }}
                >
                  Aceitar e Continuar
                </button>
              </div>
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
