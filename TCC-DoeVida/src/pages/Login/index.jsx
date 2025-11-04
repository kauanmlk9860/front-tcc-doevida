import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoSemFundo from '../../assets/icons/logo_semfundo.png'
import PasswordInput from '../../components/jsx/PasswordInput'
import { useUser } from '../../contexts/UserContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useUser()
  const emailRef = useRef()
  const senhaRef = useRef()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const email = emailRef.current?.value?.trim()
    const senha = senhaRef.current?.value

    // Validações básicas
    if (!email) {
      setError('Por favor, digite seu e-mail')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor, digite um e-mail válido')
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
      const result = await login(email, senha)
      
      if (result.success) {
        navigate('/home')
      } else {
        setError(result.message || 'E-mail ou senha incorretos')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro de conexão. Verifique se o servidor está rodando.')
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
      <img className="login__logo" src={logoSemFundo} alt="DoeVida" />
      <h1 className="login__title">Sou Doador</h1>

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

        <button 
          type="button" 
          className="login__forgot" 
          onClick={() => navigate('/recuperar-senha')}
          disabled={loading}
        >
          Esqueci minha senha
        </button>
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
          onClick={() => navigate('/cadastro')}
          disabled={loading}
        >
          Criar conta?
        </button>
      </div>
    </div>
  )
}
