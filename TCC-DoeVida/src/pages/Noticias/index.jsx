import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logoSemFundo from "../../assets/icons/logo_semfundo.png";
import { useUser } from "../../contexts/UserContext";

// Notícias mockadas com dados reais
const NOTICIAS_MOCKADAS = [
  {
    id: 1,
    title: "Junho Vermelho: Campanha Nacional incentiva doação de sangue",
    description: "Ministério da Saúde lança campanha para aumentar os estoques de sangue em todo o país durante o mês de junho.",
    image: "https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=800&q=80",
    url: "https://www.gov.br/saude/pt-br",
    source: { name: "Ministério da Saúde" },
    published_at: "2024-06-01T10:00:00Z",
    category: "Campanha"
  },
  {
    id: 2,
    title: "Hemocentros registram queda nos estoques de sangue tipo O negativo",
    description: "Bancos de sangue de todo Brasil alertam para necessidade urgente de doações, especialmente do tipo O negativo.",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80",
    url: "https://g1.globo.com/saude/",
    source: { name: "G1 Saúde" },
    published_at: "2024-11-08T14:30:00Z",
    category: "Urgente"
  },
  {
    id: 3,
    title: "Doação de sangue: mitos e verdades sobre o procedimento",
    description: "Especialistas esclarecem dúvidas comuns e derrubam mitos sobre a doação de sangue, incentivando mais pessoas a doar.",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    url: "https://www.uol.com.br/vivabem/",
    source: { name: "UOL VivaBem" },
    published_at: "2024-11-05T09:15:00Z",
    category: "Saúde"
  },
  {
    id: 4,
    title: "Tecnologia facilita agendamento de doação de sangue em hospitais",
    description: "Novos aplicativos e plataformas digitais tornam mais fácil e rápido o processo de agendamento para doação.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    url: "https://www.folha.uol.com.br/equilibrioesaude/",
    source: { name: "Folha de S.Paulo" },
    published_at: "2024-11-03T16:45:00Z",
    category: "Tecnologia"
  },
  {
    id: 5,
    title: "Campanha de doação de sangue em empresas bate recorde",
    description: "Iniciativa corporativa resulta em mais de 10 mil doações em um único mês, salvando milhares de vidas.",
    image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&q=80",
    url: "https://www.estadao.com.br/saude/",
    source: { name: "Estadão Saúde" },
    published_at: "2024-10-28T11:20:00Z",
    category: "Campanha"
  },
  {
    id: 6,
    title: "Doadores regulares de sangue têm benefícios para a saúde",
    description: "Estudos mostram que doar sangue regularmente pode trazer benefícios cardiovasculares e reduzir riscos de doenças.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    url: "https://www.bbc.com/portuguese",
    source: { name: "BBC Brasil" },
    published_at: "2024-10-25T13:00:00Z",
    category: "Ciência"
  },
  {
    id: 7,
    title: "Hemocentro lança campanha especial para doadores de primeira viagem",
    description: "Ação visa acolher novos doadores com informações e suporte especial para primeira doação de sangue.",
    image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=800&q=80",
    url: "https://www.cnnbrasil.com.br/saude/",
    source: { name: "CNN Brasil" },
    published_at: "2024-10-20T10:30:00Z",
    category: "Campanha"
  },
  {
    id: 8,
    title: "Sangue raro: a importância de cadastros especiais de doadores",
    description: "Bancos de sangue criam cadastros específicos para tipos sanguíneos raros, facilitando localização em emergências.",
    image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=800&q=80",
    url: "https://www.r7.com/saude",
    source: { name: "R7 Saúde" },
    published_at: "2024-10-15T15:45:00Z",
    category: "Saúde"
  },
  {
    id: 9,
    title: "Jovens lideram movimento de doação de sangue nas redes sociais",
    description: "Influenciadores digitais criam campanha viral incentivando jovens a se tornarem doadores regulares de sangue.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    url: "https://www.uol.com.br/",
    source: { name: "UOL Notícias" },
    published_at: "2024-10-10T12:00:00Z",
    category: "Sociedade"
  },
  {
    id: 10,
    title: "Dia Mundial do Doador de Sangue celebra heróis anônimos",
    description: "Data celebrada em 14 de junho homenageia milhões de doadores que salvam vidas todos os dias ao redor do mundo.",
    image: "https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?w=800&q=80",
    url: "https://www.who.int/",
    source: { name: "OMS Brasil" },
    published_at: "2024-06-14T08:00:00Z",
    category: "Internacional"
  },
  {
    id: 11,
    title: "Hospitais ampliam horários para doação de sangue",
    description: "Rede hospitalar estende horário de funcionamento dos hemocentros para facilitar doações de trabalhadores.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
    url: "https://www.band.uol.com.br/saude",
    source: { name: "Band Saúde" },
    published_at: "2024-09-30T14:20:00Z",
    category: "Serviço"
  },
  {
    id: 12,
    title: "Pesquisa revela perfil do doador de sangue brasileiro",
    description: "Estudo inédito traça perfil demográfico e comportamental dos doadores de sangue no Brasil.",
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80",
    url: "https://www.metropoles.com/saude",
    source: { name: "Metrópoles" },
    published_at: "2024-09-25T11:30:00Z",
    category: "Ciência"
  }
];

