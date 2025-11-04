import { useEffect, useRef, useState } from 'react'
import './style.css'
import logoSemFundo from '../../assets/icons/logo_semfundo.png'
import { useNavigate } from 'react-router-dom'
import AuthService from '../../services/auth.js'

function Recuperar_senha() {
  const navigate = useNavigate()
  const emailRef = useRef()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {}, []) 

  const handleRecuperarSenha = async () => {
    const email = emailRef.current?.value?.trim()

    if (!email) {
      setError('Por favor, digite seu e-mail')
      return
    }

    if (!email.includes('@')) {
      setError('Por favor, digite um e-mail válido')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await AuthService.recuperarSenha(email)
      
      if (result.success) {
        setSuccess('Código de recuperação enviado para seu e-mail!')
        setTimeout(() => {
          navigate('/redefinir-senha')
        }, 3000)
      } else {
        setError(result.message || 'Erro ao enviar código de recuperação')
      }
    } catch (error) {
      console.error('Erro na recuperação:', error)
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleRecuperarSenha()
    }
  }

  return (
    <div className="rec-senha">
      <div className="rec-senha__decor"></div>
      <img className="rec-senha__logo" src={logoSemFundo} alt="DoeVida" />
      <h1 className="rec-senha__title">Recuperar Senha</h1>
      
      <form className="rec-senha__form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <input 
          id="email_recuperacao" 
          className="rec-senha__input rec-senha__input--email" 
          placeholder="Digite seu E-mail" 
          name="email" 
          type="email"
          ref={emailRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        {error && (
          <div style={{ color: 'red', fontSize: '14px', marginTop: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: 'green', fontSize: '14px', marginTop: '10px', textAlign: 'center' }}>
            {success}
          </div>
        )}
      </form>

      <div className="rec-senha__actions">
        <button 
          className="rec-senha__submit" 
          type="button"
          onClick={handleRecuperarSenha}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Concluir'}
        </button>
        <button
          type="button"
          className="rec-senha__back"
          onClick={() => navigate('/login')}
          disabled={loading}
        >
          Voltar ao Login
        </button>
      </div>
    </div>
  )
}

export default Recuperar_senha
