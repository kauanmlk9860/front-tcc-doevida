import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Redefinir_senha from './pages/Redefinir_senha'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Redefinir_senha />
  </StrictMode>,
)
