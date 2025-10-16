import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../style/AnimatedRoutes.css";

import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Cadastro from "../../pages/Cadastro";
import Recuperar_senha from "../../pages/Recuperar_senha";
import Redefinir_senha from "../../pages/Redefinir_senha";
import SaibaMais from "../../pages/Saiba_mais";
import Hospital_Login from "../../pages/Hospital_Login";
import Hospital_cadastro from "../../pages/Hospital_cadastro";
import Protocolo_agendamento from "../../pages/Protocolo_agendamento";

const AnimatedRoutes = () => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default AnimatedRoutes;
