import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoSemFundo from '../../assets/icons/logo_semfundo.png'
import { loginHospital } from '../../api/hospital/auth.js'
import { useUser } from '../../contexts/UserContext'
import PasswordInput from '../../components/jsx/PasswordInput'

export default function Hospital_Login() {
  const navigate = useNavigate()
  const { setUser, setIsLoggedIn } = useUser()
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
      const result = await loginHospital(email, senha)
      
      if (result.success && result.token) {
        // Salvar token e dados do hospital
        localStorage.setItem('token', result.token)
        localStorage.setItem('usuario', JSON.stringify(result.hospital))
        
        // Atualizar contexto
        setUser(result.hospital)
        setIsLoggedIn(true)
        
        console.log('✅ Hospital logado com sucesso:', result.hospital)
        
        // Redirecionar para home do hospital
        navigate('/hospital-home')
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
      <img className="login__logo" src={logoSemFundo} alt="DoeVida" />
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
