import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logoBranca from "../../assets/Logo_Branca.png";
import pessoas from "../../assets/pessoas.png";
import AuthService from "../../services/auth.js";

function SaibaMais() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loggedIn = AuthService.isLoggedIn();
    setIsLoggedIn(loggedIn);
    
    // Animação de entrada
    setTimeout(() => setIsVisible(true), 100);

    // Intersection Observer para animações ao scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleDoadorClick = () => {
    if (isLoggedIn) {
      navigate("/home"); // já logado, vai para home
    } else {
      navigate("/cadastro"); // não logado, vai para cadastro
    }
  };

  const handleVoltarClick = () => {
    navigate(-1); // volta para a página anterior
  };

  return (
    <div className="app">
      {/* Decorative Circles */}
      <div className="decorative-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-6"></div>
        <div className="circle circle-7"></div>
        <div className="circle circle-8"></div>
        <div className="circle circle-9"></div>
        <div className="circle circle-10"></div>
        <div className="circle circle-11"></div>
        <div className="circle circle-12"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <img src={logoBranca} alt="Logo DoeVida" className="logo-img" />
          </div>
          <h1 className="logo-text">DOEVIDA</h1>
        </div>

        <nav className="nav-buttons">
          <button className="btn-donor" onClick={handleDoadorClick}>
            Sou Doador
          </button>
          <button className="btn-hospital">Sou Hospital</button>
        </nav>
      </header>

      {/* Botão X (voltar) */}
      <button className="btn-close" onClick={handleVoltarClick}>
        ×
      </button>
      
      {/* Main Content */}
      <main className={`main-content ${isVisible ? 'visible' : ''}`}>
        <h2 className="hero-title animate-on-scroll">Saiba Mais</h2>

        <div className="content-wrapper">
          {/* Ilustração com efeitos */}
          <div className="illustration-container animate-on-scroll">
            <div className="illustration-glow"></div>
            <img
              src={pessoas}
              alt="Ilustração de duas pessoas doando sangue"
              className="illustration"
            />
          </div>

          {/* Texto principal */}
          <div className="text-content animate-on-scroll">
            <p className="description-text">
              O projeto DOEVIDA nasceu da vontade de transformar solidariedade em impacto real. 
              Percebemos que muitas pessoas têm o desejo de doar sangue, mas nem sempre sabem como, 
              quando ou onde. Foi assim que criamos essa iniciativa para aproximar doadores e 
              hemocentros, tornando o processo mais acessível, humano e eficiente.
            </p>
            
            <p className="description-text">
              Mais do que uma plataforma, somos uma ponte entre quem quer ajudar e quem precisa. 
              Acreditamos que cada gota conta, e que juntos podemos salvar milhares de vidas.
            </p>
          </div>

          {/* Frase de Efeito */}
          <div className="quote-section animate-on-scroll">
            <blockquote className="quote-text">
              "Uma atitude salva até quatro vidas, seja você essa atitude."
            </blockquote>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SaibaMais;
