import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'

function Hospital_cadastro() {
 

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

    const dadosHospital = {
      nome: nomeRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      senha: senhaRef.current.value,
      cnpj: cnpjRef.current.value.trim(),
      cep: cepRef.current.value.trim(),
      telefone: telefoneRef.current.value.trim(),
      capacidade_maxima: Number(capacidadeRef.current.value),
      convenios: conveniosRef.current.value.trim(),
      crm: crmRef.current.value.trim(),
      horario_abertura: aberturaRef.current.value,
      horario_fechamento: fechamentoRef.current.value,
      foto: (fotoRef.current?.value?.trim() || 'https://via.placeholder.com/600x400?text=Hospital')
    }

    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/hospital`

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosHospital)
      })

      const resultado = await response.json().catch(() => ({}))
      const okDaApi = response.ok && (resultado.status === true || resultado.status_code === 201 || resultado.status_code === 200)

      if (okDaApi) {
        setSuccess(resultado.message || 'Hospital criado com sucesso! Redirecionando para login...')
        setTimeout(() => navigate('/login'), 2000)
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
      <img className="cadastro__logo" src={logoBranca} alt="DoeVida" />
      <h1 className="cadastro__title">Sou Hospital</h1>

      {/* ✅ ativa o grid de 2 colunas do CSS novo */}
      <form className="cadastro__form form-grid" autoComplete="off" onSubmit={(e) => e.preventDefault()}>

        <input
          className="input input--name"
          placeholder="Nome do Hospital *"
          name="nome"
          type="text"
          ref={nomeRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          maxLength={70}
        />

        <input
          className="input input--email"
          placeholder="Digite o E-mail *"
          name="email"
          type="email"
          ref={emailRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          maxLength={100}
        />

        <input
          className="input input--password"
          placeholder="Digite a Senha *"
          name="senha"
          type="password"
          ref={senhaRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          minLength={6}
          maxLength={255}
        />

        <input
          className="input input--password-confirm"
          placeholder="Confirme a Senha *"
          name="confirmar-senha"
          type="password"
          ref={confirmarSenhaRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          minLength={6}
          maxLength={255}
        />

        {/* ✅ campos sem ícone recebem .no-icon para remover padding esquerdo */}
        <input
          className="input no-icon"
          placeholder="CNPJ *"
          name="cnpj"
          type="text"
          ref={cnpjRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          maxLength={20}
        />

        <input
          className="input no-icon"
          placeholder="CEP *"
          name="cep"
          type="text"
          ref={cepRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          maxLength={10}
        />

        <input
          className="input no-icon"
          placeholder="Telefone *"
          name="telefone"
          type="text"
          ref={telefoneRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          maxLength={20}
        />

        <input
          className="input no-icon"
          placeholder="Capacidade Máxima (Doadores) *"
          name="capacidade"
          type="number"
          ref={capacidadeRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          min={1}
        />

        <input
          className="input no-icon"
          placeholder="Convênios Aceitos *"
          name="convenios"
          type="text"
          ref={conveniosRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          maxLength={255}
        />

        <input
          className="input no-icon"
          placeholder="CRM (Link) *"
          name="crm"
          type="text"
          ref={crmRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          maxLength={255}
        />

        <input
          className="input input--date"
          placeholder="Horário de Abertura *"
          name="horario-abertura"
          type="time"
          ref={aberturaRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          step="900"
        />

        <input
          className="input input--date"
          placeholder="Horário de Fechamento *"
          name="horario-fechamento"
          type="time"
          ref={fechamentoRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
          step="900"
        />

        <input
          className="input input--photo"
          placeholder="URL da Foto (opcional)"
          name="foto"
          type="url"
          ref={fotoRef}
          onKeyPress={handleKeyPress}
          disabled={loading}
          maxLength={255}
        />

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
          onClick={() => navigate('/login')}
          disabled={loading}
        >
          Já tem uma conta?
        </button>
      </div>
    </div>
  )
}

export default Hospital_cadastro
