import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'

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
    if (!email || !email.includes('@')) return 'E-mail deve ser válido'
    if (!senha || senha.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
    if (senha !== confirmarSenha) return 'Senhas não coincidem'
    if (!idSexo) return 'Selecione seu sexo'
    if (!idTipoSanguineo) return 'Selecione seu tipo sanguíneo'
    return null
  }

  const criarUsuario = async () => {
    setError('')
    setSuccess('')
    const erro = validarFormulario()
    if (erro) return setError(erro)
    setLoading(true)

    const dadosUsuario = {
      nome: nomeRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      senha: senhaRef.current.value,
      cpf: cpfRef.current?.value?.trim() || null,
      cep: cepRef.current?.value?.trim() || null,
      numero: numeroRef.current?.value?.trim() || null,
      data_nascimento: dataNascimentoRef.current?.value || null,
      foto_perfil: fotoPerfilRef.current?.value?.trim() || null,
      id_sexo: Number(idSexo),
      id_tipo_sanguineo: Number(idTipoSanguineo)
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'}/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosUsuario)
      })

      const resultado = await response.json()
      if (response.ok && resultado.status) {
        setSuccess('Conta criada com sucesso! Redirecionando...')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(resultado.message || 'Erro ao criar conta.')
      }
    } catch {
      setError('Erro de conexão. Verifique o backend.')
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
            <input className="input input--name" type="text" ref={nomeRef} onKeyPress={handleKeyPress} disabled={loading} />
          </div>

          <div className="field">
            <span>E-mail *</span>
            <input className="input input--email" type="email" ref={emailRef} onKeyPress={handleKeyPress} disabled={loading} />
          </div>

          <div className="field">
            <span>Senha *</span>
            <input className="input input--password" type="password" ref={senhaRef} onKeyPress={handleKeyPress} disabled={loading} />
          </div>

          <div className="field">
            <span>Confirmar Senha *</span>
            <input className="input input--password-confirm" type="password" ref={confirmarSenhaRef} onKeyPress={handleKeyPress} disabled={loading} />
          </div>

          <div className="field">
            <span>CPF</span>
            <input className="input input--cpf" type="text" ref={cpfRef} onKeyPress={handleKeyPress} disabled={loading} />
          </div>

          <div className="field">
            <span>CEP</span>
            <input className="input input--cep" type="text" ref={cepRef} onKeyPress={handleKeyPress} disabled={loading} />
          </div>

          <div className="field">
            <span>Número de Telefone</span>
            <input className="input input--number" type="text" ref={numeroRef} onKeyPress={handleKeyPress} disabled={loading} />
          </div>

          <div className="field">
            <span>Data de Nascimento</span>
            <input className="input input--date" type="date" ref={dataNascimentoRef} disabled={loading} />
          </div>

          <div className="field">
            <span>Tipo Sanguíneo *</span>
            <select className="input input--blood" value={idTipoSanguineo} onChange={e => setIdTipoSanguineo(e.target.value)} disabled={loading}>
              <option value="" disabled>Selecione...</option>
              {tiposSangue.map(tipo => <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>)}
            </select>
          </div>

          <div className="field">
            <span>Sexo *</span>
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

          <div className="field">
            <span>URL da Foto de Perfil</span>
            <input className="input input--photo" type="url" ref={fotoPerfilRef} onKeyPress={handleKeyPress} disabled={loading} />
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
