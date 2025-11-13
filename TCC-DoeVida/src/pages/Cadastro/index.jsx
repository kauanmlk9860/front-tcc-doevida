import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoSemFundo from '../../assets/icons/logo_semfundo.png'
import FormattedInput from '../../components/jsx/FormattedInput'
import PhotoUpload from '../../components/jsx/PhotoUpload'
import PasswordInput from '../../components/jsx/PasswordInput'
import { InputIcons } from '../../components/jsx/InputIcons'
import { criarUsuario as criarUsuarioAPI } from '../../api/usuario/usuario'
import { createUserDev } from '../../services/httpDev'
import AuthService from '../../services/auth.js'
import { uploadBase64ToAzure, validateSasToken } from '../../services/azureStorage'
import { useProfilePhoto } from '../../hooks/useProfilePhoto'
import { useUser } from '../../contexts/UserContext'

function Cadastro() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { getPhotoUrl } = useProfilePhoto(user)

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
    const abortController = new AbortController()
    let isMounted = true

    const carregarDados = async () => {
      if (!isMounted) return
      setLoadingData(true)
      
      try {
        const respSexo = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/sexo-usuario`,
          { signal: abortController.signal }
        )
        if (!isMounted) return
        const dataSexo = await respSexo.json()
        if (isMounted) {
          setSexos(dataSexo?.sexos || sexosPadrao)
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          setSexos(sexosPadrao)
        }
      }
      
      try {
        const respTipo = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/tipo-sanguineo`,
          { signal: abortController.signal }
        )
        if (!isMounted) return
        const dataTipo = await respTipo.json()
        if (isMounted) {
          setTiposSangue(dataTipo?.tipos_sanguineos || tiposSanguePadrao)
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          setTiposSangue(tiposSanguePadrao)
        }
      }
      
      if (isMounted) {
        setLoadingData(false)
      }
    }
    
    carregarDados()

    // Cleanup function
    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  const validarFormulario = () => {
    const nome = nomeRef.current?.value?.trim()
    const email = emailRef.current?.value?.trim()
    const senha = senhaRef.current?.value
    const confirmarSenha = confirmarSenhaRef.current?.value

    // Campos obrigatórios
    if (!nome || nome.length === 0) return 'Nome é obrigatório'
    if (!email || email.length === 0) return 'E-mail é obrigatório'
    if (!senha || senha.length === 0) return 'Senha é obrigatória'
    if (!confirmarSenha || confirmarSenha.length === 0) return 'Confirmação de senha é obrigatória'
    if (!idSexo || idSexo === '') return 'Sexo é obrigatório'
    if (!idTipoSanguineo || idTipoSanguineo === '') return 'Tipo sanguíneo é obrigatório'
    
    // Validações de formato e tamanho
    if (nome.length > 100) return 'Nome deve ter no máximo 100 caracteres'
    if (!email.includes('@') || !email.includes('.')) return 'E-mail deve ser válido'
    if (email.length > 100) return 'E-mail deve ter no máximo 100 caracteres'
    if (senha.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
    if (senha.length > 255) return 'Senha deve ter no máximo 255 caracteres'
    if (senha !== confirmarSenha) return 'Senhas não coincidem'
    
    // Validar IDs
    const sexoNum = Number(idSexo)
    const tipoNum = Number(idTipoSanguineo)
    
    if (isNaN(sexoNum) || sexoNum < 1 || sexoNum > 3) return 'Sexo selecionado é inválido'
    if (isNaN(tipoNum) || tipoNum < 1 || tipoNum > 8) return 'Tipo sanguíneo selecionado é inválido'
    
    return null
  }

  const criarUsuario = async () => {
    setError('')
    setSuccess('')
    const erro = validarFormulario()
    if (erro) return setError(erro)
    setLoading(true)

    try {
      // Upload de foto
      let fotoPerfilUrl = null
      if (photoUploadRef.current?.hasFile) {
        try {
          if (import.meta.env.VITE_DEVELOPMENT_MODE === 'true') {
            // Modo desenvolvimento - criar Object URL da imagem
            const file = photoUploadRef.current.getFile()
            if (file) {
              fotoPerfilUrl = URL.createObjectURL(file)
              // Salvar também o arquivo no sessionStorage para persistir durante a sessão
              const reader = new FileReader()
              reader.onload = () => {
                sessionStorage.setItem('user_photo_blob', reader.result)
              }
              reader.readAsDataURL(file)
            }
          } else {
            // Produção - upload real para Azure
            if (!validateSasToken()) {
              setError('Token de upload expirado. Entre em contato com o suporte.')
              setLoading(false)
              return
            }
            
            const base64Data = await photoUploadRef.current.getBase64()
            const uploadResult = await uploadBase64ToAzure(base64Data, `perfil_${Date.now()}.jpg`)
            
            if (!uploadResult.success) {
              setError('Erro ao fazer upload da foto: ' + uploadResult.error)
              setLoading(false)
              return
            }
            
            fotoPerfilUrl = uploadResult.url // Usar a URL completa
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
        foto_perfil: fotoPerfilUrl || null
      }
      
      // Validar tamanhos dos campos
      if (dadosUsuario.nome.length > 100) {
        setError('Nome muito longo (máximo 100 caracteres)')
        setLoading(false)
        return
      }
      
      if (dadosUsuario.email.length > 100) {
        setError('E-mail muito longo (máximo 100 caracteres)')
        setLoading(false)
        return
      }
      
      // Remover validação de tamanho da foto para permitir base64
      // if (dadosUsuario.foto_perfil && dadosUsuario.foto_perfil.length > 255) {
      //   setError('Nome da foto muito longo')
      //   setLoading(false)
      //   return
      // }
      
      console.log('Dados do usuário:', {
        ...dadosUsuario,
        senha: '[OCULTA]' // Não logar senha
      })
      console.log('Tamanho da foto_perfil:', fotoPerfilUrl?.length || 0)
      console.log('Modo desenvolvimento ativo:', import.meta.env.VITE_DEVELOPMENT_MODE)
      console.log('Tentando conectar com backend...')
      
      // Verificar se backend está rodando
      let resultado
      try {
        resultado = await criarUsuarioAPI(dadosUsuario)
      } catch (error) {
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          // Backend não está rodando - simular sucesso para desenvolvimento
          console.warn('Backend não está rodando. Simulando cadastro local.')
          resultado = {
            success: true,
            data: { 
              ...dadosUsuario, 
              id: Date.now(),
              foto_perfil: fotoPerfilUrl // Garantir que a foto seja incluída
            },
            message: 'Usuário criado localmente (backend offline)'
          }
        } else {
          throw error
        }
      }
      
      if (resultado.success) {
        try {
          // Garantir que os dados do usuário incluam a foto
          const usuarioCriado = {
            ...(resultado.data || dadosUsuario),
            foto_perfil: fotoPerfilUrl // Garantir que a foto seja incluída
          }
          console.log('Salvando usuário com foto:', {
            ...usuarioCriado,
            foto_perfil: fotoPerfilUrl ? 'Presente' : 'Ausente'
          })
          AuthService.setSession(null, usuarioCriado)
        } catch (error) {
          console.error('Erro ao salvar sessão:', error)
        }
        setSuccess('Conta criada com sucesso! Redirecionando...')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        if (resultado.message?.includes('backend offline')) {
          setError('Backend não está rodando. Inicie o servidor backend.')
        } else if (resultado.message?.includes('Limite de cadastros atingido')) {
          setError('Rate limiting ativo. Aguarde ou reinicie o backend.')
        } else {
          setError(resultado.message || 'Erro ao criar conta.')
        }
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
        <img className="cadastro__logo" src={logoSemFundo} alt="DoeVida" />
        <h1 className="cadastro__title">Carregando...</h1>
      </div>
    )
  }

  return (
    <div className="cadastro">
      <div className="cadastro__decor-circle" />
      <img className="cadastro__logo" src={logoSemFundo} alt="DoeVida" />
      <h1 className="cadastro__title">Sou Doador</h1>

      <div className="cadastro__form-container">
        {/* CARD 1 - Informações Pessoais */}
        <form className="cadastro__form cadastro__form--left" onSubmit={(e) => e.preventDefault()}>
          <h2 className="form-section-title">Informações Pessoais</h2>
          <div className="form-fields">
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
          </div>
        </form>

        {/* CARD 2 - Informações de Saúde e Contato */}
        <form className="cadastro__form cadastro__form--right" onSubmit={(e) => e.preventDefault()}>
          <h2 className="form-section-title">Informações de Saúde e Contato</h2>
          <div className="form-fields">
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
          </div>
        </form>
      </div>

      {/* Foto de Perfil - Card Separado */}
      <div className="cadastro__form cadastro__form--photo">
        <h2 className="form-section-title">Foto de Perfil</h2>
        <div className="field">
          <PhotoUpload
            ref={photoUploadRef}
            placeholder="Adicione sua foto de perfil"
            disabled={loading}
            initialPhoto={user?.foto_perfil ? getPhotoUrl(200) : null}
          />
        </div>
      </div>

      {/* Mensagens de Erro/Sucesso */}
      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

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
