import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'
import FormattedInput from '../../components/jsx/FormattedInput'
import PhotoUpload from '../../components/jsx/PhotoUpload'
import PasswordInput from '../../components/jsx/PasswordInput'
import { InputIcons } from '../../components/jsx/InputIcons'
import { criarUsuario as criarUsuarioAPI } from '../../api/usuario/usuario'

function Cadastro() {
  const navigate = useNavigate()

  // Refs
  const nomeRef = useRef()
  const emailRef = useRef()
  const senhaRef = useRef()
  const confirmarSenhaRef = useRef()
  const cpfRef = useRef()
  const cepRef = useRef()
  const numeroRef = useRef()
  const dataNascimentoRef = useRef()
  const fotoPerfilRef = useRef()
  const photoUploadRef = useRef()

  // Estados
  const [sexos, setSexos] = useState([])
  const [tiposSangue, setTiposSangue] = useState([])
  const [idSexo, setIdSexo] = useState('')
  const [idTipoSanguineo, setIdTipoSanguineo] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  // Carregar dados da API
  useEffect(() => {
    const carregarDados = async () => {
      setLoadingData(true)
      try {
        const respSexo = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/sexo-usuario`)
        const dataSexo = await respSexo.json()
        setSexos(dataSexo?.sexos || sexosPadrao)
      } catch {
        setSexos(sexosPadrao)
      }
      try {
        const respTipo = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/tipo-sanguineo`)
        const dataTipo = await respTipo.json()
        setTiposSangue(dataTipo?.tipos_sanguineos || tiposSanguePadrao)
      } catch {
        setTiposSangue(tiposSanguePadrao)
      }
      setLoadingData(false)
    }
    carregarDados()
  }, [])

  const validarFormulario = () => {
    const nome = nomeRef.current?.value?.trim()
    const email = emailRef.current?.value?.trim()
    const senha = senhaRef.current?.value
    const confirmarSenha = confirmarSenhaRef.current?.value

    if (!nome) return 'Nome é obrigatório'
    if (nome.length > 100) return 'Nome deve ter no máximo 100 caracteres'
    
    if (!email || !email.includes('@')) return 'E-mail deve ser válido'
    if (email.length > 100) return 'E-mail deve ter no máximo 100 caracteres'
    
    if (!senha || senha.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
    if (senha.length > 255) return 'Senha deve ter no máximo 255 caracteres'
    
    if (senha !== confirmarSenha) return 'Senhas não coincidem'
    
    if (!idSexo || isNaN(Number(idSexo))) return 'Selecione seu sexo'
    if (!idTipoSanguineo || isNaN(Number(idTipoSanguineo))) return 'Selecione seu tipo sanguíneo'
    
    // Validar IDs dentro do range esperado
    const sexoNum = Number(idSexo)
    const tipoNum = Number(idTipoSanguineo)
    
    if (sexoNum < 1 || sexoNum > 3) return 'Sexo selecionado é inválido'
    if (tipoNum < 1 || tipoNum > 8) return 'Tipo sanguíneo selecionado é inválido'
    
    return null
  }

  const criarUsuario = async () => {
    setError('')
    setSuccess('')
    const erro = validarFormulario()
    if (erro) return setError(erro)
    setLoading(true)

    try {
      // Preparar foto de perfil
      let fotoPerfilData = null
      if (photoUploadRef.current?.hasFile) {
        try {
          fotoPerfilData = await photoUploadRef.current.getBase64()
          if (fotoPerfilData && fotoPerfilData.length > 500000) {
            setError('Foto muito grande. Tente uma imagem menor.')
            setLoading(false)
            return
          }
        } catch (error) {
          setError('Erro ao processar foto: ' + error.message)
          setLoading(false)
          return
        }
      }

      // Preparar dados do usuário
      const dadosUsuario = {
        nome: nomeRef.current.value.trim(),
        email: emailRef.current.value.trim(),
        senha: senhaRef.current.value,
        id_sexo: Number(idSexo),
        id_tipo_sanguineo: Number(idTipoSanguineo),
        cpf: cpfRef.current?.value?.replace(/\D/g, '') || null,
        cep: cepRef.current?.value?.replace(/\D/g, '') || null,
        numero: numeroRef.current?.value?.replace(/\D/g, '') || null,
        data_nascimento: dataNascimentoRef.current?.value || null,
        foto_perfil: fotoPerfilData
      }
      
      const resultado = await criarUsuarioAPI(dadosUsuario)
      
      if (resultado.success) {
        setSuccess('Conta criada com sucesso! Redirecionando...')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(resultado.message || 'Erro ao criar conta.')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      setError('Erro de conexão. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => e.key === 'Enter' && !loading && criarUsuario()

  if (loadingData) {
    return (
      <div className="cadastro">
        <div className="cadastro__decor-circle" />
        <img className="cadastro__logo" src={logoBranca} alt="DoeVida" />
        <h1 className="cadastro__title">Carregando...</h1>
      </div>
    )
  }

  return (
    <div className="cadastro">
      <div className="cadastro__decor-circle" />
      <img className="cadastro__logo" src={logoBranca} alt="DoeVida" />
      <h1 className="cadastro__title">Sou Doador</h1>

      <form className="cadastro__form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <div className="field">
            <span>Nome Completo *</span>
            <FormattedInput
              ref={nomeRef}
              placeholder="Digite seu nome completo"
              icon={<InputIcons.User />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength={100}
            />
          </div>

          <div className="field">
            <span>E-mail *</span>
            <FormattedInput
              ref={emailRef}
              type="email"
              placeholder="Digite seu e-mail"
              icon={<InputIcons.Email />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength={100}
            />
          </div>

          <div className="field">
            <span>Senha *</span>
            <PasswordInput
              ref={senhaRef}
              placeholder="Digite sua senha"
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength={255}
            />
          </div>

          <div className="field">
            <span>Confirmar Senha *</span>
            <PasswordInput
              ref={confirmarSenhaRef}
              placeholder="Confirme sua senha"
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength={255}
            />
          </div>

          <div className="field">
            <span>CPF</span>
            <FormattedInput
              ref={cpfRef}
              formatType="cpf"
              placeholder="000.000.000-00"
              icon={<InputIcons.Document />}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <div className="field">
            <span>CEP</span>
            <FormattedInput
              ref={cepRef}
              formatType="cep"
              placeholder="00000-000"
              icon={<InputIcons.Location />}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <div className="field">
            <span>Número de Telefone</span>
            <FormattedInput
              ref={numeroRef}
              formatType="phone"
              placeholder="(00) 00000-0000"
              icon={<InputIcons.Phone />}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <div className="field">
            <span>Data de Nascimento</span>
            <FormattedInput
              ref={dataNascimentoRef}
              type="date"
              icon={<InputIcons.Calendar />}
              disabled={loading}
            />
          </div>

          <div className="field">
            <span>Tipo Sanguíneo *</span>
            <div className="select-wrapper">
              <InputIcons.Blood />
              <select className="input input--blood" value={idTipoSanguineo} onChange={e => setIdTipoSanguineo(e.target.value)} disabled={loading}>
                <option value="" disabled>Selecione...</option>
                {tiposSangue.map(tipo => <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <span>Sexo *</span>
            <div className="select-wrapper">
              <InputIcons.Gender />
              <select className="input input--sex" value={idSexo} onChange={e => setIdSexo(e.target.value)} disabled={loading}>
                <option value="" disabled>Selecione...</option>
                {sexos.map(sexo => (
                  <option key={sexo.id} value={sexo.id}>
                    {sexo.sexo === 'MASCULINO' ? 'Masculino' :
                     sexo.sexo === 'FEMININO' ? 'Feminino' : 'Outro'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field field--full">
            <span>Foto de Perfil</span>
            <PhotoUpload
              ref={photoUploadRef}
              placeholder="Adicione sua foto de perfil"
              disabled={loading}
            />
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
      </form>

      <div className="cadastro__actions">
        <button className="btn btn--primary" type="button" onClick={criarUsuario} disabled={loading}>
          {loading ? 'Criando Conta...' : 'Criar Conta'}
        </button>
        <button className="btn btn--link" type="button" onClick={() => navigate('/login')} disabled={loading}>
          Já tem uma conta?
        </button>
      </div>
    </div>
  )
}

export default Cadastro
