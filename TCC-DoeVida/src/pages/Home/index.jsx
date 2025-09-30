import { useNavigate } from 'react-router-dom'
import './style.css'
import Logo from '../../assets/Logo_Branca.png'

export default function Home() {
//   const navigate = useNavigate()

  return (
    <div className="home">
      {/* HEADER (tudo à esquerda) */}
      <header className="home__header" aria-label="Cabeçalho">
        <div className="home__left">
          <img className="home__logo" src={Logo} alt="DOEVIDA" />
          <div className="home__actions">
            <button className="btn btn--ghost" onClick={() => navigate('/cadastro')}>
              Sou Doador
            </button>
            <button className="btn btn--primary" onClick={() => navigate('/hospital')}>
              Sou Hospital
            </button>
          </div>
        </div>
      </header>

      <main className="home__main">
        {/* HERO (título sobreposto à imagem) */}
        <section className="hero" aria-label="Destaque">
          <div className="hero__stage">
            <img
              className="hero__image"
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format"
              alt="Mãos segurando coração com cruz"
            />

            {/* Setas do carrossel */}
            <button className="hero__nav hero__nav--prev" aria-label="Imagem anterior">←</button>
            <button className="hero__nav hero__nav--next" aria-label="Próxima imagem">→</button>

            {/* Overlay não atrapalha as setas */}
            <div className="hero__overlay" aria-hidden="false">
              <h1 className="hero__title">
                Doe sangue,<br />salve até 4 vidas
              </h1>
              <button
                className="btn btn--primary hero__cta"
                onClick={() => navigate('/agendar')}
              >
                Agendar Doação
              </button>
            </div>
          </div>
        </section>

        {/* KPI colada na esquerda */}
        <section className="kpi" aria-label="Impacto">
          <div className="kpi__pill">
            <strong className="kpi__number">+12.340</strong>
            <span className="kpi__text">vidas salvas<br />este ano</span>
          </div>
          <button className="link link--more" onClick={() => navigate('/saiba-mais')}>
            Saiba Mais
          </button>
        </section>

        {/* CARDS (logo abaixo do carrossel) */}
        <section className="features" aria-label="Acessos rápidos">
          <button className="feature-card" onClick={() => navigate('/hospitais')}>
            <img className="feature-card__icon" src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png" alt="" />
            <span className="feature-card__label">Hospitais</span>
          </button>

          <button className="feature-card" onClick={() => navigate('/banco-de-sangue')}>
            <img className="feature-card__icon" src="https://cdn-icons-png.flaticon.com/512/2966/2966322.png" alt="" />
            <span className="feature-card__label">Banco de Sangue</span>
          </button>

          <button className="feature-card" onClick={() => navigate('/historico')}>
            <img className="feature-card__icon" src="https://cdn-icons-png.flaticon.com/512/2097/2097632.png" alt="" />
            <span className="feature-card__label">Histórico</span>
          </button>

          <button className="feature-card" onClick={() => navigate('/registrar')}>
            <img className="feature-card__icon" src="https://cdn-icons-png.flaticon.com/512/2920/2920222.png" alt="" />
            <span className="feature-card__label">Registrar Doação</span>
          </button>
        </section>

        {/* ALERTA (abaixo dos cards) */}
        <aside className="alert" role="alert" aria-live="polite">
          <span className="alert__icon">!</span>
          <span className="alert__text">Estoque de sangue O- está em nível crítico!</span>
        </aside>

        {/* FOOTER bonitinho */}
        <footer className="home__footer" aria-label="Rodapé">
          <nav className="footer__nav">
            <button className="link" onClick={() => navigate('/privacidade')}>Política de Privacidade</button>
            <button className="link" onClick={() => navigate('/termos')}>Termos de Uso</button>
            <button className="link" onClick={() => navigate('/contato')}>Contato</button>
          </nav>
          <p className="footer__copy">© {new Date().getFullYear()} DOEVIDA — Todos os direitos reservados.</p>
        </footer>
      </main>
    </div>
  )
}
