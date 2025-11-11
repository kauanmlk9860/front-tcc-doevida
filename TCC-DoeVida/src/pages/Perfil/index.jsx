import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { atualizarUsuario, obterSexos, obterTiposSanguineos } from '../../api/usuario/usuario'
import './style.css'
import logoSemFundo from '../../assets/icons/logo_semfundo.png'
import LogoutModal from '../../components/jsx/LogoutModal'

function Perfil() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useUser()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editMode, setEditMode] = useState(false)
  const [tipos, setTipos] = useState([])
  const [sexos, setSexos] = useState([])

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    cep: '',
    data_nascimento: '',
    telefone: '',
    id_sexo: '',
    id_tipo_sanguineo: '',
    foto_perfil: ''
  })

  // Verificar se está logado
  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      carregarDados()
    }
  }, [user, navigate])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Carregar tipos sanguíneos e sexos
      const [tiposRes, sexosRes] = await Promise.all([
        obterTiposSanguineos(),
        obterSexos()
      ])
      
      // Extrair listas da estrutura correta da API
      const tiposSanguineos = Array.isArray(tiposRes?.data?.tipos)
        ? tiposRes.data.tipos
        : Array.isArray(tiposRes?.data?.data?.tipos)
          ? tiposRes.data.data.tipos
          : []

      const listaSexos = Array.isArray(sexosRes?.data?.sexo)
        ? sexosRes.data.sexo
        : Array.isArray(sexosRes?.data?.data?.sexo)
          ? sexosRes.data.data.sexo
          : []

      setTipos(tiposSanguineos)
      setSexos(listaSexos)

      // Preencher formulário com dados do usuário
      if (user) {
        // Formatar data para o input date (YYYY-MM-DD)
        let dataNascimento = ''
        if (user.data_nascimento) {
          try {
            console.log('Data original:', user.data_nascimento);
            // Criar data a partir da string fornecida
            const data = new Date(user.data_nascimento);
            
            if (!isNaN(data.getTime())) {
              // Adicionar um dia para compensar a diferença de fuso horário
              data.setDate(data.getDate() + 1);
              
              // Extrair os componentes da data
              const year = data.getFullYear();
              const month = String(data.getMonth() + 1).padStart(2, '0');
              const day = String(data.getDate()).padStart(2, '0');
              
              dataNascimento = `${year}-${month}-${day}`;
              console.log('Data formatada para input:', dataNascimento, 'de', user.data_nascimento);
            } else {
              console.warn('Data de nascimento inválida:', user.data_nascimento);
              // Tentar extrair a data diretamente da string se o formato for conhecido
              const match = user.data_nascimento.match(/(\d{4})-(\d{2})-(\d{2})/);
              if (match) {
                dataNascimento = `${match[1]}-${match[2]}-${match[3]}`;
                console.log('Data extraída da string:', dataNascimento);
              }
            }
          } catch (error) {
            console.error('Erro ao formatar data de nascimento:', error);
          }
        }

        // Mapear IDs a partir dos nomes (quando não vierem)
        let idTipo = user.id_tipo_sanguineo || ''
        if ((!idTipo || idTipo === 'undefined') && user.tipo_sanguineo_nome) {
          const t = tiposSanguineos.find(x => (x.tipo || '').toUpperCase() === user.tipo_sanguineo_nome.toUpperCase())
          if (t) idTipo = String(t.id)
        }

        let idSexo = user.id_sexo || ''
        if ((!idSexo || idSexo === 'undefined') && user.nome_sexo) {
          const s = listaSexos.find(x => (x.sexo || '').toUpperCase() === user.nome_sexo.toUpperCase())
          if (s) idSexo = String(s.id)
        }

        setFormData({
          nome: user.nome || '',
          email: user.email || '',
          senha: '',
          cpf: user.cpf || '',
          cep: user.cep || '',
          data_nascimento: dataNascimento,
          telefone: user.telefone || '',
          id_sexo: idSexo || '',
          id_tipo_sanguineo: idTipo || '',
          foto_perfil: user.foto_perfil || ''
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar dados' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validações básicas
    if (!formData.nome || !formData.email) {
      setMessage({ type: 'error', text: 'Nome e email são obrigatórios' })
      return
    }

    if (!formData.senha) {
      setMessage({ type: 'error', text: 'Por favor, informe sua senha para confirmar as alterações' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const dataToUpdate = { ...formData }

      const response = await atualizarUsuario(user.id, dataToUpdate)
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
        setEditMode(false)
        // Limpar senha após salvar
        setFormData(prev => ({ ...prev, senha: '' }))
        // Atualizar contexto do usuário
        await updateUser()
        setTimeout(() => {
          carregarDados()
        }, 1500)
      } else {
        setMessage({ type: 'error', text: response.message || 'Erro ao atualizar perfil' })
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleCancel = () => {
    setEditMode(false)
    setFormData(prev => ({ ...prev, senha: '' }))
    carregarDados()
    setMessage({ type: '', text: '' })
  }

  if (loading) {
    return (
      <div className="perfil-loading">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="perfil">
      {/* Header */}
      <header className="perfil-header">
        <div className="header-bg-pattern"></div>
        <div className="header-content">
          <div className="header-left">
            <button 
              className="btn-voltar"
              onClick={() => navigate('/home')}
              aria-label="Voltar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Voltar
            </button>
            <div className="brand-section">
              <img src={logoSemFundo} alt="DoeVida" className="header-logo" />
              <div className="brand-info">
                <h1>Meu Perfil</h1>
                <p>Gerencie suas informações</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="btn-logout-header"
              onClick={() => setShowLogoutModal(true)}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="perfil-main">
        <div className="container">
          {/* Mensagens */}
          {message.text && (
            <div className={`message message-${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Profile Card */}
          <div className="profile-card">
            {/* Avatar Section */}
            <div className="avatar-section">
              <div className="avatar-container">
                <img
                  src={formData.foto_perfil || "/placeholder-profile.png"}
                  alt="Foto de perfil"
                  className="avatar-img"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder-profile.png"
                  }}
                />
                <div className="avatar-badge">
                  {user?.tipo_sanguineo || 'O+'}
                </div>
              </div>
              <div className="avatar-info">
                <h2>{formData.nome || 'Usuário'}</h2>
                <p>{formData.email}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="profile-form">
              {/* Informações Básicas */}
              <div className="form-section">
                <h3 className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Informações Pessoais
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nome">Nome Completo *</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">E-mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cpf">CPF</label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="data_nascimento">Data de Nascimento</label>
                    <input
                      type="date"
                      id="data_nascimento"
                      name="data_nascimento"
                      value={formData.data_nascimento}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="id_sexo">Sexo</label>
                    <select
                      id="id_sexo"
                      name="id_sexo"
                      value={formData.id_sexo}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <option value="">Selecione</option>
                      {sexos.map(sexo => (
                        <option key={sexo.id} value={sexo.id}>
                          {sexo.sexo || sexo.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="form-section">
                <h3 className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Endereço
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="cep">CEP</label>
                    <input
                      type="text"
                      id="cep"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>

              {/* Informações Médicas */}
              <div className="form-section">
                <h3 className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#990410"/>
                  </svg>
                  Informações Médicas
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="id_tipo_sanguineo">Tipo Sanguíneo</label>
                    <select
                      id="id_tipo_sanguineo"
                      name="id_tipo_sanguineo"
                      value={formData.id_tipo_sanguineo}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <option value="">Selecione</option>
                      {tipos.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.tipo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="foto_perfil">URL da Foto de Perfil</label>
                    <input
                      type="url"
                      id="foto_perfil"
                      name="foto_perfil"
                      value={formData.foto_perfil}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Senha (apenas quando editando) */}
              {editMode && (
                <div className="form-section">
                  <h3 className="section-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Confirmação de Senha
                  </h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="senha">Senha Atual *</label>
                      <input
                        type="password"
                        id="senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="Digite sua senha para confirmar"
                        required={editMode}
                      />
                      <small>Necessário para confirmar as alterações</small>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="form-actions">
                {!editMode ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setEditMode(true)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={saving}
                    >
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  )
}

export default Perfil
