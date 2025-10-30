import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../style/AnimatedRoutes.css";

import SplashScreen from "../SplashScreen";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Cadastro from "../../pages/Cadastro";
import Recuperar_senha from "../../pages/Recuperar_senha";
import Redefinir_senha from "../../pages/Redefinir_senha";
import SaibaMais from "../../pages/Saiba_mais";
import Hospital_Login from "../../pages/Hospital_Login";
import Hospital_cadastro from "../../pages/Hospital_cadastro";
import Protocolo_agendamento from "../../pages/Protocolo_agendamento";
import Agendamento from "../../pages/Agendamento";
import Hospitais from "../../pages/Hospitais";
import HospitalDetalhes from "../../pages/HospitalDetalhes";
import BancoSangue from "../../pages/BancoSangue";
<<<<<<< HEAD
import Historico from "../../pages/Historico";
=======
import Perfil from "../../pages/Perfil";
>>>>>>> 40e78cd (inicio da tela perfil)

const AnimatedRoutes = () => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Renderiza o conteúdo primeiro */}
      <div className={`app-container ${isAnimating ? 'page-changing' : 'page-stable'}`}>
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<Recuperar_senha />} />
        <Route path="/redefinir-senha" element={<Redefinir_senha />} />
        <Route path="/saiba-mais" element={<SaibaMais />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hospital-cadastro" element={<Hospital_cadastro />} />
        <Route path="/hospital-login" element={<Hospital_Login />} />
        <Route path="/protocolo-agendamento" element={<Protocolo_agendamento />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/hospitais" element={<Hospitais />} />
        <Route path="/hospital/:id" element={<HospitalDetalhes />} />
        <Route path="/banco-sangue" element={<BancoSangue />} />
<<<<<<< HEAD
        <Route path="/historico" element={<Historico />} />
=======
        <Route path="/perfil" element={<Perfil />} />
>>>>>>> 40e78cd (inicio da tela perfil)
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
    
    {/* Splash screen como overlay sobre o conteúdo */}
    {isLoading && <SplashScreen onLoadingComplete={handleLoadingComplete} />}
    </>
  );
};

export default AnimatedRoutes;
