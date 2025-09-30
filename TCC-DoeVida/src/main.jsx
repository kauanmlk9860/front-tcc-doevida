import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
<<<<<<< HEAD
import RecuperarSenha from './pages/Recuperar_senha'
import SaibaMais from './pages/Saiba_mais'
=======
import Recuperar_senha from './pages/Recuperar_senha'
import Redefinir_senha from './pages/Redefinir_senha'
>>>>>>> 194d1b1dc377b92c2321d45021448e6e9e38d76b
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SaibaMais/>
    {/* <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<Recuperar_senha />} />
        <Route path="/redefinir-senha" element={<Redefinir_senha />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter> */}
  </StrictMode>
)
