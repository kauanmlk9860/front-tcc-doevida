// src/api/registroDoacao.js
import http from '../services/http.js';

/**
 * Upload de foto do comprovante de doação
 * Endpoint: POST /registro-doacao/upload-comprovante
 */
export async function uploadComprovanteDoacao(file) {
  try {
    const formData = new FormData();
    formData.append('foto_comprovante', file);

    const res = await http.post('/registro-doacao/upload-comprovante', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      success: true,
      url: res.data.url,
      message: res.data.message
    };
  } catch (error) {
    console.error('❌ Erro ao fazer upload:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao fazer upload da foto'
    };
  }
}

/**
 * Buscar dados do agendamento para pré-preencher formulário
 * Endpoint: GET /registro-doacao/dados-agendamento/:id
 */
export async function obterDadosAgendamento(idAgendamento) {
  try {
    const res = await http.get(`/registro-doacao/dados-agendamento/${idAgendamento}`);
    
    return {
      success: true,
      data: res.data.dados,
      message: res.data.message
    };
  } catch (error) {
    console.error('❌ Erro ao buscar dados:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar dados do agendamento'
    };
  }
}

/**
 * Criar novo registro de doação
 * Endpoint: POST /registro-doacao
 */
export async function criarRegistroDoacao(dados) {
  try {
    const res = await http.post('/registro-doacao', dados);
    
    return {
      success: true,
      data: res.data.registro,
      message: res.data.message || 'Registro criado com sucesso!'
    };
  } catch (error) {
    console.error('❌ Erro ao criar registro:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao criar registro de doação'
    };
  }
}

/**
 * Listar histórico de registros do usuário logado
 * Endpoint: GET /registro-doacao/historico/me
 */
export async function listarHistoricoRegistros() {
  try {
    const res = await http.get('/registro-doacao/historico/me');
    
    return {
      success: true,
      data: res.data.registros || [],
      total: res.data.items || 0,
      message: res.data.message
    };
  } catch (error) {
    console.error('❌ Erro ao listar histórico:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Erro ao carregar histórico'
    };
  }
}

/**
 * Buscar registro específico por ID
 * Endpoint: GET /registro-doacao/:id
 */
export async function buscarRegistroDoacao(id) {
  try {
    const res = await http.get(`/registro-doacao/${id}`);
    
    return {
      success: true,
      data: res.data.registro,
      message: res.data.message
    };
  } catch (error) {
    console.error('❌ Erro ao buscar registro:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar registro'
    };
  }
}

/**
 * Atualizar registro de doação (apenas observação e foto)
 * Endpoint: PUT /registro-doacao/:id
 */
export async function atualizarRegistroDoacao(id, dados) {
  try {
    const res = await http.put(`/registro-doacao/${id}`, dados);
    
    return {
      success: true,
      data: res.data.registro,
      message: res.data.message || 'Registro atualizado com sucesso!'
    };
  } catch (error) {
    console.error('❌ Erro ao atualizar registro:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao atualizar registro'
    };
  }
}

/**
 * Excluir registro de doação
 * Endpoint: DELETE /registro-doacao/:id
 */
export async function excluirRegistroDoacao(id) {
  try {
    const res = await http.delete(`/registro-doacao/${id}`);
    
    return {
      success: true,
      message: res.data.message || 'Registro excluído com sucesso!'
    };
  } catch (error) {
    console.error('❌ Erro ao excluir registro:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao excluir registro'
    };
  }
}
