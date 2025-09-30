import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import RecuperarSenha from './pages/Recuperar_senha'
import SaibaMais from './pages/Saiba_mais'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SaibaMais/>
    {/* <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter> */}
  </StrictMode>
)
