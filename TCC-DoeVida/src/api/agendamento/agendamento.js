import http from '../../services/http.js';

// Util: normalizar payload para criar agendamento
function buildCreatePayload(data) {
  return {
    id_usuario: data.id_usuario,
    id_hospital: data.id_hospital,
    data: data.data, // DATE format YYYY-MM-DD
    hora: data.hora, // TIME format HH:MM:SS
    status: data.status || 'Agendado', // 'Agendado', 'Em espera', 'Concluído'
    id_doacao: data.id_doacao || null,
  };
}

// Util: normalizar payload para atualizar agendamento
function buildUpdatePayload(data) {
  const payload = {};
  
  if (data.data) payload.data = data.data;
  if (data.hora) payload.hora = data.hora;
  if (data.status) payload.status = data.status;
  if (data.id_doacao !== undefined) payload.id_doacao = data.id_doacao;
  
  return payload;
}

/** CREATE - Criar novo agendamento */
export async function criarAgendamento(data) {
  try {
    const payload = buildCreatePayload(data);
    
    const res = await http.post('/agendamento', payload);
    
    // Verificar se a resposta indica sucesso
    const isSuccess = res.data.status === true || res.data.status_code === 201 || res.data.status_code === 200;
    
    return {
      success: isSuccess,
      data: res.data.agendamento || res.data.dados || res.data,
      message: res.data.message || 'Agendamento criado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    
    // Tratar diferentes tipos de erro
    if (error.response?.status === 400) {
      return {
        success: false,
        message: error.response.data?.message || 'Dados inválidos. Verifique os campos preenchidos.'
      };
    }
    
    if (error.response?.status === 401) {
      return {
        success: false,
        message: 'Não autorizado. Faça login novamente.'
      };
    }
    
    if (error.response?.status === 409) {
      return {
        success: false,
        message: 'Já existe um agendamento para este horário. Escolha outro horário.'
      };
    }
    
    if (error.response?.status >= 500) {
      return {
        success: false,
        message: 'Erro interno do servidor. Tente novamente mais tarde.'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Erro ao criar agendamento. Verifique sua conexão.'
    };
  }
}

/** UPDATE - Atualizar agendamento existente */
export async function atualizarAgendamento(id, data) {
  try {
    const payload = buildUpdatePayload(data);
    const res = await http.put(`/agendamento/${id}`, payload);
    
    return {
      success: res.data.status || true,
      data: res.data.agendamento || res.data.dados || res.data,
      message: res.data.message || 'Agendamento atualizado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao atualizar agendamento'
    };
  }
}

/** DELETE - Cancelar agendamento */
export async function cancelarAgendamento(id) {
  try {
    const res = await http.delete(`/agendamento/${id}`);
    return {
      success: res.data.status || true,
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

/** LISTAR TODOS - Buscar todos os agendamentos */
export async function listarAgendamentos() {
  try {
    const res = await http.get('/agendamento');
    
    return {
      success: res.data.status || true,
      data: res.data.agendamentos || res.data.dados || res.data,
      message: res.data.message
    };
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Erro ao listar agendamentos'
    };
  }
}

/** LISTAR MEUS AGENDAMENTOS - Buscar agendamentos do usuário logado */
export async function listarMeusAgendamentos(futuros = false) {
  try {
    const endpoint = futuros ? '/agendamento/me?futuros=1' : '/agendamento/me';
    const res = await http.get(endpoint);
    
    return {
      success: res.data.status || true,
      data: res.data.agendamentos || res.data.dados || res.data,
      message: res.data.message
    };
  } catch (error) {
    console.error('Erro ao listar meus agendamentos:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Erro ao listar agendamentos'
    };
  }
}

/** BUSCAR POR STATUS - Buscar agendamentos por status */
export async function buscarAgendamentosPorStatus(status) {
  try {
    const res = await http.get(`/agendamento/status/${status}`);
    
    return {
      success: res.data.status || true,
      data: res.data.agendamentos || res.data.dados || res.data,
      message: res.data.message
    };
  } catch (error) {
    console.error('Erro ao buscar agendamentos por status:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Erro ao buscar agendamentos'
    };
  }
}

/** BUSCAR POR ID - Buscar agendamento específico */
export async function buscarAgendamento(id) {
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

/** BUSCAR POR DATA - Buscar agendamentos por data específica */
export async function buscarAgendamentosPorData(data) {
  try {
    // Usando URL absoluta pois o endpoint não segue o padrão do baseURL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida';
    const url = baseUrl.replace('/v1/doevida', '') + `/v1/agendamento/data/${data}`;
    
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const responseData = await res.json();
    
    return {
      success: responseData.status || res.ok,
      data: responseData.agendamentos || responseData.dados || responseData,
      message: responseData.message
    };
  } catch (error) {
    console.error('Erro ao buscar agendamentos por data:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Erro ao buscar agendamentos por data'
    };
  }
}

/** VERIFICAR DISPONIBILIDADE - Verificar se horário está disponível */
export async function verificarDisponibilidade(data, hora, id_hospital) {
  try {
    const params = new URLSearchParams({
      data: data,
      hora: hora,
      id_hospital: id_hospital
    });
    
    // Usando URL absoluta pois o endpoint não segue o padrão do baseURL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida';
    const url = baseUrl.replace('/v1/doevida', '') + `/v1/agendamento/disponibilidade?${params}`;
    
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const responseData = await res.json();
    
    return {
      success: responseData.status || res.ok,
      data: responseData,
      message: responseData.message,
      disponivel: responseData.disponivel !== false // assume disponível se não especificado
    };
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return {
      success: false,
      disponivel: true, // Em caso de erro, permite continuar
      message: error.message || 'Erro ao verificar disponibilidade'
    };
  }
}

/** CONFIRMAR DOAÇÃO - Marcar agendamento como concluído */
export async function confirmarDoacao(id) {
  try {
    const payload = { 
      status: 'Concluído'
    };
    
    const res = await http.put(`/agendamento/${id}`, payload);
    
    return {
      success: res.data.status || true,
      data: res.data.agendamento || res.data.dados || res.data,
      message: res.data.message || 'Doação confirmada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao confirmar doação:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao confirmar doação'
    };
  }
}
