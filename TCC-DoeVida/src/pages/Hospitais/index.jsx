import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'

function Hospitais() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [hospitais, setHospitais] = useState([])
  const [loading, setLoading] = useState(true)
  const [showHospitaisModal, setShowHospitaisModal] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [searchingLocation, setSearchingLocation] = useState(false)

  // Dados mockados dos hospitais (você pode substituir por uma API real)
  const hospitaisMock = [
    {
      id: 1,
      nome: 'Hospital Regional',
      endereco: 'Av. Principal, 711 - São Paulo',
      telefone: '(11) 3373-2050',
      lat: -23.5505,
      lng: -46.6333
    },
    {
      id: 2,
      nome: 'Hospital Regional',
      endereco: 'Av. Principal, 711 - São Paulo',
      telefone: '(11) 3373-2050',
      lat: -23.5505,
      lng: -46.6333
    },
    {
      id: 3,
      nome: 'Hospital Regional',
      endereco: 'Av. Principal, 711 - São Paulo',
      telefone: '(11) 3373-2050',
      lat: -23.5505,
      lng: -46.6333
    },
    {
      id: 4,
      nome: 'Hospital Regional',
      endereco: 'Av. Principal, 711 - São Paulo',
      telefone: '(11) 3373-2050',
      lat: -23.5505,
      lng: -46.6333
    },
    {
      id: 5,
      nome: 'Hospital Regional',
      endereco: 'Av. Principal, 711 - São Paulo',
      telefone: '(11) 3373-2050',
      lat: -23.5505,
      lng: -46.6333
    },
    {
      id: 6,
      nome: 'Hospital Regional',
      endereco: 'Av. Principal, 711 - São Paulo',
      telefone: '(11) 3373-2050',
      lat: -23.5505,
      lng: -46.6333
    }
  ]

  useEffect(() => {
    // Simular carregamento dos dados
    setTimeout(() => {
      setHospitais(hospitaisMock)
      setLoading(false)
    }, 1000)

    // Tentar obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Erro ao obter localização:', error)
        }
      )
    }
  }, [])

  // Função para calcular distância entre dois pontos (Fórmula de Haversine)
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distancia = R * c
    return distancia.toFixed(1)
  }

  // Função para buscar coordenadas de um endereço usando Nominatim (OpenStreetMap)
  const buscarCoordenadas = async (endereco) => {
    try {
      setSearchingLocation(true)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco + ', Brasil')}&limit=1`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        const location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        }
        setUserLocation(location)
        return location
      }
      return null
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error)
      return null
    } finally {
      setSearchingLocation(false)
    }
  }

  // Função para buscar hospitais próximos quando o usuário pesquisar
  const handleSearch = async (termo) => {
    setSearchTerm(termo)
    
    if (termo.length > 3) {
      const location = await buscarCoordenadas(termo)
      if (location) {
        // Ordenar hospitais por distância
        const hospitaisComDistancia = hospitais.map(hospital => ({
          ...hospital,
          distancia: calcularDistancia(
            location.lat,
            location.lng,
            hospital.lat,
            hospital.lng
          )
        }))
        
        // Ordenar por distância
        hospitaisComDistancia.sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia))
        setHospitais(hospitaisComDistancia)
      }
    }
  }

  const hospitaisFiltrados = hospitais.filter(hospital =>
    hospital.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRota = (hospital) => {
  
    const endereco = encodeURIComponent(hospital.endereco)
    window.open(`https://www.google.com/maps/search/${endereco}`, '_blank')
  }

  const handleVoltar = () => {
    navigate('/home')
  }

  return (
    <div className="hospitais-container">
      {/* Header Premium */}
      <header className="hospitais-header-premium">
        <div className="header-bg-pattern"></div>
        <div className="header-content-premium">
          <div className="header-left-simple">
            <button 
              className="btn-voltar-premium"
              onClick={() => navigate('/')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="header-brand-simple">
              <div className="brand-logo-container">
                <img src={logoBranca} alt="DoeVida" className="header-logo" />
                <div className="logo-glow"></div>
              </div>
              <h1 className="brand-title">DoeVida</h1>
            </div>
          </div>

          <div className="header-center-search">
            <div className="search-container-header">
              <div className="search-icon-header">
                {searchingLocation ? (
                  <div className="search-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input
                type="text"
                placeholder="Buscar hospitais por nome ou localização..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input-header"
                disabled={searchingLocation}
              />
              {searchTerm && (
                <button 
                  className="search-clear-header"
                  onClick={() => setSearchTerm('')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="header-right">
            <div className="stats-mini">
              <div className="stat-mini">
                <span className="stat-mini-number">{hospitaisFiltrados.length}</span>
                <span className="stat-mini-label">Hospitais</span>
              </div>
              <div className="stat-divider-mini"></div>
              <div className="stat-mini">
                <span className="stat-mini-number">24h</span>
                <span className="stat-mini-label">Ativo</span>
              </div>
            </div>
            
            <button 
              className="btn-lista-hospitais-premium"
              onClick={() => setShowHospitaisModal(true)}
            >
              <div className="btn-icon-container">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 1 8.5c0 2.29 1.51 4.04 3 5.5Z" fill="currentColor"/>
                  <path d="M12 5L8 21l4-7 4 7-4-16Z" fill="white"/>
                </svg>
              </div>
              <span className="btn-text">Ver Lista</span>
              <div className="btn-badge">{hospitaisFiltrados.length}</div>
            </button>
          </div>
        </div>
      </header>

      {/* Mapa em Tela Cheia */}
      <div className="mapa-fullscreen">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58509.294445838135!2d-46.693419999999994!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a2b2ed7f3a1%3A0xab35da2f5ca62674!2sS%C3%A3o%20Paulo%2C%20SP!5e0!3m2!1spt!2sbr!4v1635000000000!5m2!1spt!2sbr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa dos Hospitais"
        />
      </div>

      {/* Modal Lateral de Hospitais */}
      {showHospitaisModal && (
        <div className="hospitais-modal-overlay" onClick={() => setShowHospitaisModal(false)}>
          <div className="hospitais-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header Premium do Modal */}
            <div className="modal-header-premium">
              <div className="modal-header-bg">
                <div className="modal-logo-section">
                  <img src={logoBranca} alt="DoeVida" className="modal-logo" />
                  <div className="modal-brand">
                    <h1>DoeVida</h1>
                    <span>Hospitais Parceiros</span>
                  </div>
                </div>
                <button 
                  className="btn-close-modal-premium"
                  onClick={() => setShowHospitaisModal(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              {/* Stats Section */}
              <div className="modal-stats">
                <div className="stat-item">
                  <div className="stat-number">{hospitaisFiltrados.length}</div>
                  <div className="stat-label">Hospitais</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">24h</div>
                  <div className="stat-label">Disponível</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Confiável</div>
                </div>
              </div>
            </div>

            {/* Campo de Busca Premium */}
            <div className="modal-search-premium">
              <div className="search-wrapper-premium">
                <div className="search-icon-container">
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Busque por nome ou endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-premium"
                />
                {searchTerm && (
                  <button 
                    className="search-clear"
                    onClick={() => setSearchTerm('')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Lista de Hospitais Premium */}
            <div className="modal-content-premium">
              {loading ? (
                <div className="loading-premium">
                  <div className="loading-animation">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring pulse-ring-delay-1"></div>
                    <div className="pulse-ring pulse-ring-delay-2"></div>
                    <div className="loading-heart">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#990410"/>
                      </svg>
                    </div>
                  </div>
                  <h3>Localizando hospitais</h3>
                  <p>Encontrando os melhores parceiros para você...</p>
                </div>
              ) : hospitaisFiltrados.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="8" stroke="#6c757d" strokeWidth="2"/>
                      <path d="m21 21-4.35-4.35" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Nenhum hospital encontrado</h3>
                  <p>Tente buscar por outro termo ou limpe o filtro</p>
                </div>
              ) : (
                <div className="hospitais-list-premium">
                  {hospitaisFiltrados.map((hospital, index) => (
                    <div key={hospital.id} className="hospital-card-premium" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="hospital-card-content">
                        <div className="hospital-icon-premium">
                          <div className="icon-bg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 1 8.5c0 2.29 1.51 4.04 3 5.5Z" fill="currentColor"/>
                              <path d="M12 5L8 21l4-7 4 7-4-16Z" fill="white"/>
                            </svg>
                          </div>
                          <div className="status-indicator"></div>
                        </div>
                        
                        <div className="hospital-details">
                          <div className="hospital-header">
                            <h3 className="hospital-nome-premium">{hospital.nome}</h3>
                            <div className="hospital-badge">Parceiro</div>
                          </div>
                          
                          <div className="hospital-meta">
                            <div className="meta-item">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              <span>{hospital.endereco}</span>
                            </div>
                            <div className="meta-item">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              <span>{hospital.telefone}</span>
                            </div>
                            {hospital.distancia && (
                              <div className="meta-item distancia-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="distancia-text">{hospital.distancia} km de distância</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="btn-rota-premium"
                        onClick={() => handleRota(hospital)}
                      >
                        <span>Rota</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Hospitais
