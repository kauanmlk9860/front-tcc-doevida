// src/api/hospital.js
import http from '../services/http.js';

/**
 * Listar todos os hospitais
 * Endpoint: GET /hospital
 */
export async function listarHospitais() {
  try {
    const res = await http.get('/hospital');
    
    return {
      success: true,
      data: res.data.hospitais || res.data.dados || res.data || [],
      total: res.data.items || 0
    };
  } catch (error) {
    console.error('❌ Erro ao listar hospitais:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Erro ao carregar hospitais'
    };
  }
}

/**
 * Buscar hospital por ID
 * Endpoint: GET /hospital/:id
 */
export async function buscarHospital(id) {
  try {
    const res = await http.get(`/hospital/${id}`);
    
    return {
      success: true,
      data: res.data.hospital || res.data
    };
  } catch (error) {
    console.error('❌ Erro ao buscar hospital:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar hospital'
    };
  }
}
