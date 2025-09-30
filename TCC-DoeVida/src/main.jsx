import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import RecuperarSenha from './pages/Recuperar_senha'
import SaibaMais from './pages/Saiba_mais'
import Recuperar_senha from './pages/Recuperar_senha'
import Redefinir_senha from './pages/Redefinir_senha'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SaibaMais/>
  </StrictMode>
)
