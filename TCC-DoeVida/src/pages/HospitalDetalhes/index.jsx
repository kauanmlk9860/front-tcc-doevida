import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'

function HospitalDetalhes() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)

  // Dados mockados do hospital (substituir por API real)
  const hospitaisMock = {
    1: {
      id: 1,
      nome: 'Banco de Sangue de São Paulo',
      endereco: 'R. Dr. Tomás Carvalhal, 711 - São Paulo',
      telefone: '(11) 3373-2050',
      lat: -23.5505,
      lng: -46.6333,
      foto: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
      horarioFuncionamento: '08:00 - 17:00',
      diasFuncionamento: 'Segunda a sexta',
      estacionamento: true,
      acessibilidade: true,
      tiposSanguineos: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      descricao: 'Centro especializado em coleta e armazenamento de sangue, atendendo toda a região metropolitana de São Paulo.',
      capacidade: '200 doações/dia',
      convenios: ['SUS', 'Particular', 'Planos de Saúde']
    }
  }

  useEffect(() => {
    // Simular carregamento dos dados
    setTimeout(() => {
      const hospitalData = hospitaisMock[id] || hospitaisMock[1]
      setHospital(hospitalData)
      setLoading(false)
    }, 800)
  }, [id])

  const handleVoltar = () => {
    navigate('/hospitais')
  }

  const handleAbrirMaps = () => {
    if (hospital) {
      const endereco = encodeURIComponent(hospital.endereco)
      window.open(`https://www.google.com/maps/search/${endereco}`, '_blank')
    }
  }

  const handleLigarAgora = () => {
    if (hospital) {
      window.location.href = `tel:${hospital.telefone.replace(/\D/g, '')}`
    }
  }

  if (loading) {
    return (
      <div className="hospital-detalhes-container">
        <div className="loading-detalhes">
          <div className="loading-spinner-detalhes"></div>
          <p>Carregando informações...</p>
        </div>
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="hospital-detalhes-container">
        <div className="error-detalhes">
          <h2>Hospital não encontrado</h2>
          <button onClick={handleVoltar} className="btn-voltar-error">
            Voltar para Hospitais
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="hospital-detalhes-container">
      {/* Header Premium igual ao da tela de hospitais */}
      <header className="header-detalhes-premium">
        <div className="header-bg-detalhes">
          <div className="header-content-detalhes">
            <div className="header-left-detalhes">
              <button
                className="btn-voltar-detalhes"
                onClick={handleVoltar}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="header-brand-detalhes">
                <div className="brand-logo-container-detalhes">
                  <img src={logoBranca} alt="DoeVida" className="header-logo-detalhes" />
                  <div className="logo-glow-detalhes"></div>
                </div>
                <h1 className="brand-title-detalhes">Detalhes do Hospital</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="main-detalhes">
        {/* Imagem do Hospital */}
        <div className="hospital-image-container">
          <img src={hospital.foto} alt={hospital.nome} className="hospital-image" />
          <div className="image-overlay"></div>
        </div>

        {/* Informações do Hospital */}
        <div className="hospital-info-section">
          <div className="hospital-header-info">
            <h1 className="hospital-nome-detalhes">{hospital.nome}</h1>
            
            <div className="hospital-contato-basico">
              <div className="info-item-basico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{hospital.endereco}</span>
              </div>
              <div className="info-item-basico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{hospital.telefone}</span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="acoes-principais">
              <button className="btn-acao-principal maps" onClick={handleAbrirMaps}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Abrir no Google Maps</span>
              </button>
              <button className="btn-acao-principal ligar" onClick={handleLigarAgora}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Ligar Agora</span>
              </button>
            </div>
          </div>

          {/* Cards de Informações */}
          <div className="info-cards-grid">
            {/* Horário de Funcionamento */}
            <div className="info-card">
              <div className="info-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <h3>Horário de funcionamento</h3>
              </div>
              <div className="info-card-content">
                <p className="horario-destaque">{hospital.horarioFuncionamento}</p>
                <p className="dias-funcionamento">{hospital.diasFuncionamento}</p>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="info-card">
              <div className="info-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <h3>Informações adicionais</h3>
              </div>
              <div className="info-card-content">
                <ul className="lista-info-adicional">
                  {hospital.estacionamento && (
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Estacionamento disponível</span>
                    </li>
                  )}
                  {hospital.acessibilidade && (
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Acessibilidade para PCD</span>
                    </li>
                  )}
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Capacidade: {hospital.capacidade}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tipos Sanguíneos Aceitos */}
            <div className="info-card tipos-sangue-card">
              <div className="info-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <h3>Tipos sanguíneos aceitos</h3>
              </div>
              <div className="info-card-content">
                <div className="tipos-sangue-grid">
                  {hospital.tiposSanguineos.map((tipo) => (
                    <div key={tipo} className="tipo-sangue-badge">
                      {tipo}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Convênios */}
            <div className="info-card">
              <div className="info-card-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <h3>Convênios aceitos</h3>
              </div>
              <div className="info-card-content">
                <div className="convenios-list">
                  {hospital.convenios.map((convenio, index) => (
                    <span key={index} className="convenio-badge">
                      {convenio}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          {hospital.descricao && (
            <div className="descricao-section">
              <h3>Sobre o hospital</h3>
              <p>{hospital.descricao}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default HospitalDetalhes
