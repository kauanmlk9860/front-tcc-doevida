import http from '../../services/http.js';

export async function buscarTelefoneUsuario(idUsuario) {
  try {
    const res = await http.get(`/telefone/usuario/${idUsuario}`);
    return {
      success: true,
      data: res.data.telefones || res.data,
      telefone: res.data.telefones?.[0]?.numero || res.data[0]?.numero || null
    };
  } catch (error) {
    console.error('Erro ao buscar telefone:', error);
    return {
      success: false,
      telefone: null
    };
  }
}

export async function criarTelefone(data) {
  try {
    const res = await http.post('/telefone', data);
    return {
      success: true,
      data: res.data
    };
  } catch (error) {
    console.error('Erro ao criar telefone:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao criar telefone'
    };
  }
}

export async function atualizarTelefone(id, data) {
  try {
    const res = await http.put(`/telefone/${id}`, data);
    return {
      success: true,
      data: res.data
    };
  } catch (error) {
    console.error('Erro ao atualizar telefone:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao atualizar telefone'
    };
  }
}
