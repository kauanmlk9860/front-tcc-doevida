import http from '../../services/http.js';

/**
 * Busca o histórico de agendamentos do usuário logado
 * @returns {Promise} Resposta da API com lista de agendamentos
 */
export const buscarHistoricoAgendamento = async () => {
  try {
    const response = await http.get('/agendamento/historico');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao buscar histórico de agendamentos:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar histórico de agendamentos',
      error: error.response?.data || error.message
    };
  }
};

/**
 * Busca todos os agendamentos do usuário
 * @returns {Promise} Resposta da API com lista de agendamentos
 */
export const listarAgendamentos = async () => {
  try {
    const response = await http.get('/agendamento');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao listar agendamentos',
      error: error.response?.data || error.message
    };
  }
};

/**
 * Cancela um agendamento
 * @param {number} id - ID do agendamento a ser cancelado
 * @returns {Promise} Resposta da API
 */
export const cancelarAgendamento = async (id) => {
  try {
    const response = await http.delete(`/agendamento/${id}`);
    return {
      success: true,
      data: response.data,
      message: 'Agendamento cancelado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao cancelar agendamento',
      error: error.response?.data || error.message
    };
  }
};

/**
 * Busca detalhes de um agendamento específico
 * @param {number} id - ID do agendamento
 * @returns {Promise} Resposta da API com detalhes do agendamento
 */
export const buscarDetalhesAgendamento = async (id) => {
  try {
    const response = await http.get(`/agendamento/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do agendamento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar detalhes do agendamento',
      error: error.response?.data || error.message
    };
  }
};