function Noticias() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  
  const [noticias, setNoticias] = useState(NOTICIAS_MOCKADAS);
  const [noticiasFiltradas, setNoticiasFiltradas] = useState(NOTICIAS_MOCKADAS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("todas");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredNews, setFeaturedNews] = useState(NOTICIAS_MOCKADAS.slice(0, 5));
  const gridRef = useRef(null);

  const categorias = [
    { id: "todas", label: "Todas", icon: "🌐" },
    { id: "Campanha", label: "Campanhas", icon: "📢" },
    { id: "Saúde", label: "Saúde", icon: "🏥" },
    { id: "Ciência", label: "Ciência", icon: "🔬" },
    { id: "Tecnologia", label: "Tecnologia", icon: "💻" },
    { id: "Urgente", label: "Urgente", icon: "🚨" },
  ];

  // Filtrar notícias por categoria
  const filtrarNoticias = (categoria) => {
    if (categoria === "todas") {
      setNoticiasFiltradas(noticias);
    } else {
      const filtradas = noticias.filter(n => n.category === categoria);
      setNoticiasFiltradas(filtradas);
    }
  };

  // Buscar notícias por termo
  const buscarPorTermo = (termo) => {
    if (!termo.trim()) {
      setNoticiasFiltradas(noticias);
      return;
    }
    
    const termoLower = termo.toLowerCase();
    const resultados = noticias.filter(n => 
      n.title.toLowerCase().includes(termoLower) ||
      n.description.toLowerCase().includes(termoLower) ||
      n.category.toLowerCase().includes(termoLower)
    );
    setNoticiasFiltradas(resultados);
  };

  // Handler do formulário de busca
  const handleBuscar = (e) => {
    e.preventDefault();
    buscarPorTermo(searchTerm);
  };

  // Mudar categoria
  const mudarCategoria = (categoriaId) => {
    setActiveCategory(categoriaId);
    setSearchTerm("");
    filtrarNoticias(categoriaId);
  };

  // Formatar data
  const formatarData = (dateString) => {
    if (!dateString) return "Data não disponível";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Data não disponível";
    }
  };

  // Abrir notícia completa
  const abrirNoticia = (noticia) => {
    if (noticia.url) {
      window.open(noticia.url, "_blank", "noopener,noreferrer");
    } else if (noticia.link) {
      window.open(noticia.link, "_blank", "noopener,noreferrer");
    } else {
      setSelectedNews(noticia);
    }
  };

  // Inicializar notícias filtradas
  useEffect(() => {
    setNoticiasFiltradas(noticias);
    setFeaturedNews(noticias.slice(0, 5));
  }, []);

  // Carrossel automático
  useEffect(() => {
    if (featuredNews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(featuredNews.length, 5));
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredNews]);


  // Scroll listener para botão voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para voltar ao topo
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="noticias-page">
      {/* HEADER */}
      <header className="noticias-header">
        <div className="noticias-header-content">
          <div className="logo-container" onClick={() => navigate("/home")}>
            <img src={logoSemFundo} alt="Logo DoeVida" className="logo-img" />
            <h1 className="logo-text">DOEVIDA</h1>
          </div>

          <nav className="nav-buttons">
            {isLoggedIn ? (
              <div className="user-info-compact">
                <img
                  src={user?.foto_perfil || "/placeholder-profile.png"}
                  alt="Perfil"
                  className="user-avatar-small"
                  onClick={() => navigate("/perfil")}
                />
                <span className="user-name-small">{user?.nome || "Usuário"}</span>
              </div>
            ) : (
              <button className="btn-login-header" onClick={() => navigate("/login")}>
                Entrar
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* HERO SECTION COM CARROSSEL */}
      <section className="noticias-hero">
        <div className="noticias-hero-content">
          <div className="noticias-hero-text">
            <div className="noticias-hero-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="noticias-hero-title">Notícias sobre Saúde</h2>
            <p className="noticias-hero-subtitle">
              Fique por dentro das últimas novidades sobre doação de sangue, saúde e medicina
            </p>
          </div>

          {/* CARROSSEL DE NOTÍCIAS EM DESTAQUE */}
          {featuredNews.length > 0 && (
            <div className="carousel-container">
              <div className="carousel-wrapper">
                <div 
                  className="carousel-track" 
                  style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
                >
                  {featuredNews.map((noticia, index) => (
                    <div 
                      key={noticia.id || index} 
                      className="carousel-slide"
                      onClick={() => abrirNoticia(noticia)}
                    >
                      <img
                        src={noticia.image || PLACEHOLDER_IMAGE}
                        alt={noticia.title}
                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                      />
                      <div className="carousel-slide-overlay">
                        <h4>{noticia.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="carousel-indicators">
                {featuredNews.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ir para slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="noticias-search-section">
        <form className="noticias-search-form" onSubmit={handleBuscar}>
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar notícias sobre saúde..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-search">
            Buscar
          </button>
        </form>
      </section>

      {/* CATEGORIAS */}
      <section className="noticias-categories">
        <div className="categories-wrapper">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => mudarCategoria(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* CONTADOR DE RESULTADOS */}
      {noticiasFiltradas.length > 0 && (
        <div style={{ textAlign: 'center', padding: '0 2rem' }}>
          <div className="results-count">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{noticiasFiltradas.length} notícias encontradas</span>
          </div>
        </div>
      )}

      {/* CONTEÚDO */}
      <main className="noticias-main">
        {noticiasFiltradas.length === 0 ? (
          <div className="empty-container">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="empty-text">Nenhuma notícia encontrada</p>
          </div>
        ) : (
          <div className="noticias-grid" ref={gridRef}>
            {noticiasFiltradas.map((noticia, index) => (
                <article
                  key={noticia.id || index}
                  className="noticia-card"
                  style={{ '--index': index }}
                  onClick={() => abrirNoticia(noticia)}
                >
                  <div className="noticia-image-wrapper">
                    <img
                      src={noticia.image}
                      alt={noticia.title}
                      className="noticia-image"
                    />
                    {noticia.source?.name && (
                      <span className="noticia-badge">{noticia.source.name}</span>
                    )}
                  </div>
                  <div className="noticia-content">
                    <h3 className="noticia-title">{noticia.title}</h3>
                    <p className="noticia-description">
                      {noticia.description || noticia.content || "Clique para ler mais..."}
                    </p>
                    <div className="noticia-footer">
                      <div className="noticia-meta">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="noticia-date">{formatarData(noticia.published_at)}</span>
                      </div>
                      {noticia.source?.name && (
                        <span className="noticia-source">{noticia.source.name}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="noticias-footer">
        <button className="btn-voltar" onClick={() => navigate("/home")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar para Home
        </button>
      </footer>

      {/* BOTÃO VOLTAR AO TOPO */}
      <button 
        className={`btn-scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5m0 0l-7 7m7-7l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

export default Noticias;
