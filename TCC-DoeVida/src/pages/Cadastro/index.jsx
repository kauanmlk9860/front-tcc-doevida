import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'

function Cadastro() {
  const navigate = useNavigate()

  // Refs para os campos do formulário
  const nomeRef = useRef()
  const emailRef = useRef()
  const senhaRef = useRef()
  const confirmarSenhaRef = useRef()
  const cpfRef = useRef()
  const cepRef = useRef()
  const numeroRef = useRef()
  const dataNascimentoRef = useRef()
  const fotoPerfilRef = useRef()

  // Estados
  const [sexos, setSexos] = useState([])
  const [tiposSangue, setTiposSangue] = useState([])
  const [idSexo, setIdSexo] = useState('')
  const [idTipoSanguineo, setIdTipoSanguineo] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Dados padrão (fallback)
  const sexosPadrao = [
    { id: 1, sexo: 'MASCULINO' },
    { id: 2, sexo: 'FEMININO' },
    { id: 3, sexo: 'OUTRO' }
  ]

  const tiposSanguePadrao = [
    { id: 1, tipo: 'A+' }, { id: 2, tipo: 'A-' },
    { id: 3, tipo: 'B+' }, { id: 4, tipo: 'B-' },
    { id: 5, tipo: 'AB+' }, { id: 6, tipo: 'AB-' },
    { id: 7, tipo: 'O+' }, { id: 8, tipo: 'O-' }
  ]

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      console.log('Carregando dados de sexos e tipos sanguíneos...')
      setLoadingData(true)

      try {
        // Tenta carregar da API
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/sexo-usuario`)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Dados de sexo recebidos da API:', data)
          
          if (data.status && data.sexos) {
            setSexos(data.sexos)
          } else {
            console.log('Formato de resposta inesperado, usando dados padrão')
            setSexos(sexosPadrao)
          }
        } else {
          console.log('API não respondeu corretamente, usando dados padrão')
          setSexos(sexosPadrao)
        }
      } catch (error) {
        console.log('Erro ao carregar sexos da API, usando dados padrão:', error)
        setSexos(sexosPadrao)
      }

      try {
        // Tenta carregar tipos sanguíneos da API
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/tipo-sanguineo`)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Dados de tipos sanguíneos recebidos da API:', data)
          
          if (data.status && data.tipos_sanguineos) {
            setTiposSangue(data.tipos_sanguineos)
          } else {
            console.log('Formato de resposta inesperado, usando dados padrão')
            setTiposSangue(tiposSanguePadrao)
          }
        } else {
          console.log('API não respondeu corretamente, usando dados padrão')
          setTiposSangue(tiposSanguePadrao)
        }
      } catch (error) {
        console.log('Erro ao carregar tipos sanguíneos da API, usando dados padrão:', error)
        setTiposSangue(tiposSanguePadrao)
      }

      setLoadingData(false)
      console.log('Carregamento de dados concluído')
    }

    carregarDados()
  }, [])

  // Validação do formulário
  const validarFormulario = () => {
    const nome = nomeRef.current?.value?.trim()
    const email = emailRef.current?.value?.trim()
    const senha = senhaRef.current?.value
    const confirmarSenha = confirmarSenhaRef.current?.value

    if (!nome) return 'Nome é obrigatório'
    if (nome.length < 2) return 'Nome deve ter pelo menos 2 caracteres'
    if (!email) return 'E-mail é obrigatório'
    if (!email.includes('@')) return 'E-mail deve ser válido'
    if (!senha) return 'Senha é obrigatória'
    if (senha.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
    if (senha !== confirmarSenha) return 'Senhas não coincidem'
    if (!idSexo) return 'Selecione seu sexo'
    if (!idTipoSanguineo) return 'Selecione seu tipo sanguíneo'

    // Validações adicionais para IDs
    const sexoId = Number(idSexo)
    const tipoSanguineoId = Number(idTipoSanguineo)
    
    if (isNaN(sexoId) || sexoId < 1) return 'ID do sexo inválido'
    if (isNaN(tipoSanguineoId) || tipoSanguineoId < 1) return 'ID do tipo sanguíneo inválido'

    console.log('=== VALIDAÇÃO CONCLUÍDA ===')
    console.log('Nome:', nome)
    console.log('Email:', email)
    console.log('Senha length:', senha.length)
    console.log('ID Sexo:', sexoId, 'Tipo:', typeof sexoId)
    console.log('ID Tipo Sanguíneo:', tipoSanguineoId, 'Tipo:', typeof tipoSanguineoId)
    console.log('==========================')

    return null
  }

  // Função para criar usuário
  const criarUsuario = async () => {
    setError('')
    setSuccess('')

    const erroValidacao = validarFormulario()
    if (erroValidacao) {
      setError(erroValidacao)
      return
    }

    setLoading(true)

    // Dados do usuário exatamente como a documentação da API especifica
    const dadosUsuario = {
      nome: nomeRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      senha: senhaRef.current.value, // Não é senha_hash, é senha mesmo
      cpf: cpfRef.current?.value?.trim() || null,
      cep: cepRef.current?.value?.trim() || null,
      numero: numeroRef.current?.value?.trim() || null,
      data_nascimento: dataNascimentoRef.current?.value || null,
      foto_perfil: fotoPerfilRef.current?.value?.trim() || null,
      id_sexo: Number(idSexo),
      id_tipo_sanguineo: Number(idTipoSanguineo)
    }

    try {
      console.log('=== DADOS ENVIADOS PARA CRIAR USUÁRIO ===')
      console.log('URL:', `${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/usuario`)
      console.log('Método:', 'POST')
      console.log('Headers:', { 'Content-Type': 'application/json' })
      console.log('Body:', JSON.stringify(dadosUsuario, null, 2))
      console.log('=========================================')

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosUsuario)
      })

      console.log('=== RESPOSTA DA API ===')
      console.log('Status:', response.status)
      console.log('Status Text:', response.statusText)
      console.log('Headers:', Object.fromEntries(response.headers.entries()))

      const resultado = await response.json()
      console.log('Body da resposta:', JSON.stringify(resultado, null, 2))
      console.log('=====================')

      if (response.ok && resultado.status) {
        setSuccess('Conta criada com sucesso! Redirecionando para login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        // Log detalhado do erro
        console.error('=== ERRO AO CRIAR USUÁRIO ===')
        console.error('Status HTTP:', response.status)
        console.error('Mensagem do servidor:', resultado.message)
        console.error('Dados completos do erro:', resultado)
        console.error('=============================')
        
        setError(resultado.message || `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('=== ERRO DE CONEXÃO ===')
      console.error('Tipo do erro:', error.constructor.name)
      console.error('Mensagem:', error.message)
      console.error('Stack:', error.stack)
      console.error('=======================')
      
      setError('Erro de conexão. Verifique se o backend está rodando e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Função para lidar com Enter nos campos
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !loading) {
      criarUsuario()
    }
  }

  if (loadingData) {
    return (
      <div className="cadastro">
        <div className="cadastro__decor-circle" />
        <img className="cadastro__logo" src={logoBranca} alt="DoeVida" />
        <h1 className="cadastro__title">Carregando...</h1>
        <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
          <p>Preparando formulário de cadastro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cadastro">
      <div className="cadastro__decor-circle" />
      <img className="cadastro__logo" src={logoBranca} alt="DoeVida" />
      <h1 className="cadastro__title">Sou Doador</h1>

      <form className="cadastro__form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <input 
          className="input input--name" 
          placeholder="Nome Completo *" 
          name="nome" 
          type="text" 
          ref={nomeRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
        />
        
        <input 
          className="input input--email" 
          placeholder="Digite seu E-mail *" 
          name="email" 
          type="email" 
          ref={emailRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
        />
        
        <input 
          className="input input--password" 
          placeholder="Digite sua Senha *" 
          name="senha" 
          type="password" 
          ref={senhaRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          minLength={6}
        />
        
        <input 
          className="input input--password-confirm" 
          placeholder="Confirme sua Senha *" 
          name="confirmar-senha" 
          type="password" 
          ref={confirmarSenhaRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          minLength={6}
        />
        
        <input 
          className="input input--cpf" 
          placeholder="Digite seu CPF" 
          name="cpf" 
          type="text" 
          ref={cpfRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        
        <input 
          className="input input--cep" 
          placeholder="Digite seu CEP" 
          name="cep" 
          type="text" 
          ref={cepRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        
        <input 
          className="input input--number" 
          placeholder="Número de Telefone" 
          name="numero" 
          type="text" 
          ref={numeroRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        
        <input 
          className="input input--date" 
          placeholder="Data de Nascimento" 
          name="data-nascimento" 
          type="date" 
          ref={dataNascimentoRef}
          disabled={loading}
        />

        <select
          className="input input--blood"
          value={idTipoSanguineo}
          onChange={e => setIdTipoSanguineo(e.target.value)}
          disabled={loading}
          required
        >
          <option value="" disabled>Selecione seu tipo sanguíneo *</option>
          {tiposSangue.map(tipo => (
            <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
          ))}
        </select>

        <select
          className="input input--sex"
          value={idSexo}
          onChange={e => setIdSexo(e.target.value)}
          disabled={loading}
          required
        >
          <option value="" disabled>Selecione seu sexo *</option>
          {sexos.map(sexo => (
            <option key={sexo.id} value={sexo.id}>
              {sexo.sexo === 'MASCULINO' ? 'Masculino' : 
               sexo.sexo === 'FEMININO' ? 'Feminino' : 
               sexo.sexo === 'OUTRO' ? 'Outro' : sexo.sexo}
            </option>
          ))}
        </select>

        <input 
          className="input input--photo" 
          placeholder="URL da Foto de Perfil (opcional)" 
          name="foto-perfil" 
          type="url" 
          ref={fotoPerfilRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        {error && (
          <div style={{ 
            color: '#ff4444', 
            fontSize: '14px', 
            marginTop: '10px', 
            textAlign: 'center',
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ff4444'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            color: '#00ff88', 
            fontSize: '14px', 
            marginTop: '10px', 
            textAlign: 'center',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #00ff88'
          }}>
            {success}
          </div>
        )}
      </form>

      <div className="cadastro__actions">
        <button 
          className="btn btn--primary" 
          type="button" 
          onClick={criarUsuario}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Criando Conta...' : 'Criar Conta'}
        </button>
        
        <button 
          className="btn btn--link" 
          type="button" 
          onClick={() => navigate('/login')}
          disabled={loading}
        >
          Já tem uma conta?
        </button>
      </div>
    </div>
  )
}

export default Cadastro