import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logoBranca from "../../assets/Logo_Branca.png";
import pessoas from "../../assets/pessoas.png";
import AuthService from "../../services/auth.js";

function SaibaMais() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = AuthService.isLoggedIn();
    setIsLoggedIn(loggedIn);
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
      <main className="main-content">
        <h2 className="hero-title">Saiba Mais</h2>

        <div className="content-wrapper">
          <div className="illustration-container">
            <img
              src={pessoas}
              alt="Ilustração de duas pessoas doando sangue"
              className="illustration"
            />
          </div>

          <p className="description-text">
            <strong>
              O projeto DOEVIDA nasceu da vontade de transformar solidariedade em impacto real.
            </strong>{" "}
            Percebemos que muitas pessoas têm o desejo de doar sangue, mas nem sempre sabem como,
            quando ou onde. Foi assim que criamos essa iniciativa para aproximar doadores e
            hemocentros, tornando o processo mais acessível, humano e eficiente.
          </p>
        </div>
      </main>
    </div>
  );
}

export default SaibaMais;
