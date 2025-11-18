import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { 
  obterAgendamentosHoje,
  obterEstatisticasHospital
} from '../../api/hospital/agendamentos'
import '../Home/style.css'
import './style.css'
import logoSemFundo from '../../assets/icons/logo_semfundo.png'
import LogoutModal from '../../components/jsx/LogoutModal'

import icDashboard from '../../assets/icons/hospital.png'
import icPerfil from '../../assets/icons/registrar.png'
import icHistorico from '../../assets/icons/historico.png'
import icBancoSangue from '../../assets/icons/banco-sangue.png'

/** Formatador pt-BR */
function useNumberFormatter(locale = "pt-BR") {
  return useMemo(() => new Intl.NumberFormat(locale), [locale]);
}

/** CountUp simples */
function CountUp({ end = 0, duration = 1800, prefix = "", className }) {
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

function HospitalHome() {
  const navigate = useNavigate()
  const { user, logout, loading: userLoading } = useUser()
  const [agendamentosHoje, setAgendamentosHoje] = useState([])
  const [estatisticas, setEstatisticas] = useState({
    totalAgendamentos: 0,
    agendamentosConcluidos: 0,
    agendamentosPendentes: 0,
    agendamentosCancelados: 0
  })
  const [loading, setLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  // Verificar se é hospital
  useEffect(() => {
    if (!user || user.role !== 'HOSPITAL') {
      navigate('/hospital-login')
    }
  }, [user, navigate])

  // Carregar dados
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Carregar agendamentos de hoje
      const resHoje = await obterAgendamentosHoje()
      if (resHoje.success) {
        setAgendamentosHoje(resHoje.data)
      }

      // Carregar estatísticas
      const resStats = await obterEstatisticasHospital('mes')
      if (resStats.success) {
        setEstatisticas(resStats.data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = () => {
    logout()
    setShowLogoutModal(false)
    navigate('/hospital-login')
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  if (loading || userLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Carregando...</div>
      </div>
    )
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
          <div className="user-info">
            <div className="user-details">
              <span 
                className="user-name"
                onClick={() => setShowUserModal(true)}
                style={{ cursor: "pointer" }}
              >
                Olá, {user?.nome || "Hospital"}!
              </span>
            </div>
          </div>
        </nav>
      </header>

      <main className="main" id="conteudo" role="main">
        {/* HERO */}
        <section className="hero-grid" aria-labelledby="hero-title">
          <div className="hero-left">
            <h2 id="hero-title" className="hero-title">
              Bem-vindo,
              <br /> {user?.nome || 'Hospital'}
            </h2>
            <p className="hero-subtitle">
              Gerencie seus agendamentos e acompanhe as doações de sangue
            </p>
            <button
              type="button"
              className="btn-cta"
              onClick={() => handleNavigation("/hospital-dashboard")}
            >
              Ver Dashboard Completo
            </button>
          </div>

          <div className="hero-media">
            <div className="hero-stats-card">
              <h3>Agendamentos de Hoje</h3>
              <div className="hero-stat-number">{agendamentosHoje.length}</div>
              <p>doações agendadas</p>
            </div>
          </div>
        </section>

        {/* LINHA DE CARDS */}
        <section className="actions-wrapper" aria-labelledby="actions-title">
          <h3 id="actions-title" className="sr-only">
            Atalhos e estatísticas
          </h3>

          <div className="actions-layout">
            <div className="impact-card" role="status" aria-label="Doações concluídas este mês">
              <div className="impact-text">
                <CountUp end={estatisticas.agendamentosConcluidos} duration={1800} prefix="" className="impact-number" />
                <span className="impact-label">
                  doações
                  <br />
                  concluídas
                </span>
              </div>
            </div>

            <div className="square-cards-grid">
              <article
                className="feature-card squareSpecificity"
                onClick={() => handleNavigation("/hospital-dashboard")}
              >
                <img src={icDashboard} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">Dashboard</h4>
              </article>

              <article
                className="feature-card squareSpecificity"
                onClick={() => handleNavigation("/hospital-perfil")}
              >
                <img src={icPerfil} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">Meu Perfil</h4>
              </article>

              <article
                className="feature-card squareSpecificity"
                onClick={() => handleNavigation("/hospital-dashboard")}
              >
                <img src={icHistorico} alt="" className="feature-emoji big" />
                <h4 className="feature-title-only bigger">Histórico</h4>
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
            </div>
          </div>

          <aside 
            className="critical-alert" 
            role="alert"
            onClick={() => handleNavigation("/hospital-dashboard")}
            style={{ cursor: 'pointer' }}
          >
            <span className="alert-icon">📊</span>
            <span>Total de agendamentos este mês: {estatisticas.totalAgendamentos}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
              <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </aside>
        </section>

        {/* SEÇÃO DE ESTATÍSTICAS */}
        <section className="news-section" aria-labelledby="stats-title">
          <div className="news-container">
            <div className="news-content">
              <div className="news-icon-wrapper">
                <svg className="news-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11H7m4 0h2m4 0h2m-9 4h2m4 0h2M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="news-text">
                <h3 id="stats-title" className="news-title">Estatísticas do Mês</h3>
                <p className="news-description">
                  Total: {estatisticas.totalAgendamentos} | Pendentes: {estatisticas.agendamentosPendentes} | Cancelados: {estatisticas.agendamentosCancelados}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-news"
              onClick={() => handleNavigation("/hospital-dashboard")}
            >
              <span className="btn-news-text">Ver Detalhes</span>
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
            onClick={() => handleNavigation("/hospital-perfil")}
          >
            Meu Perfil
          </button>

          <div className="footer-link-group">
            <button type="button" className="footer-link btn-link" onClick={() => handleNavigation("/hospital-dashboard")}>
              Dashboard
            </button>
            <button type="button" className="footer-link btn-link" onClick={() => handleNavigation("/banco-sangue")}>
              Banco de Sangue
            </button>
            <button
              type="button"
              className="footer-link btn-link"
              onClick={handleLogoutClick}
            >
              Sair
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL PREMIUM DE PERFIL DO HOSPITAL */}
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
                  src={user?.foto || "/placeholder-profile.png"}
                  alt="Foto do hospital"
                  className="user-modal-avatar"
                />
                <div className="user-modal-avatar-glow"></div>
              </div>
              <h2 id="user-modal-title" className="user-modal-name">
                {user?.nome || "Hospital"}
              </h2>
              <p className="user-modal-email">{user?.email}</p>
            </div>

            {/* Informações do Hospital */}
            <div className="user-modal-info-grid">
              {user?.cnpj && (
                <div className="user-modal-info-card">
                  <div className="user-modal-info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11H7m4 0h2m4 0h2m-9 4h2m4 0h2M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="#990410" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="user-modal-info-content">
                    <span className="user-modal-info-label">CNPJ</span>
                    <span className="user-modal-info-value">{user.cnpj}</span>
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
            </div>

            {/* Botões de Ação */}
            <div className="user-modal-actions">
              <button
                type="button"
                className="btn-user-modal-action primary"
                onClick={() => {
                  setShowUserModal(false)
                  handleNavigation('/hospital-perfil')
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
  )
}

export default HospitalHome
