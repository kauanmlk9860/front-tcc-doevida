// src/api/hospital/agendamentos.js
import http from '../../services/http.js';

/**
 * Listar todos os agendamentos do hospital logado
 * Usa o endpoint geral de agendamentos e filtra pelo hospital
 * Endpoint: GET /agendamento
 */
export async function listarAgendamentosHospital(filtros = {}) {
  try {
    console.log('📞 Chamando GET /agendamento...');
    const res = await http.get('/agendamento');
    console.log('✅ Resposta HTTP recebida - Status:', res.status);
    console.log('📊 Estrutura da resposta:', {
      status: res.status,
      dataKeys: Object.keys(res.data || {}),
      dataType: typeof res.data
    });
    
    let agendamentos = res.data.agendamentos || res.data.dados || res.data || [];
    console.log('📋 Agendamentos extraídos:', {
      isArray: Array.isArray(agendamentos),
      length: Array.isArray(agendamentos) ? agendamentos.length : 'N/A',
      firstItem: Array.isArray(agendamentos) && agendamentos.length > 0 ? agendamentos[0] : 'Nenhum'
    });
    
    // Filtrar por status se fornecido
    if (filtros.status && Array.isArray(agendamentos)) {
      agendamentos = agendamentos.filter(a => a.status === filtros.status);
    }
    
    // Filtrar por data se fornecido
    if (filtros.data && Array.isArray(agendamentos)) {
      agendamentos = agendamentos.filter(a => a.data === filtros.data);
    }
    
    const result = {
      success: res.data.status !== false,
      data: agendamentos,
      message: res.data.message
    };
    
    console.log('✅ Retornando resultado:', {
      success: result.success,
      dataLength: Array.isArray(result.data) ? result.data.length : 'N/A',
      message: result.message
    });
    
    return result;
  } catch (error) {
    console.error('❌ ERRO ao listar agendamentos:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || `Erro ao listar agendamentos: ${error.message}`
    };
  }
}

/**
 * Buscar detalhes de um agendamento específico
 * Endpoint: GET /agendamento/:id
 */
export async function buscarAgendamentoHospital(id) {
  try {
    const res = await http.get(`/agendamento/${id}`);
    
    return {
      success: res.data.status || true,
      data: res.data.agendamento || res.data,
      message: res.data.message
    };
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar agendamento'
    };
  }
}

/**
 * Confirmar conclusão de uma doação
 * Endpoint: PUT /agendamento/:id
 */
export async function concluirDoacao(id, observacoes = '') {
  try {
    const payload = {
      status: 'Concluído',
      observacoes: observacoes || null
    };
    
    const res = await http.put(`/agendamento/${id}`, payload);
    
    return {
      success: res.data.status || true,
      data: res.data.agendamento || res.data,
      message: res.data.message || 'Doação confirmada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao concluir doação:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao concluir doação'
    };
  }
}

/**
 * Cancelar um agendamento
 * Endpoint: DELETE /agendamento/:id
 */
export async function cancelarAgendamentoHospital(id, motivo = '') {
  try {
    const res = await http.delete(`/agendamento/${id}`);
    
    return {
      success: res.data.status || true,
      data: res.data.agendamento || res.data,
      message: res.data.message || 'Agendamento cancelado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao cancelar agendamento'
    };
  }
}

/**
 * Atualizar status de um agendamento
 * Endpoint: PUT /agendamento/:id
 */
export async function atualizarStatusAgendamento(id, novoStatus, dados = {}) {
  try {
    const payload = {
      status: novoStatus,
      ...dados
    };
    
    const res = await http.put(`/agendamento/${id}`, payload);
    
    return {
      success: res.data.status || true,
      data: res.data.agendamento || res.data,
      message: res.data.message || 'Status atualizado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao atualizar status'
    };
  }
}

/**
 * Obter estatísticas do hospital
 * Calcula estatísticas baseado nos agendamentos
 */
export async function obterEstatisticasHospital(periodo = 'mes') {
  try {
    // Buscar todos os agendamentos
    const res = await http.get('/agendamento');
    const agendamentos = res.data.agendamentos || res.data.dados || res.data || [];
    
    // Calcular estatísticas
    const stats = {
      totalAgendamentos: agendamentos.length,
      agendamentosConcluidos: agendamentos.filter(a => a.status === 'Concluído').length,
      agendamentosPendentes: agendamentos.filter(a => a.status === 'Agendado' || a.status === 'Em espera').length,
      agendamentosCancelados: agendamentos.filter(a => a.status === 'Cancelado').length
    };
    
    return {
      success: true,
      data: stats,
      message: 'Estatísticas calculadas com sucesso'
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return {
      success: false,
      data: {
        totalAgendamentos: 0,
        agendamentosConcluidos: 0,
        agendamentosPendentes: 0,
        agendamentosCancelados: 0
      },
      message: error.response?.data?.message || 'Erro ao carregar estatísticas'
    };
  }
}

/**
 * Obter agendamentos de hoje
 * Filtra agendamentos pela data atual
 */
export async function obterAgendamentosHoje() {
  try {
    const res = await http.get('/agendamento');
    const agendamentos = res.data.agendamentos || res.data.dados || res.data || [];
    
    // Obter data de hoje no formato YYYY-MM-DD
    const hoje = new Date().toISOString().split('T')[0];
    
    // Filtrar agendamentos de hoje
    const agendamentosHoje = agendamentos.filter(a => {
      if (!a.data) return false;
      // Normalizar data para comparação
      const dataAgendamento = a.data.split('T')[0];
      return dataAgendamento === hoje;
    });
    
    return {
      success: true,
      data: agendamentosHoje,
      message: 'Agendamentos de hoje carregados'
    };
  } catch (error) {
    console.error('Erro ao buscar agendamentos de hoje:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Erro ao buscar agendamentos'
    };
  }
}
