import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { 
  listarAgendamentosHospital, 
  obterAgendamentosHoje,
  obterEstatisticasHospital,
  concluirDoacao,
  cancelarAgendamentoHospital
} from '../../api/hospital/agendamentos'
import { buscarUsuario, obterTiposSanguineos } from '../../api/usuario/usuario'
import './style.css'
import logoSemFundo from '../../assets/icons/logo_semfundo.png'
import LogoutModal from '../../components/jsx/LogoutModal'

function HospitalDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const [agendamentosHoje, setAgendamentosHoje] = useState([])
  const [todosAgendamentos, setTodosAgendamentos] = useState([])
  const [estatisticas, setEstatisticas] = useState({
    totalAgendamentos: 0,
    agendamentosConcluidos: 0,
    agendamentosPendentes: 0,
    agendamentosCancelados: 0
  })
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [showDetalhesModal, setShowDetalhesModal] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [tiposSanguineos, setTiposSanguineos] = useState({})

  // Verificar se é hospital
  useEffect(() => {
    if (!user || user.role !== 'HOSPITAL') {
      navigate('/hospital-login')
    }
  }, [user, navigate])

  // Carregar dados
  useEffect(() => {
    carregarDados()
  }, [])

  // Função para buscar informações completas do usuário
  const buscarDadosUsuario = async (idUsuario) => {
    try {
      console.log('========================================')
      console.log('Buscando dados do usuário ID:', idUsuario)
      const res = await buscarUsuario(idUsuario)
      console.log('Resposta completa da API buscarUsuario:', JSON.stringify(res, null, 2))
      
      if (res && res.success && res.data) {
        const userData = res.data?.usuario || res.data || {};
        console.log('userData recebido:', JSON.stringify(userData, null, 2))
        
        // Mapear o ID do tipo sanguíneo para o tipo correspondente
        const tiposSanguineos = {
          1: 'A+', 2: 'A-', 3: 'B+', 4: 'B-',
          5: 'AB+', 6: 'AB-', 7: 'O+', 8: 'O-'
        };
        
        // Extrair o ID do tipo sanguíneo do usuário de diferentes possíveis campos
        let idTipoSanguineo = userData.id_tipo_sanguineo || 
                             userData.idTipoSanguineo || 
                             userData.tipo_sanguineo?.id ||
                             userData.tipoSanguineo?.id ||
                             userData.tipo_sanguineo_id ||
                             (userData.tipo_sanguineo && parseInt(userData.tipo_sanguineo)) ||
                             (userData.tipoSanguineo && parseInt(userData.tipoSanguineo));
        
        // Se for string, converter para número
        if (typeof idTipoSanguineo === 'string') {
          idTipoSanguineo = parseInt(idTipoSanguineo, 10);
        }
        
        console.log('ID do tipo sanguíneo encontrado:', idTipoSanguineo)
        console.log('Tipos sanguíneos disponíveis:', tiposMap)
        
        // Determinar o tipo sanguíneo - prioridade: nome direto > mapeamento por ID > campos alternativos
        let tipoSanguineo = 'Não informado';
        
        // Primeiro verifica se já tem o tipo sanguíneo como texto
        if (userData.tipo_sanguineo_nome) {
          tipoSanguineo = userData.tipo_sanguineo_nome;
          console.log('Tipo sanguíneo veio de tipo_sanguineo_nome:', tipoSanguineo)
        } 
        else if (typeof userData.tipo_sanguineo === 'string' && userData.tipo_sanguineo !== '') {
          tipoSanguineo = userData.tipo_sanguineo;
          console.log('Tipo sanguíneo veio como string:', tipoSanguineo)
        } 
        else if (typeof userData.tipoSanguineo === 'string' && userData.tipoSanguineo !== '') {
          tipoSanguineo = userData.tipoSanguineo;
          console.log('Tipo sanguíneo veio como tipoSanguineo:', tipoSanguineo)
        } 
        else if (idTipoSanguineo && tiposMap[idTipoSanguineo]) {
          tipoSanguineo = tiposMap[idTipoSanguineo];
          console.log(`Tipo sanguíneo mapeado: ID ${idTipoSanguineo} -> ${tipoSanguineo}`)
        } 
        else if (userData.tipo_sanguineo_obj?.tipo) {
          tipoSanguineo = userData.tipo_sanguineo_obj.tipo;
          console.log('Tipo sanguíneo veio de tipo_sanguineo_obj:', tipoSanguineo)
        } 
        else if (userData.tipoSanguineoObj?.tipo) {
          tipoSanguineo = userData.tipoSanguineoObj.tipo;
          console.log('Tipo sanguíneo veio de tipoSanguineoObj:', tipoSanguineo)
        } 
        else {
          console.warn('⚠️ Tipo sanguíneo não encontrado! ID:', idTipoSanguineo, 'userData:', userData)
        }
        
        console.log(`✅ Tipo sanguíneo final: ${tipoSanguineo}`)
        // Retornar os dados do usuário com o tipo sanguíneo incluído
        const result = {
          ...userData,
          tipoSanguineo: tipoSanguineo,
          id_tipo_sanguineo: idTipoSanguineo,
          tipo_sanguineo_nome: tipoSanguineo
        };
        
        return result;
      }
      
      // Usuário não encontrado ou erro na resposta
      return { 
        id: idUsuario, 
        nome: 'Usuário não encontrado',
        tipoSanguineo: 'Não informado'
      }
    } catch (error) {
      // Erro ao buscar dados do usuário
      return { 
        id: idUsuario, 
        nome: 'Erro ao carregar',
        tipoSanguineo: 'Não informado'
      }
    }
  }

  const carregarDados = async () => {
    setLoading(true)
    
    try {
      // Carregar tipos sanguíneos da API
      const resTipos = await obterTiposSanguineos()
      
      let tiposMap = {
        1: 'A+', 2: 'A-', 3: 'B+', 4: 'B-',
        5: 'AB+', 6: 'AB-', 7: 'O+', 8: 'O-'
      };
      
      if (resTipos.success && resTipos.data) {
        // Criar mapeamento dinâmico a partir da API
        tiposMap = resTipos.data.reduce((acc, tipo) => {
          acc[tipo.id] = tipo.tipo;
          return acc;
        }, {});
      }
      
      setTiposSanguineos(tiposMap)
      
      // Carregar agendamentos de hoje
      const resHoje = await obterAgendamentosHoje()
      
      if (resHoje.success) {
        setAgendamentosHoje(resHoje.data)
      }

      // Carregar todos os agendamentos
      const resTodos = await listarAgendamentosHospital()
      
      if (resTodos.success) {

        // Criar um array para armazenar os agendamentos com os dados completos do usuário
        const agendamentosComUsuarios = await Promise.all(
          resTodos.data.map(async (agendamento) => {
            try {
              const dadosUsuario = await buscarDadosUsuario(agendamento.id_usuario, tiposMap)
              
              return {
                ...agendamento,
                usuario: {
                  ...dadosUsuario,
                  id: agendamento.id_usuario,
                  nome: dadosUsuario?.nome || 'Usuário não encontrado',
                  email: dadosUsuario?.email || '',
                  telefone: dadosUsuario?.numero || dadosUsuario?.telefone || '',
                  tipoSanguineo: dadosUsuario?.tipoSanguineo || 'Não informado'
                }
              }
            } catch (error) {
              // Erro ao buscar dados do usuário
              return {
                ...agendamento,
                usuario: {
                  id: agendamento.id_usuario,
                  nome: 'Erro ao carregar',
                  email: '',
                  tipoSanguineo: 'N/A'
                }
              }
            }
          })
        )

        setTodosAgendamentos(agendamentosComUsuarios)
      } else {
        }

      // Carregar estatísticas
      const resEstatisticas = await obterEstatisticasHospital()
      
      if (resEstatisticas.success) {
        const estatisticasAtualizadas = {
          totalAgendamentos: resEstatisticas.data.totalAgendamentos || 0,
          agendamentosConcluidos: resEstatisticas.data.agendamentosConcluidos || 0,
          agendamentosPendentes: resEstatisticas.data.agendamentosPendentes || 0,
          agendamentosCancelados: resEstatisticas.data.agendamentosCancelados || 0
        }
        setEstatisticas(estatisticasAtualizadas)
      } else {
      }
    } catch (error) {
      // Erro ao carregar dados
    } finally {
      setLoading(false)
    }
  }

  const handleConcluirDoacao = async (agendamentoId) => {
    if (!window.confirm('Confirmar conclusão desta doação?')) return
    
    setProcessando(true)
    try {
      const result = await concluirDoacao(agendamentoId)
      if (result.success) {
        alert('Doação concluída com sucesso!')
        await carregarDados() // Recarregar dados
        setShowDetalhesModal(false)
      } else {
        alert(result.message || 'Erro ao concluir doação')
      }
    } catch (error) {
      alert('Erro ao processar solicitação')
    } finally {
      setProcessando(false)
    }
  }

  const handleCancelarAgendamento = async (agendamentoId) => {
    const motivo = prompt('Digite o motivo do cancelamento:')
    if (!motivo) return
    
    setProcessando(true)
    try {
      const result = await cancelarAgendamentoHospital(agendamentoId, motivo)
      if (result.success) {
        alert('Agendamento cancelado com sucesso!')
        await carregarDados()
        setShowDetalhesModal(false)
      } else {
        alert(result.message || 'Erro ao cancelar agendamento')
      }
    } catch (error) {
      alert('Erro ao processar solicitação')
    } finally {
      setProcessando(false)
    }
  }

  // Função para formatar data no formato dd/mm/aaaa
  const formatarData = (dataStr) => {
    if (!dataStr) return 'Data não informada'
    try {
      // Adiciona o fuso horário para evitar problemas com a diferença de um dia
      const data = new Date(dataStr)
      
      // Ajusta para o fuso horário local
      const dataAjustada = new Date(data.getTime() + (data.getTimezoneOffset() * 60 * 1000))
      
      if (isNaN(dataAjustada.getTime())) {
        // Se não for uma data válida, tenta extrair data de strings como '2023-01-01'
        const match = dataStr.match(/(\d{4}-\d{2}-\d{2})/)
        if (match) {
          const [ano, mes, dia] = match[1].split('-')
          // Cria a data no formato local
          return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR')
        }
        return dataStr // Retorna o valor original se não conseguir formatar
      }
      
      // Formata a data ajustada
      return dataAjustada.toLocaleDateString('pt-BR')
    } catch (error) {
      return dataStr || 'Data inválida'
    }
  }

  // Função para formatar hora - exibe o horário corretamente
  const formatarHora = (horaStr) => {
    if (!horaStr) return 'Horário não informado'
    
    try {
      // Se for um objeto Date
      if (horaStr instanceof Date) {
        return horaStr.toTimeString().substring(0, 5)
      }
      
      // Se for um timestamp
      if (/^\d+$/.test(horaStr)) {
        return new Date(parseInt(horaStr)).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      }
      
      // Se for uma string de data/hora ISO
      if (typeof horaStr === 'string' && horaStr.includes('T')) {
        const [horaPart] = horaStr.split('T')[1]?.split('.') || [];
        if (horaPart) {
          return horaPart.substring(0, 5); // Retorna HH:MM
        }
      }
      
      // Se já estiver no formato HH:MM ou HH:MM:SS
      const matchHora = horaStr.match(/(\d{1,2}):(\d{2})(?::\d{2})?/);
      if (matchHora) {
        // Formata para garantir 2 dígitos
        const horas = matchHora[1].padStart(2, '0');
        const minutos = matchHora[2].padStart(2, '0');
        return `${horas}:${minutos}`;
      }
      
      // Se for um objeto com propriedades de data/hora
      if (typeof horaStr === 'object' && horaStr !== null) {
        if (horaStr.hora !== undefined && horaStr.minuto !== undefined) {
          return `${String(horaStr.hora).padStart(2, '0')}:${String(horaStr.minuto).padStart(2, '0')}`;
        }
        return 'Formato inválido';
      }
      
      // Para qualquer outro formato, retorna o valor original
      return String(horaStr);
    } catch (error) {
      return 'Horário inválido';
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Agendado':
      case 'Em espera':
        return '#ffc107'
      case 'Concluído':
        return '#28a745'
      case 'Cancelado':
        return '#dc3545'
      default:
        return '#6c757d'
    }
  }

  const agendamentosFiltrados = filtroStatus === 'todos' 
    ? todosAgendamentos 
    : todosAgendamentos.filter(a => a.status === filtroStatus)

  const handleLogout = () => {
    logout()
    navigate('/hospital-login')
  }

  if (loading) {
    return (
      <div className="hospital-dashboard">
        <div className="loading-dashboard">
          <div className="loading-spinner"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hospital-dashboard">
      {/* Header Premium */}
      <header className="dashboard-header">
        <div className="header-bg-pattern"></div>
        <div className="header-content">
          <div className="header-left">
            <div className="brand-section">
              <img src={logoSemFundo} alt="DoeVida" className="header-logo" />
              <div className="brand-info">
                <h1>Dashboard Hospital</h1>
                <p>{user?.nome || 'Hospital'}</p>
              </div>
            </div>
          </div>

          <div className="header-right">
            <button 
              className="btn-perfil"
              onClick={() => navigate('/hospital-perfil')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Perfil</span>
            </button>
            
            <button 
              className="btn-logout"
              onClick={() => setShowLogoutModal(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Estatísticas */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card total">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Total de Agendamentos</h3>
              <p className="stat-number">{estatisticas.totalAgendamentos}</p>
            </div>
          </div>

          <div className="stat-card concluidos">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Doações Concluídas</h3>
              <p className="stat-number">{estatisticas.agendamentosConcluidos}</p>
            </div>
          </div>

          <div className="stat-card pendentes">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Pendentes</h3>
              <p className="stat-number">{estatisticas.agendamentosPendentes}</p>
            </div>
          </div>

          <div className="stat-card cancelados">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="m15 9-6 6m0-6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Cancelados</h3>
              <p className="stat-number">{estatisticas.agendamentosCancelados}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Agendamentos de Hoje */}
      <section className="hoje-section">
        <div className="section-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Agendamentos de Hoje
          </h2>
          <span className="badge-count">{agendamentosHoje.length}</span>
        </div>

        <div className="agendamentos-hoje-grid">
          {agendamentosHoje.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#ccc" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#ccc" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3>Nenhum agendamento para hoje</h3>
              <p>Não há doações agendadas para o dia de hoje</p>
            </div>
          ) : (
            agendamentosHoje.map((agendamento) => (
              <div 
                key={agendamento.id} 
                className="agendamento-card-hoje"
                onClick={() => {
                  setAgendamentoSelecionado(agendamento)
                  setShowDetalhesModal(true)
                }}
              >
                <div className="agendamento-header">
                  <div className="doador-info">
                    <div className="doador-avatar">
                      {agendamento.usuario?.nome?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h4>{agendamento.usuario?.nome || 'Doador'}</h4>
                      <p className="tipo-sanguineo-badge">
                        🩸 {agendamento.usuario?.tipoSanguineo || 'Tipo não informado'}
                      </p>
                    </div>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(agendamento.status) }}
                  >
                    {agendamento.status}
                  </span>
                </div>

                <div className="agendamento-detalhes">
                  <div className="detalhe-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>{formatarHora(agendamento.hora)}</span>
                  </div>
                  <div className="detalhe-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{agendamento.usuario?.telefone || 'Não informado'}</span>
                  </div>
                </div>

                {agendamento.status === 'Agendado' && (
                  <div className="agendamento-acoes">
                    <button 
                      className="btn-acao concluir"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleConcluirDoacao(agendamento.id)
                      }}
                      disabled={processando}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Concluir
                    </button>
                    <button 
                      className="btn-acao cancelar"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCancelarAgendamento(agendamento.id)
                      }}
                      disabled={processando}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="m15 9-6 6m0-6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Todos os Agendamentos */}
      <section className="todos-agendamentos-section">
        <div className="section-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Todos os Agendamentos
          </h2>
          
          <div className="filtros">
            <button 
              className={`filtro-btn ${filtroStatus === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('todos')}
            >
              Todos
            </button>
            <button 
              className={`filtro-btn ${filtroStatus === 'Agendado' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('Agendado')}
            >
              Agendados
            </button>
            <button 
              className={`filtro-btn ${filtroStatus === 'Concluído' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('Concluído')}
            >
              Concluídos
            </button>
            <button 
              className={`filtro-btn ${filtroStatus === 'Cancelado' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('Cancelado')}
            >
              Cancelados
            </button>
          </div>
        </div>

        <div className="agendamentos-table-container">
          {agendamentosFiltrados.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="#ccc" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>Nenhum agendamento encontrado</h3>
              <p>Não há agendamentos com o filtro selecionado</p>
            </div>
          ) : (
            <table className="agendamentos-table">
              <thead>
                <tr>
                  <th>Doador</th>
                  <th>Tipo Sanguíneo</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentosFiltrados.map((agendamento) => (
                  <tr key={agendamento.id}>
                    <td>
                      <div className="doador-cell">
                        <div className="doador-avatar-small">
                          {agendamento.usuario?.nome?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <div className="doador-nome">{agendamento.usuario?.nome || 'Doador'}</div>
                          <div className="doador-email">{agendamento.usuario?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <span style={{ 
                          backgroundColor: agendamento.usuario?.tipoSanguineo && agendamento.usuario.tipoSanguineo !== 'N/A' ? '#990410' : '#ccc',
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          color: 'white',
                          fontWeight: 'bold',
                          minWidth: '50px',
                          textAlign: 'center',
                          fontSize: '14px'
                        }}>
                          {agendamento.usuario?.tipoSanguineo || 'N/A'}
                        </span>
                        <div style={{
                          fontSize: '10px',
                          color: agendamento.usuario?.tipoSanguineo && agendamento.usuario.tipoSanguineo !== 'N/A' ? '#666' : '#999',
                          marginTop: '4px',
                          fontStyle: 'italic'
                        }}>
                          {agendamento.usuario?.tipoSanguineo && agendamento.usuario.tipoSanguineo !== 'N/A' 
                            ? 'Tipo Sanguíneo' 
                            : 'Não informado'}
                        </div>
                      </div>
                    </td>
                    <td>{formatarData(agendamento.data)}</td>
                    <td>{formatarHora(agendamento.hora)}</td>
                    <td>
                      <span 
                        className="status-badge-table"
                        style={{ backgroundColor: getStatusColor(agendamento.status) }}
                      >
                        {agendamento.status}
                      </span>
                    </td>
                    <td>
                      <div className="acoes-table">
                        <button 
                          className="btn-table-acao ver"
                          onClick={() => {
                            setAgendamentoSelecionado(agendamento)
                            setShowDetalhesModal(true)
                          }}
                          title="Ver detalhes"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                        {agendamento.status === 'Agendado' && (
                          <>
                            <button 
                              className="btn-table-acao concluir"
                              onClick={() => handleConcluirDoacao(agendamento.id)}
                              disabled={processando}
                              title="Concluir doação"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button 
                              className="btn-table-acao cancelar"
                              onClick={() => handleCancelarAgendamento(agendamento.id)}
                              disabled={processando}
                              title="Cancelar agendamento"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="m15 9-6 6m0-6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Modal de Detalhes */}
      {showDetalhesModal && agendamentoSelecionado && (
        <div className="modal-overlay" onClick={() => setShowDetalhesModal(false)}>
          <div className="modal-detalhes" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalhes do Agendamento</h3>
              <button 
                className="btn-close-modal"
                onClick={() => setShowDetalhesModal(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="info-group">
                <h4>Informações do Doador</h4>
                <div className="info-item">
                  <span className="label">Nome:</span>
                  <span className="value">{agendamentoSelecionado.usuario?.nome || 'Não informado'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{agendamentoSelecionado.usuario?.email || 'Não informado'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Telefone:</span>
                  <span className="value">{agendamentoSelecionado.usuario?.telefone || 'Não informado'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tipo Sanguíneo:</span>
                  <span className="value tipo-destaque">🩸 {agendamentoSelecionado.usuario?.tipoSanguineo || 'Não informado'}</span>
                </div>
              </div>

              <div className="info-group">
                <h4>Informações do Agendamento</h4>
                <div className="info-item">
                  <span className="label">Data:</span>
                  <span className="value">{formatarData(agendamentoSelecionado.data)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Horário:</span>
                  <span className="value">{formatarHora(agendamentoSelecionado.hora)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span 
                    className="value status-destaque"
                    style={{ color: getStatusColor(agendamentoSelecionado.status) }}
                  >
                    {agendamentoSelecionado.status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">ID:</span>
                  <span className="value">#{agendamentoSelecionado.id}</span>
                </div>
              </div>
            </div>

            {agendamentoSelecionado.status === 'Agendado' && (
              <div className="modal-footer">
                <button 
                  className="btn-modal-acao concluir"
                  onClick={() => handleConcluirDoacao(agendamentoSelecionado.id)}
                  disabled={processando}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {processando ? 'Processando...' : 'Concluir Doação'}
                </button>
                <button 
                  className="btn-modal-acao cancelar"
                  onClick={() => handleCancelarAgendamento(agendamentoSelecionado.id)}
                  disabled={processando}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="m15 9-6 6m0-6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {processando ? 'Processando...' : 'Cancelar Agendamento'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Logout */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        userName={user?.nome}
      />
    </div>
  )
}

export default HospitalDashboard
