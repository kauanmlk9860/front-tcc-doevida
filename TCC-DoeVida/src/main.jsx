import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Recuperar_senha from './pages/Recuperar_senha'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Cadastro />
  </StrictMode>,
)
