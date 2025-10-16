import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'
import AuthService from '../../services/auth.js'
import PasswordInput from '../../components/PasswordInput'

export default function Hospital_Login() {
  const navigate = useNavigate()
  const emailRef = useRef()
  const senhaRef = useRef()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const email = emailRef.current?.value?.trim()
    const senha = senhaRef.current?.value

    // 🔹 Validações básicas
    if (!email) {
      setError('Por favor, digite seu e-mail')
      return
    }

    if (!senha) {
      setError('Por favor, digite sua senha')
      return
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await AuthService.login(email, senha)
      
      if (result.success) {
        // 🔹 Login validado no banco → redireciona para home
        navigate('/home')
      } else {
        setError(result.message || 'E-mail ou senha incorretos')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="login">
      <div className="login__decor-circle" />
      <img className="login__logo" src={logoBranca} alt="DoeVida" />
      <h1 className="login__title">Sou Hospital</h1>

      <form className="login__form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <input 
          className="input input--email" 
          placeholder="E-mail" 
          type="email" 
          ref={emailRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <PasswordInput
          ref={senhaRef}
          placeholder="Senha"
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        
        {error && (
          <div style={{ color: 'red', fontSize: '14px', marginTop: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}

      </form>

      <div className="login__actions">
        <button 
          className="btn btn--primary" 
          type="button" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <button 
          className="btn btn--link" 
          type="button" 
          onClick={() => navigate('/hospital-cadastro')}
          disabled={loading}
        >
          Criar conta?
        </button>
      </div>
    </div>
  )
}
