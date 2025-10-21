import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'

function BancoSangue() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [estoqueAtual, setEstoqueAtual] = useState([])

  // Dados mockados do estoque de sangue
  const estoqueMock = [
    { tipo: 'A+', porcentagem: 60, status: 'medio', cor: '#FDB813' },
    { tipo: 'A-', porcentagem: 90, status: 'bom', cor: '#28a745' },
    { tipo: 'B+', porcentagem: 45, status: 'medio', cor: '#FF8C00' },
    { tipo: 'B-', porcentagem: 40, status: 'medio', cor: '#FF8C00' },
    { tipo: 'AB+', porcentagem: 60, status: 'medio', cor: '#28a745' },
    { tipo: 'AB-', porcentagem: 90, status: 'bom', cor: '#28a745' },
    { tipo: 'O+', porcentagem: 37, status: 'critico', cor: '#dc3545' },
    { tipo: 'O-', porcentagem: 25, status: 'critico', cor: '#dc3545' }
  ]

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setEstoqueAtual(estoqueMock)
      setLoading(false)
    }, 800)
  }, [])

  const handleVoltar = () => {
    navigate('/home')
  }

  const getStatusInfo = (porcentagem) => {
    if (porcentagem >= 70) {
      return { texto: 'Estoque Bom', classe: 'status-bom', icone: '✓' }
    } else if (porcentagem >= 40) {
      return { texto: 'Estoque Médio', classe: 'status-medio', icone: '⚠' }
    } else {
      return { texto: 'Estoque Crítico', classe: 'status-critico', icone: '!' }
    }
  }

  const tiposUrgentes = estoqueAtual.filter(item => item.porcentagem < 40)

  return (
    <div className="banco-sangue-container">
      {/* Header Premium */}
      <header className="banco-header-premium">
        <div className="header-bg-banco"></div>
        <div className="header-content-banco">
          <div className="header-left-banco">
            <button className="btn-voltar-banco" onClick={handleVoltar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="header-brand-banco">
              <div className="brand-logo-container-banco">
                <img src={logoBranca} alt="DoeVida" className="header-logo-banco" />
                <div className="logo-glow-banco"></div>
              </div>
              <h1 className="brand-title-banco">Banco de Sangue</h1>
            </div>
          </div>

          <div className="header-stats-banco">
            <div className="stat-item-banco">
              <div className="stat-icon-banco">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="white"/>
                </svg>
              </div>
              <div className="stat-info-banco">
                <span className="stat-number-banco">{estoqueAtual.length}</span>
                <span className="stat-label-banco">Tipos</span>
              </div>
            </div>
            <div className="stat-item-banco">
              <div className="stat-icon-banco urgente">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="white"/>
                  <path d="M12 9v4m0 4h.01" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="stat-info-banco">
                <span className="stat-number-banco urgente-number">{tiposUrgentes.length}</span>
                <span className="stat-label-banco">Urgentes</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-banco">
        {loading ? (
          <div className="loading-banco">
            <div className="loading-spinner-banco"></div>
            <p>Carregando estoque...</p>
          </div>
        ) : (
          <>
            {/* Alertas Urgentes */}
            {tiposUrgentes.length > 0 && (
              <div className="alertas-urgentes">
                <div className="alerta-header">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#dc3545"/>
                    <path d="M12 9v4m0 4h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h2>Tipos Sanguíneos Urgentes</h2>
                </div>
                <div className="tipos-urgentes-list">
                  {tiposUrgentes.map((tipo) => (
                    <div key={tipo.tipo} className="tipo-urgente-badge">
                      <span className="tipo-text">{tipo.tipo}</span>
                      <span className="urgente-label">Doe Agora!</span>
                    </div>
                  ))}
                </div>
                <p className="alerta-texto">
                  Estes tipos sanguíneos estão com estoque crítico. Sua doação pode salvar vidas!
                </p>
              </div>
            )}

            {/* Seção de Estoque */}
            <div className="estoque-section">
              <div className="section-header">
                <div className="section-title-group">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="#990410" strokeWidth="2" fill="none"/>
                  </svg>
                  <h2>Estoque de Sangue</h2>
                </div>
                <p className="section-subtitle">Acompanhe em tempo real a disponibilidade de cada tipo sanguíneo</p>
              </div>

              <div className="estoque-grid">
                {estoqueAtual.map((item, index) => {
                  const statusInfo = getStatusInfo(item.porcentagem)
                  return (
                    <div 
                      key={item.tipo} 
                      className={`estoque-card ${item.status}`}
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="card-header-estoque">
                        <div className="tipo-badge-grande">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor"/>
                          </svg>
                          <span>{item.tipo}</span>
                        </div>
                        <div className={`status-badge ${statusInfo.classe}`}>
                          <span className="status-icon">{statusInfo.icone}</span>
                          <span>{statusInfo.texto}</span>
                        </div>
                      </div>

                      <div className="porcentagem-display">
                        <span className="porcentagem-numero">{item.porcentagem}%</span>
                        <span className="porcentagem-label">de capacidade</span>
                      </div>

                      <div className="progress-container">
                        <div className="progress-bg">
                          <div 
                            className="progress-fill"
                            style={{
                              width: `${item.porcentagem}%`,
                              backgroundColor: item.cor
                            }}
                          >
                            <div className="progress-shine"></div>
                          </div>
                        </div>
                        <div className="progress-markers">
                          <span className="marker" style={{left: '40%'}}>40%</span>
                          <span className="marker" style={{left: '70%'}}>70%</span>
                        </div>
                      </div>

                      {item.porcentagem < 40 && (
                        <div className="urgente-indicator">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="currentColor"/>
                          </svg>
                          <span>Doação Urgente</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="info-adicional-section">
              <div className="info-card-banco">
                <div className="info-icon-container">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#990410" strokeWidth="2"/>
                    <path d="M12 16v-4m0-4h.01" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Como funciona o estoque?</h3>
                <ul className="info-list">
                  <li>
                    <span className="bullet bom"></span>
                    <div>
                      <strong>Estoque Bom (70-100%):</strong> Quantidade adequada para atender a demanda
                    </div>
                  </li>
                  <li>
                    <span className="bullet medio"></span>
                    <div>
                      <strong>Estoque Médio (40-69%):</strong> Quantidade moderada, doações são bem-vindas
                    </div>
                  </li>
                  <li>
                    <span className="bullet critico"></span>
                    <div>
                      <strong>Estoque Crítico (0-39%):</strong> Quantidade baixa, doações urgentes necessárias
                    </div>
                  </li>
                </ul>
              </div>

              <div className="info-card-banco destaque">
                <div className="info-icon-container">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#990410"/>
                  </svg>
                </div>
                <h3>Sua doação salva vidas!</h3>
                <p>Uma única doação pode salvar até 4 vidas. Veja os tipos urgentes e agende sua doação hoje mesmo.</p>
                <button className="btn-agendar-doacao" onClick={() => navigate('/hospitais')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>Agendar Doação</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default BancoSangue
