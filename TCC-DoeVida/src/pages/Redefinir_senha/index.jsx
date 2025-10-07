import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'
import AuthService from '../../services/auth.js'

function Redefinir_senha() {
  const navigate = useNavigate()
  const codigoRef = useRef()
  const senhaNovaRef = useRef()
  const senhaConfirmarRef = useRef()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
  }, []) 

  const handleRedefinirSenha = async () => {
    const codigo = codigoRef.current?.value?.trim()
    const senhaNova = senhaNovaRef.current?.value
    const senhaConfirmar = senhaConfirmarRef.current?.value

    console.log('=== VALIDANDO DADOS ===');
    console.log('Código:', codigo);
    console.log('Nova senha length:', senhaNova?.length);
    console.log('Senhas coincidem:', senhaNova === senhaConfirmar);

    // Validações
    if (!codigo) {
      setError('Por favor, digite o código de recuperação')
      return
    }

    if (codigo.length < 4) {
      setError('Código deve ter pelo menos 4 caracteres')
      return
    }

    if (!senhaNova) {
      setError('Por favor, digite a nova senha')
      return
    }

    if (senhaNova.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (senhaNova !== senhaConfirmar) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Chamando AuthService.redefinirSenha...');
      const result = await AuthService.redefinirSenha(codigo, senhaNova)
      
      console.log('Resultado do serviço:', result);
      
      if (result.success) {
        setSuccess('Senha redefinida com sucesso! Redirecionando para login...')
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setError(result.message || 'Erro ao redefinir senha')
      }
    } catch (error) {
      console.error('Erro no componente:', error)
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleRedefinirSenha()
    }
  }

  return (
    <div className='container'>
      <div className='bola-cortada'></div>
      
      <img 
        id='Logo_Branca' 
        src={Logo_Branca} 
        alt="Logo DoeVida" 
      />
      
      <h1>Redefinir Senha</h1>

      <form id='caixa-recuperacao' onSubmit={(e) => e.preventDefault()}>
        <div className="input-container">
          <input 
            id='codigo_recuperacao'
            placeholder='Digite o código de recuperação' 
            name='codigo_recuperacao' 
            type='text'
            ref={codigoRef}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>
        <div className="input-container">
          <input 
            id='senha_nova' 
            placeholder='Digite sua nova senha' 
            name='senha_nova' 
            type='password'
            ref={senhaNovaRef}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>
        <div className="input-container">
          <input 
            id='senha_confirmar' 
            placeholder='Confirme sua nova senha' 
            name='senha_confirmar' 
            type='password'
            ref={senhaConfirmarRef}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>

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

      <div className='botoes'>
        <button 
          id='concluir-recuperacao' 
          type='button'
          onClick={handleRedefinirSenha}
          disabled={loading}
        >
          {loading ? 'Redefinindo...' : 'Concluir nova senha'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/login')}
          disabled={loading}
          style={{ 
            marginTop: '10px', 
            background: 'transparent', 
            border: 'none', 
            color: '#666', 
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          Voltar ao Login
        </button>
      </div>
    </div>
  )
}

export default Redefinir_senha
