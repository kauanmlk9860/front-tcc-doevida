import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Redefinir_senha from './pages/Redefinir_senha'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)
