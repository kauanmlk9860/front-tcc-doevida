import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { atualizarHospital, buscarHospital } from '../../api/usuario/hospital';
import './style.css';
import logo from '../../assets/logo.png';
import LogoutModal from '../../components/jsx/LogoutModal';

function HospitalPerfil() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cnpj: '',
    crm: '',
    cep: '',
    telefone: '',
    capacidade_maxima: '',
    convenios: '',
    horario_abertura: '',
    horario_fechamento: '',
    foto: '',
    tipo_hospital: ''
  });

  // Verificar se é hospital
  useEffect(() => {
    if (!user || user.role !== 'HOSPITAL') {
      navigate('/hospital-login');
    } else {
      carregarDados();
    }
  }, [user, navigate]);

  const formatarHora = (hora) => {
    console.log('Hora recebida para formatação:', hora);
    
    // Se for nulo ou indefinido
    if (!hora) {
      console.log('Hora vazia, retornando string vazia');
      return '';
    }
    
    // Se já estiver no formato HH:MM
    if (typeof hora === 'string' && /^\d{2}:\d{2}$/.test(hora)) {
      console.log('Hora já está no formato HH:MM:', hora);
      return hora;
    }
    
    // Se for um timestamp ISO (1970-01-01T10:00:00.000Z)
    if (typeof hora === 'string' && hora.includes('T')) {
      console.log('Convertendo timestamp ISO para HH:MM:', hora);
      try {
        // Extrai apenas a parte do tempo (HH:MM:SS) e pega as primeiras 5 posições (HH:MM)
        const timePart = hora.split('T')[1] || '';
        const timeOnly = timePart.split('.')[0]; // Remove os milissegundos
        const [hours, minutes] = timeOnly.split(':');
        
        // Formata para garantir 2 dígitos
        const format = (num) => String(num).padStart(2, '0');
        return `${format(hours)}:${format(minutes)}`;
      } catch (error) {
        console.error('Erro ao formatar timestamp ISO:', error);
        return '';
      }
    }
    
    // Se for um número (timestamp em milissegundos)
    if (typeof hora === 'number' || (typeof hora === 'string' && /^\d+$/.test(hora))) {
      console.log('Convertendo timestamp numérico para HH:MM:', hora);
      try {
        const date = new Date(Number(hora));
        if (isNaN(date.getTime())) {
          console.error('Timestamp numérico inválido:', hora);
          return '';
        }
        return date.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
      } catch (error) {
        console.error('Erro ao formatar timestamp numérico:', error);
        return '';
      }
    }
    
    // Se for um objeto de data
    if (hora instanceof Date && !isNaN(hora.getTime())) {
      console.log('Convertendo objeto Date para HH:MM');
      return hora.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
    }
    
    console.log('Formato de hora não reconhecido:', typeof hora, hora);
    return '';
  };

  const carregarDados = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        console.log('Buscando dados do hospital para o ID:', user.id);
        const response = await buscarHospital(user.id);
        console.log('Resposta da API ao buscar hospital:', response);
        
        if (response.success && response.data) {
          const hospital = response.data;
          console.log('Dados completos do hospital:', hospital);
          
          // Log dos horários brutos recebidos da API
          console.log('Horário de abertura (bruto):', hospital.horario_abertura);
          console.log('Horário de fechamento (bruto):', hospital.horario_fechamento);
          
          // Formatando os horários
          const horarioAbertura = formatarHora(hospital.horario_abertura);
          const horarioFechamento = formatarHora(hospital.horario_fechamento);
          
          console.log('Horário de abertura (formatado):', horarioAbertura);
          console.log('Horário de fechamento (formatado):', horarioFechamento);
          
          // Mapeando os campos de telefone e CEP, verificando possíveis nomes alternativos
          const telefone = hospital.telefone || hospital.telefone_contato || hospital.telefone1 || hospital.telefone2 || '';
          const cep = hospital.cep || '';
          
          console.log('Telefone encontrado:', telefone);
          console.log('CEP encontrado:', cep);
          
          const formDataAtualizado = {
            nome: hospital.nome || '',
            email: hospital.email || '',
            senha: '', // Não preencher senha por segurança
            cnpj: hospital.cnpj || '',
            crm: hospital.crm || '',
            cep: cep,
            telefone: telefone,
            capacidade_maxima: hospital.capacidade_maxima || '',
            convenios: hospital.convenios || '',
            horario_abertura: horarioAbertura,
            horario_fechamento: horarioFechamento,
            foto: hospital.foto || '',
            tipo_hospital: hospital.tipo_hospital || ''
          };
          
          console.log('FormData preenchido:', formDataAtualizado);
          setFormData(formDataAtualizado);
        } else {
          console.error('Resposta da API sem sucesso ou sem dados:', response);
          setMessage({ type: 'error', text: response.message || 'Dados do hospital não encontrados' });
        }
      } else {
        console.error('ID do usuário não encontrado:', user);
        setMessage({ type: 'error', text: 'ID do usuário não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados do hospital: ' + (error.message || 'Erro desconhecido') });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.nome || !formData.email) {
      setMessage({ type: 'error', text: 'Nome e email são obrigatórios' });
      return;
    }

    if (!formData.senha) {
      setMessage({ type: 'error', text: 'Por favor, informe sua senha para confirmar as alterações' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToUpdate = {
        ...formData,
        capacidade_maxima: parseInt(formData.capacidade_maxima) || 0
      };

      const response = await atualizarHospital(user.id, dataToUpdate);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        setEditMode(false);
        // Limpar senha após salvar
        setFormData(prev => ({ ...prev, senha: '' }));
        // Recarregar dados
        setTimeout(() => {
          carregarDados();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: response.message || 'Erro ao atualizar perfil' });
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/hospital-login');
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(prev => ({ ...prev, senha: '' }));
    carregarDados();
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <div className="hospital-perfil-loading">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="hospital-perfil">
      {/* Header */}
      <header className="hospital-perfil-header">
        <div className="header-bg-pattern"></div>
        <div className="header-content">
          <div className="header-left">
            <button 
              className="btn-back"
              onClick={() => navigate('/hospital-home')}
            >
              ← Voltar
            </button>
            <div className="brand-section">
              <img src={logo} alt="DoeVida" className="header-logo" />
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
      <main className="hospital-perfil-main">
        <div className="container">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {formData.foto ? (
                  <img src={formData.foto} alt={formData.nome} />
                ) : (
                  <div className="avatar-placeholder">
                    <span>🏥</span>
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2>{formData.nome || 'Hospital'}</h2>
                <p className="profile-email">{formData.email}</p>
                <p className="profile-cnpj">CNPJ: {formData.cnpj}</p>
              </div>
              {!editMode && (
                <button 
                  className="btn-edit"
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Editar Perfil
                </button>
              )}
            </div>

            {/* Message */}
            {message.text && (
              <div className={`message message-${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3 className="section-title">📋 Informações Básicas</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nome">Nome do Hospital *</label>
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
                    <label htmlFor="email">Email *</label>
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
                    <label htmlFor="cnpj">CNPJ</label>
                    <input
                      type="text"
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="crm">CRM</label>
                    <input
                      type="text"
                      id="crm"
                      name="crm"
                      value={formData.crm}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input
                      type="text"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tipo_hospital">Tipo de Hospital</label>
                    <input
                      type="text"
                      id="tipo_hospital"
                      name="tipo_hospital"
                      value={formData.tipo_hospital}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="Ex: Público, Privado"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">📍 Localização</h3>
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

              <div className="form-section">
                <h3 className="section-title">⏰ Horário de Funcionamento</h3>
                {!editMode ? (
                  <div className="horario-display">
                    {formData.horario_abertura && formData.horario_fechamento ? (
                      <p className="horario-text">
                        <span className="horario-label">Aberto de</span> {formData.horario_abertura} <span className="horario-label">até</span> {formData.horario_fechamento}
                      </p>
                    ) : (
                      <p className="horario-text">Horário de funcionamento não definido</p>
                    )}
                  </div>
                ) : (
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="horario_abertura">Horário de Abertura</label>
                      <input
                        type="time"
                        id="horario_abertura"
                        name="horario_abertura"
                        value={formData.horario_abertura || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="horario_fechamento">Horário de Fechamento</label>
                      <input
                        type="time"
                        id="horario_fechamento"
                        name="horario_fechamento"
                        value={formData.horario_fechamento || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-section">
                <h3 className="section-title">🏥 Capacidade e Convênios</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="capacidade_maxima">Capacidade Máxima de Doadores</label>
                    <input
                      type="number"
                      id="capacidade_maxima"
                      name="capacidade_maxima"
                      value={formData.capacidade_maxima}
                      onChange={handleChange}
                      disabled={!editMode}
                      min="1"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label htmlFor="convenios">Convênios Aceitos</label>
                    <input
                      type="text"
                      id="convenios"
                      name="convenios"
                      value={formData.convenios}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="Ex: SUS, Unimed, Amil"
                    />
                  </div>
                </div>
              </div>

                {editMode && (
                <>
                  <div className="form-section">
                    <h3 className="section-title">🔒 Confirmação de Senha</h3>
                    <div className="form-grid">
                      <div className="form-group form-group-full">
                        <label htmlFor="senha">Digite sua senha para confirmar as alterações *</label>
                        <input
                          type="password"
                          id="senha"
                          name="senha"
                          value={formData.senha}
                          onChange={handleChange}
                          required
                          placeholder="Digite sua senha atual"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="btn-save"
                      disabled={saving}
                    >
                      {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default HospitalPerfil;
