// src/api/agendamento.js
import http from '../services/http.js';

/**
 * Listar meus agendamentos
 * Endpoint: GET /agendamento/me
 */
export async function listarMeusAgendamentos(futuros = false) {
  try {
    const params = futuros ? '?futuros=1' : '';
    const res = await http.get(`/agendamento/me${params}`);
    
    return {
      success: true,
      data: res.data.agendamentos || [],
      total: res.data.items || 0
    };
  } catch (error) {
    console.error('❌ Erro ao listar agendamentos:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Erro ao carregar agendamentos'
    };
  }
}

/**
 * Buscar agendamento por ID
 * Endpoint: GET /agendamento/:id
 */
export async function buscarAgendamento(id) {
  try {
    const res = await http.get(`/agendamento/${id}`);
    
    return {
      success: true,
      data: res.data.agendamento || res.data
    };
  } catch (error) {
    console.error('❌ Erro ao buscar agendamento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar agendamento'
    };
  }
}
