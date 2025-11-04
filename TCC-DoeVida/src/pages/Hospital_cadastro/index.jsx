import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoSemFundo from '../../assets/icons/logo_semfundo.png'
import FormattedInput from '../../components/jsx/FormattedInput'
import PhotoUpload from '../../components/jsx/PhotoUpload'
import PasswordInput from '../../components/jsx/PasswordInput'
import { InputIcons } from '../../components/jsx/InputIcons'

function Hospital_cadastro() {
  const navigate = useNavigate()

  // Refs
  const nomeRef = useRef()
  const emailRef = useRef()
  const senhaRef = useRef()
  const confirmarSenhaRef = useRef()
  const cnpjRef = useRef()
  const cepRef = useRef()
  const telefoneRef = useRef()
  const capacidadeRef = useRef()
  const conveniosRef = useRef()
  const crmRef = useRef()
  const aberturaRef = useRef()
  const fechamentoRef = useRef()
  const fotoRef = useRef()
  const photoUploadRef = useRef()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const LIMITS = {
    nomeMax: 70,
    emailMax: 100,
    senhaMax: 255,
    cnpjMax: 20,
    cepMax: 10,
    telefoneMax: 20,
    conveniosMax: 255,
    crmMax: 255,
    fotoMax: 255
  }

  const validarFormulario = () => {
    const nome = nomeRef.current?.value?.trim()
    const email = emailRef.current?.value?.trim()
    const senha = senhaRef.current?.value
    const confirmarSenha = confirmarSenhaRef.current?.value
    const cnpj = cnpjRef.current?.value?.trim()
    const cep = cepRef.current?.value?.trim()
    const telefone = telefoneRef.current?.value?.trim()
    const capacidade = capacidadeRef.current?.value?.trim()
    const convenios = conveniosRef.current?.value?.trim()
    const crm = crmRef.current?.value?.trim()
    const abertura = aberturaRef.current?.value
    const fechamento = fechamentoRef.current?.value
    const foto = fotoRef.current?.value?.trim()

    if (!nome) return 'Nome do hospital é obrigatório'
    if (nome.length > LIMITS.nomeMax) return `Nome deve ter no máximo ${LIMITS.nomeMax} caracteres`

    if (!email) return 'E-mail é obrigatório'
    if (!email.includes('@')) return 'E-mail deve ser válido'
    if (email.length > LIMITS.emailMax) return `E-mail deve ter no máximo ${LIMITS.emailMax} caracteres`

    if (!senha) return 'Senha é obrigatória'
    if (senha.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
    if (senha.length > LIMITS.senhaMax) return `Senha deve ter no máximo ${LIMITS.senhaMax} caracteres`
    if (senha !== confirmarSenha) return 'Senhas não coincidem'

    if (!cnpj) return 'CNPJ é obrigatório'
    if (cnpj.length > LIMITS.cnpjMax) return `CNPJ deve ter no máximo ${LIMITS.cnpjMax} caracteres`

    if (!cep) return 'CEP é obrigatório'
    if (cep.length > LIMITS.cepMax) return `CEP deve ter no máximo ${LIMITS.cepMax} caracteres`

    if (!telefone) return 'Telefone é obrigatório'
    if (telefone.length > LIMITS.telefoneMax) return `Telefone deve ter no máximo ${LIMITS.telefoneMax} caracteres`

    if (!capacidade) return 'Capacidade máxima é obrigatória'
    const cap = Number(capacidade)
    if (isNaN(cap) || cap <= 0) return 'Capacidade deve ser um número maior que 0'

    if (!convenios) return 'Convênios é obrigatório'
    if (convenios.length > LIMITS.conveniosMax) return `Convênios deve ter no máximo ${LIMITS.conveniosMax} caracteres`

    if (!crm) return 'CRM (link) é obrigatório'
    if (crm.length > LIMITS.crmMax) return `CRM deve ter no máximo ${LIMITS.crmMax} caracteres`

    if (!abertura) return 'Horário de abertura é obrigatório'
    if (!fechamento) return 'Horário de fechamento é obrigatório'
    if (abertura >= fechamento) return 'Horário de fechamento deve ser após a abertura'

    if (foto && foto.length > LIMITS.fotoMax) return `Foto (URL) deve ter no máximo ${LIMITS.fotoMax} caracteres`

    return null
  }

  const criarHospital = async () => {
    setError('')
    setSuccess('')

    const erro = validarFormulario()
    if (erro) {
      setError(erro)
      return
    }

    setLoading(true)

    try {
      // Preparar foto do hospital
      let fotoHospitalData = null;
      if (photoUploadRef.current?.hasFile) {
        try {
          fotoHospitalData = await photoUploadRef.current.getBase64();
        } catch (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
      }

      const dadosHospital = {
        nome: nomeRef.current.value.trim(),
        email: emailRef.current.value.trim(),
        senha: senhaRef.current.value,
        cnpj: cnpjRef.current.value.replace(/\D/g, ''),
        cep: cepRef.current.value.replace(/\D/g, ''),
        telefone: telefoneRef.current.value.replace(/\D/g, ''),
        capacidade_maxima: Number(capacidadeRef.current.value),
        convenios: conveniosRef.current.value.trim(),
        crm: crmRef.current.value.trim(),
        horario_abertura: aberturaRef.current.value,
        horario_fechamento: fechamentoRef.current.value,
        foto: fotoHospitalData || 'https://via.placeholder.com/600x400?text=Hospital'
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/hospital`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosHospital)
      })

      const resultado = await response.json().catch(() => ({}))
      const okDaApi = response.ok && (resultado.status === true || resultado.status_code === 201 || resultado.status_code === 200)

      if (okDaApi) {
        setSuccess(resultado.message || 'Hospital criado com sucesso! Redirecionando para login...')
        setTimeout(() => navigate('/hospital-login'), 2000)
      } else {
        setError(resultado.message || `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      setError('Erro de conexão. Verifique se o backend está rodando e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !loading) {
      criarHospital()
    }
  }

  return (
    <div className="cadastro">
      <div className="cadastro__decor-circle" />
      <img className="cadastro__logo" src={logoSemFundo} alt="DoeVida" />
      <h1 className="cadastro__title">Sou Hospital</h1>

      <form className="cadastro__form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <div className="field">
            <span>Nome do Hospital *</span>
            <FormattedInput
              ref={nomeRef}
              placeholder="Digite o nome do hospital"
              icon={<InputIcons.Hospital />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength={70}
            />
          </div>

          <div className="field">
            <span>E-mail *</span>
            <FormattedInput
              ref={emailRef}
              type="email"
              placeholder="Digite o e-mail"
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
              placeholder="Digite a senha"
              onKeyPress={handleKeyPress}
              disabled={loading}
              minLength={6}
              maxLength={255}
            />
          </div>

          <div className="field">
            <span>Confirmar Senha *</span>
            <PasswordInput
              ref={confirmarSenhaRef}
              placeholder="Confirme a senha"
              onKeyPress={handleKeyPress}
              disabled={loading}
              minLength={6}
              maxLength={255}
            />
          </div>

          <div className="field">
            <span>CNPJ *</span>
            <FormattedInput
              ref={cnpjRef}
              formatType="cnpj"
              placeholder="00.000.000/0000-00"
              icon={<InputIcons.Building />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength={20}
            />
          </div>

          <div className="field">
            <span>CEP *</span>
            <FormattedInput
              ref={cepRef}
              formatType="cep"
              placeholder="00000-000"
              icon={<InputIcons.Location />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength={10}
            />
          </div>

          <div className="field">
            <span>Telefone *</span>
            <FormattedInput
              ref={telefoneRef}
              formatType="phone"
              placeholder="(00) 00000-0000"
              icon={<InputIcons.Phone />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength={20}
            />
          </div>

          <div className="field">
            <span>Capacidade Máxima (Doadores) *</span>
            <FormattedInput
              ref={capacidadeRef}
              type="number"
              placeholder="Ex: 10"
              icon={<InputIcons.Capacity />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              min={1}
            />
          </div>

          <div className="field">
            <span>Convênios Aceitos *</span>
            <FormattedInput
              ref={conveniosRef}
              placeholder="Ex: SUS, Unimed, Amil"
              icon={<InputIcons.Insurance />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength={255}
            />
          </div>

          <div className="field">
            <span>CRM (Link) *</span>
            <FormattedInput
              ref={crmRef}
              placeholder="Cole o link do CRM"
              icon={<InputIcons.Link />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              maxLength={255}
            />
          </div>

          <div className="field">
            <span>Horário de Abertura *</span>
            <FormattedInput
              ref={aberturaRef}
              type="time"
              placeholder="Horário de Abertura"
              icon={<InputIcons.Clock />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              step="900"
            />
          </div>

          <div className="field">
            <span>Horário de Fechamento *</span>
            <FormattedInput
              ref={fechamentoRef}
              type="time"
              placeholder="Horário de Fechamento"
              icon={<InputIcons.Clock />}
              onKeyPress={handleKeyPress}
              disabled={loading}
              step="900"
            />
          </div>

          <div className="field field--full">
            <span>Foto do Hospital</span>
            <PhotoUpload
              ref={photoUploadRef}
              placeholder="Adicione foto do hospital (opcional)"
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="error-msg">{error}</div>
        )}

        {success && (
          <div className="success-msg">{success}</div>
        )}
      </form>

      <div className="cadastro__actions">
        <button
          className="btn btn--primary"
          type="button"
          onClick={criarHospital}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Criando Conta...' : 'Criar Conta'}
        </button>

        <button
          className="btn btn--link"
          type="button"
          onClick={() => navigate('/hospital-login')}
          disabled={loading}
        >
          Já tem uma conta?
        </button>
      </div>
    </div>
  )
}

export default Hospital_cadastro
