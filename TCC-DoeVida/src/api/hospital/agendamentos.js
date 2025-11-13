// src/api/hospital/agendamentos.js
import http from '../../services/http.js';

/**
 * Listar todos os agendamentos do hospital logado
 * Usa o endpoint geral de agendamentos e filtra pelo hospital
 * Endpoint: GET /agendamento
 */
export async function listarAgendamentosHospital(filtros = {}) {
  try {
    console.log('📞 Buscando agendamentos do hospital...');
    
    // Tentar endpoint específico do hospital primeiro
    let res;
    try {
      res = await http.get('/hospital/agendamentos');
      console.log('✅ Resposta de /hospital/agendamentos:', res.data);
    } catch (hospitalError) {
      // Se não existir, usar endpoint geral
      console.log('⚠️ Endpoint /hospital/agendamentos não disponível, usando /agendamento');
      res = await http.get('/agendamento');
      console.log('✅ Resposta de /agendamento:', res.data);
    }
    
    // Extrair agendamentos de diferentes estruturas
    let agendamentos = [];
    
    if (Array.isArray(res.data)) {
      agendamentos = res.data;
    } else if (res.data.agendamentos && Array.isArray(res.data.agendamentos)) {
      agendamentos = res.data.agendamentos;
    } else if (res.data.dados && Array.isArray(res.data.dados)) {
      agendamentos = res.data.dados;
    } else if (res.data.data && Array.isArray(res.data.data)) {
      agendamentos = res.data.data;
    }
    
    console.log('📋 Total de agendamentos encontrados:', agendamentos.length);
    
    // Aplicar filtros
    if (filtros.status) {
      agendamentos = agendamentos.filter(a => a.status === filtros.status);
    }
    
    if (filtros.data) {
      agendamentos = agendamentos.filter(a => a.data === filtros.data);
    }
    
    return {
      success: true,
      data: agendamentos,
      message: 'Agendamentos carregados'
    };
  } catch (error) {
    console.error('❌ Erro ao listar agendamentos:', error.response?.data || error.message);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || `Erro: ${error.message}`
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
 * Endpoint: PATCH /agendamento/:id/status
 */
export async function concluirDoacao(id) {
  try {
    console.log('🔄 Concluindo doação ID:', id);
    
    // Buscar agendamento completo
    const response = await http.get(`/agendamento/${id}`);
    console.log('📥 Response completo:', JSON.stringify(response.data, null, 2));
    
    // Extrair dados do agendamento
    let dados;
    if (response.data.agendamento) {
      dados = response.data.agendamento;
    } else if (response.data.data) {
      dados = response.data.data;
    } else {
      dados = response.data;
    }
    
    console.log('📋 Dados do agendamento:', JSON.stringify(dados, null, 2));
    
    // Validar campos obrigatórios
    if (!dados.id_usuario || !dados.id_hospital || !dados.data || !dados.hora) {
      console.error('❌ Campos faltando:', { 
        id_usuario: dados.id_usuario, 
        id_hospital: dados.id_hospital, 
        data: dados.data, 
        hora: dados.hora 
      });
      return {
        success: false,
        message: 'Dados do agendamento incompletos'
      };lj
    }
    
    // Formatar data (YYYY-MM-DD)
    let dataFormatada = dados.data;
    if (typeof dados.data === 'string' && dados.data.includes('T')) {
      dataFormatada = dados.data.split('T')[0];
    }
    
    // Formatar hora (HH:MM:SS)
    let horaFormatada = dados.hora;
    if (typeof dados.hora === 'object' && dados.hora !== null) {
      // Se hora é um objeto Date
      const horaDate = new Date(dados.hora);
      horaFormatada = horaDate.toISOString().substring(11, 19);
    } else if (typeof dados.hora === 'string') {
      if (dados.hora.includes('T')) {
        horaFormatada = new Date(dados.hora).toISOString().substring(11, 19);
      } else if (dados.hora.length === 5) {
        horaFormatada = `${dados.hora}:00`;
      } else if (dados.hora.length === 8) {
        horaFormatada = dados.hora;
      }
    }
    
    // Montar payload
    const payload = {
      status: 'Concluído',
      data: dataFormatada,
      hora: horaFormatada,
      id_usuario: Number(dados.id_usuario),
      id_hospital: Number(dados.id_hospital)
    };
    
    // Adicionar id_doacao se existir
    if (dados.id_doacao && Number(dados.id_doacao) > 0) {
      payload.id_doacao = Number(dados.id_doacao);
    }
    
    console.log('📤 Payload:', JSON.stringify(payload, null, 2));
    
    const res = await http.put(`/agendamento/${id}`, payload);
    
    console.log('✅ Sucesso:', res.data);
    return {
      success: true,
      data: res.data,
      message: 'Doação concluída!'
    };
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao concluir doação'
    };
  }
}

/**
 * Cancelar um agendamento
 * Endpoint: PUT /agendamento/:id
 */
export async function cancelarAgendamentoHospital(id) {
  try {
    console.log('🔄 Cancelando agendamento ID:', id);
    
    // Buscar agendamento completo
    const response = await http.get(`/agendamento/${id}`);
    const dados = response.data.agendamento || response.data.data || response.data;
    
    // Validar campos obrigatórios
    if (!dados.id_usuario || !dados.id_hospital || !dados.data || !dados.hora) {
      return {
        success: false,
        message: 'Dados do agendamento incompletos'
      };
    }
    
    // Formatar data (YYYY-MM-DD)
    let dataFormatada = dados.data;
    if (typeof dados.data === 'string' && dados.data.includes('T')) {
      dataFormatada = dados.data.split('T')[0];
    }
    
    // Formatar hora (HH:MM:SS)
    let horaFormatada = dados.hora;
    if (typeof dados.hora === 'string' && dados.hora.includes('T')) {
      horaFormatada = new Date(dados.hora).toISOString().substring(11, 19);
    } else if (typeof dados.hora === 'string' && dados.hora.length === 5) {
      horaFormatada = `${dados.hora}:00`;
    } else if (typeof dados.hora === 'string' && dados.hora.length === 8) {
      horaFormatada = dados.hora;
    }
    
    // Montar payload
    const payload = {
      status: 'Cancelado',
      data: dataFormatada,
      hora: horaFormatada,
      id_usuario: Number(dados.id_usuario),
      id_hospital: Number(dados.id_hospital)
    };
    
    // Adicionar id_doacao se existir
    if (dados.id_doacao && Number(dados.id_doacao) > 0) {
      payload.id_doacao = Number(dados.id_doacao);
    }
    
    const res = await http.put(`/agendamento/${id}`, payload);
    
    console.log('✅ Agendamento cancelado:', res.data);
    return {
      success: true,
      data: res.data,
      message: 'Agendamento cancelado com sucesso!'
    };
  } catch (error) {
    console.error('❌ Erro ao cancelar:', error.response?.data || error.message);
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
