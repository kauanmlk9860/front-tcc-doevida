import { useNavigate } from "react-router-dom";
import "./style.css";
import logoSemFundo from "../../assets/icons/logo_semfundo.png";
import pessoas from "../../assets/pessoas.png";
import { useUser } from "../../contexts/UserContext";

function SaibaMais() {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  const handleDoadorClick = () => {
    if (isLoggedIn) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  const handleHospitalClick = () => {
    navigate("/hospital-login");
  };

  const handleVoltarClick = () => {
    navigate(-1);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <img src={logoSemFundo} alt="Logo DoeVida" className="logo-img" />
          </div>
          <h1 className="logo-text">DOEVIDA</h1>
        </div>

        <nav className="nav-buttons">
          <button className="btn-donor" onClick={handleDoadorClick} type="button">
            Sou Doador
          </button>
          <button className="btn-hospital" onClick={handleHospitalClick} type="button">
            Sou Hospital
          </button>
        </nav>
      </header>

      {/* Botão X (voltar) */}
      <button className="btn-close" onClick={handleVoltarClick} type="button">
        ×
      </button>
      
      {/* Main Content */}
      <main className="main" role="main">
        <section className="about-hero">
          <h2 className="about-title">Saiba Mais</h2>
          <p className="about-subtitle">Conheça nossa missão e como você pode fazer a diferença</p>
        </section>

        <section className="about-content">
          <div className="about-grid">
            {/* Card de Imagem */}
            <div className="about-image-card">
              <img
                src={pessoas}
                alt="Pessoas doando sangue"
                className="about-image"
              />
            </div>

            {/* Card de Texto */}
            <div className="about-text-card">
              <h3 className="card-title">Nossa História</h3>
              <p className="card-text">
                O projeto DOEVIDA nasceu da vontade de transformar solidariedade em impacto real. 
                Percebemos que muitas pessoas têm o desejo de doar sangue, mas nem sempre sabem como, 
                quando ou onde. Foi assim que criamos essa iniciativa para aproximar doadores e 
                hemocentros, tornando o processo mais acessível, humano e eficiente.
              </p>
            </div>

            {/* Card de Missão */}
            <div className="about-text-card">
              <h3 className="card-title">Nossa Missão</h3>
              <p className="card-text">
                Mais do que uma plataforma, somos uma ponte entre quem quer ajudar e quem precisa. 
                Acreditamos que cada gota conta, e que juntos podemos salvar milhares de vidas.
              </p>
            </div>
          </div>

          {/* Quote Section */}
          <div className="quote-container">
            <blockquote className="quote-text">
              "Uma atitude salva até quatro vidas, seja você essa atitude."
            </blockquote>
          </div>
        </section>
      </main>

    </div>
  );
}

export default SaibaMais;
