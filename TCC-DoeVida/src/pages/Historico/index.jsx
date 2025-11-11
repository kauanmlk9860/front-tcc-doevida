import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarMeusAgendamentos } from '../../api/agendamento/agendamento';
import logoSemFundo from '../../assets/icons/logo_semfundo.png';
import './style.css';

function Historico() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    setLoading(true);
    setError(null);

    try {
      // Buscar todos os agendamentos do usuário (não apenas futuros)
      const response = await listarMeusAgendamentos(false);

      if (response.success && response.data) {
        // Processar dados da API
        let agendamentosData = Array.isArray(response.data) ? response.data : [];

        // Mapear para formato esperado
        const agendamentosFormatados = agendamentosData.map((a, index) => ({
          id: a.id,
          numero: `Doação ${String(agendamentosData.length - index).padStart(2, '0')}`,
          hospital: a.hospital?.nome || a.nome_hospital || 'Hospital',
          data: a.data,
          horario: a.hora,
          status: a.status?.toLowerCase() || 'agendado',
          endereco: a.hospital?.endereco || a.endereco_hospital,
          telefone: a.hospital?.telefone || a.telefone_hospital,
          id_hospital: a.id_hospital
        }));

        // Ordenar por data (mais recentes primeiro)
        agendamentosFormatados.sort((a, b) => {
          const dateA = new Date(a.data);
          const dateB = new Date(b.data);
          return dateB - dateA;
        });

        setAgendamentos(agendamentosFormatados);
      } else {
        // Se não houver dados, mostrar lista vazia
        setAgendamentos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      // Se houver erro na API, mostrar tela vazia ao invés de erro
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/home');
  };

  const formatarData = (data) => {
    if (!data) return '05/07/2025';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  const formatarHorario = (horario) => {
    if (!horario) return '09:00';
    
    // Se vier no formato ISO (1970-01-01T09:00:00.000Z)
    if (horario.includes && horario.includes('T')) {
      const date = new Date(horario);
      const horas = date.getUTCHours().toString().padStart(2, '0');
      const minutos = date.getUTCMinutes().toString().padStart(2, '0');
      return `${horas}:${minutos}`;
    }
    
    return horario;
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'agendado': { label: 'Em espera', className: 'status-em-espera' },
      'em espera': { label: 'Em espera', className: 'status-em-espera' },
      'em_espera': { label: 'Em espera', className: 'status-em-espera' },
      'pendente': { label: 'Em espera', className: 'status-em-espera' },
      'confirmado': { label: 'Confirmado', className: 'status-confirmado' },
      'concluído': { label: 'Concluído', className: 'status-concluido' },
      'concluido': { label: 'Concluído', className: 'status-concluido' },
      'cancelado': { label: 'Cancelado', className: 'status-cancelado' }
    };

    return statusMap[status?.toLowerCase()] || statusMap['agendado'];
  };

  // Filtrar agendamentos pela busca
  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    if (!searchTerm) return true;
    const termo = searchTerm.toLowerCase();
    return (
      agendamento.numero?.toLowerCase().includes(termo) ||
      agendamento.hospital?.toLowerCase().includes(termo)
    );
  });

  if (loading) {
    return (
      <div className="historico-container">
        <div className="historico-loading">
          <div className="loading-spinner-historico"></div>
          <p>Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historico-container">
        <div className="historico-error">
          <h2>Erro ao carregar histórico</h2>
          <p>{error}</p>
          <button onClick={carregarHistorico} className="btn-retry">
            Tentar Novamente
          </button>
          <button onClick={handleVoltar} className="btn-voltar-error">
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="historico-container">
      {/* HEADER PREMIUM */}
      <header className="historico-header">
        <div className="historico-header-content">
          <button 
            className="btn-voltar-historico" 
            onClick={handleVoltar}
            aria-label="Voltar para home"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="historico-title-section">
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Histórico de Doação</h1>
          </div>

          <div className="historico-search-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Find Seekers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="historico-search"
            />
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="historico-main">
        {agendamentosFiltrados.length === 0 ? (
          <div className="historico-empty">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#990410" opacity="0.2"/>
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="#990410" strokeWidth="2"/>
            </svg>
            <h2>Nenhum agendamento encontrado</h2>
            <p>
              {searchTerm 
                ? 'Tente buscar com outros termos'
                : 'Você ainda não possui agendamentos'
              }
            </p>
            <button onClick={() => navigate('/hospitais')} className="btn-agendar-empty">
              Agendar Primeira Doação
            </button>
          </div>
        ) : (
          <div className="historico-list">
            {agendamentosFiltrados.map((agendamento, index) => {
              const statusInfo = getStatusInfo(agendamento.status);

              return (
                <article 
                  key={agendamento.id} 
                  className="agendamento-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="agendamento-card-content">
                    <div className="agendamento-header">
                      <h3 className="agendamento-numero">{agendamento.numero}</h3>
                      <span className={`agendamento-status ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="agendamento-info">
                      <div className="info-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#990410" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 22V12h6v10" stroke="#990410" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <span className="info-label">Local</span>
                          <span className="info-value">{agendamento.hospital}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="#990410" strokeWidth="2"/>
                          <path d="M16 2v4M8 2v4M3 10h18" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <span className="info-label">Data</span>
                          <span className="info-value">{formatarData(agendamento.data)}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="#990410" strokeWidth="2"/>
                          <path d="M12 6v6l4 2" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <span className="info-label">Horário</span>
                          <span className="info-value">{formatarHorario(agendamento.horario)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Historico;
