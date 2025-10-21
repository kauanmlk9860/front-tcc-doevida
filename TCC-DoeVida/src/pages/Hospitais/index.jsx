import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'

function Hospitais() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [hospitais, setHospitais] = useState([])
  const [loading, setLoading] = useState(true)

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
  }, [])

  const hospitaisFiltrados = hospitais.filter(hospital =>
    hospital.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRota = (hospital) => {
    // Aqui você pode implementar a lógica de rota (Google Maps, Waze, etc.)
    const endereco = encodeURIComponent(hospital.endereco)
    window.open(`https://www.google.com/maps/search/${endereco}`, '_blank')
  }

  const handleVoltar = () => {
    navigate('/home')
  }

  return (
    <div className="hospitais-container">
      {/* Header */}
      <header className="hospitais-header">
        <div className="header-content">
          <button className="btn-voltar" onClick={handleVoltar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="header-title">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
              </svg>
            </div>
            <h1>Hospitais disponíveis</h1>
          </div>

          <div className="search-container">
            <div className="search-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Find Seekers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mapa */}
      <div className="mapa-container">
        <div className="mapa-placeholder">
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
      </div>

      {/* Lista de Hospitais */}
      <div className="hospitais-lista">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">Carregando hospitais...</div>
          </div>
        ) : (
          <div className="hospitais-grid">
            {hospitaisFiltrados.map((hospital) => (
              <div key={hospital.id} className="hospital-card">
                <div className="hospital-info">
                  <h3 className="hospital-nome">{hospital.nome}</h3>
                  <p className="hospital-endereco">{hospital.endereco}</p>
                  <p className="hospital-telefone">{hospital.telefone}</p>
                </div>
                <button 
                  className="btn-rota"
                  onClick={() => handleRota(hospital)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Rota
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Hospitais
