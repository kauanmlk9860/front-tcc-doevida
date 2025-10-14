import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import SaibaMais from "./pages/Saiba_mais";
import Recuperar_senha from "./pages/Recuperar_senha";
import Redefinir_senha from "./pages/Redefinir_senha";
import Home from "./pages/Home";
import Hospital_Login from "./pages/Hospital_login";
import Hospital_recuperar_senha from "./pages/Recuperar_senha_hospital";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<Recuperar_senha />} />
        <Route path="/redefinir-senha" element={<Redefinir_senha />} />
        <Route path="/saiba-mais" element={<SaibaMais />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hospital-login" element={<Hospital_Login />} />
        <Route path="/hospital-recuperar-senha" element={<Hospital_recuperar_senha />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
