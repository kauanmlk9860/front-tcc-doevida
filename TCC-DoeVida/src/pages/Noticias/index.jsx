import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logoSemFundo from "../../assets/icons/logo_semfundo.png";
import { buscarNoticiasPorTermo, buscarNoticiasPorCategoria } from "../../services/newsApi";
import { useUser } from "../../contexts/UserContext";

// Placeholder para imagens quebradas
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80";

function Noticias() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ultimas");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const gridRef = useRef(null);

  const categorias = [
    { id: "ultimas", label: "Últimas", query: "", icon: "🌐" },
    { id: "saude", label: "Saúde", query: "saúde", icon: "🏥" },
    { id: "ciencia", label: "Ciência", query: "ciência", icon: "🔬" },
    { id: "tecnologia", label: "Tecnologia", query: "tecnologia", icon: "💻" },
    { id: "geral", label: "Geral", query: "geral", icon: "📰" },
  ];

  // Carregar notícias iniciais
  const carregarNoticias = useCallback(async (categoria = "saude", reset = true) => {
    console.log('🔄 Iniciando carregamento de notícias...', categoria);
    try {
      if (reset) {
        setLoading(true);
        setNoticias([]);
        setCurrentPage(1);
      }
      
      const categoriaObj = categorias.find(c => c.id === categoria);
      const query = categoriaObj?.query || "saúde doação sangue";
      
      console.log('📰 Buscando notícias com query:', query);
      const result = await buscarNoticiasPorTermo(query, 1);
      console.log('✅ Resultado da busca:', result);
      
      if (result.success) {
        console.log('✅ Notícias carregadas:', result.data.length);
        setNoticias(result.data);
        setHasMore(result.hasMore || result.nextPage !== null);
        setTotalResults(result.totalResults || result.data.length);
        setError("");
      } else {
        console.error('❌ Erro na busca:', result.message);
        setError(result.message || "Erro ao carregar notícias");
      }
    } catch (err) {
      console.error("❌ Erro ao carregar notícias:", err);
      setError("Erro ao carregar notícias. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar mais notícias (paginação)
  const carregarMaisNoticias = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const categoriaObj = categorias.find(c => c.id === activeCategory);
      const query = categoriaObj?.query || "saúde doação sangue";
      const nextPageNum = currentPage + 1;
      
      console.log('📄 Carregando página:', nextPageNum);
      const result = await buscarNoticiasPorTermo(query, nextPageNum);
      
      if (result.success) {
        setNoticias(prev => [...prev, ...result.data]);
        setCurrentPage(nextPageNum);
        setHasMore(result.nextPage !== null);
      }
    } catch (err) {
      console.error("Erro ao carregar mais notícias:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Buscar notícias por termo
  const buscarPorTermo = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    try {
      setLoading(true);
      setNoticias([]);
      setCurrentPage(1);
      
      const result = await buscarNoticiasPorTermo(searchTerm, 1);
      
      if (result.success) {
        setNoticias(result.data);
        setHasMore(result.nextPage !== null);
        setError("");
      } else {
        setError(result.message || "Nenhuma notícia encontrada");
      }
    } catch (err) {
      console.error("Erro na busca:", err);
      setError("Erro ao buscar notícias");
    } finally {
      setLoading(false);
    }
  };

  // Mudar categoria
  const mudarCategoria = (categoriaId) => {
    setActiveCategory(categoriaId);
    setSearchTerm("");
    carregarNoticias(categoriaId, true);
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

  useEffect(() => {
    carregarNoticias("ultimas", true);
  }, [carregarNoticias]);

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

      {/* HERO SECTION */}
      <section className="noticias-hero">
        <div className="noticias-hero-content">
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
      </section>

      {/* SEARCH BAR */}
      <section className="noticias-search-section">
        <form className="noticias-search-form" onSubmit={buscarPorTermo}>
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
      {!loading && !error && noticias.length > 0 && (
        <div style={{ textAlign: 'center', padding: '0 2rem' }}>
          <div className="results-count">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{totalResults > 0 ? `${totalResults} notícias encontradas` : `${noticias.length} notícias`}</span>
          </div>
        </div>
      )}

      {/* CONTEÚDO */}
      <main className="noticias-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Carregando notícias...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#990410" strokeWidth="2"/>
              <path d="M12 8v4m0 4h.01" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="error-text">{error}</p>
            <button className="btn-retry" onClick={() => carregarNoticias(activeCategory, true)}>
              Tentar Novamente
            </button>
          </div>
        ) : noticias.length === 0 ? (
          <div className="empty-container">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="empty-text">Nenhuma notícia encontrada</p>
          </div>
        ) : (
          <>
            <div className="noticias-grid" ref={gridRef}>
              {noticias.map((noticia, index) => (
                <article
                  key={noticia.id || index}
                  className="noticia-card"
                  style={{ '--index': index }}
                  onClick={() => abrirNoticia(noticia)}
                >
                  <div className="noticia-image-wrapper">
                    <img
                      src={noticia.image || PLACEHOLDER_IMAGE}
                      alt={noticia.title}
                      className="noticia-image"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
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

            {hasMore && (
              <div className="load-more-container">
                <button
                  className="btn-load-more"
                  onClick={carregarMaisNoticias}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="spinner-small"></div>
                      Carregando...
                    </>
                  ) : (
                    <>
                      Carregar mais notícias
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
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
