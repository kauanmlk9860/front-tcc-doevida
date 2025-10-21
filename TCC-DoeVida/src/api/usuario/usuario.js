import http from '../../services/http.js';

// Util: normalizar payload para criar usuário
function buildCreatePayload(data) {
  return {
    nome: data.nome?.trim(),
    email: data.email?.trim(),
    senha: data.senha,     
    cpf: data.cpf || null,
    cep: data.cep || null,
    numero: data.numero || null,
    data_nascimento: data.data_nascimento || null,
    foto_perfil: data.foto_perfil || null,
    id_sexo: data.id_sexo || null,
    id_tipo_sanguineo: data.id_tipo_sanguineo || null,
  };
}

// Util: normalizar payload para atualizar usuário
function buildUpdatePayload(data) {
  const out = {
    nome: data.nome?.trim(),
    email: data.email?.trim(),
    cpf: data.cpf || null,
    cep: data.cep || null,
    numero: data.numero || null,
    data_nascimento: data.data_nascimento || null,
    foto_perfil: data.foto_perfil ?? null,
    id_sexo: data.id_sexo,
    id_tipo_sanguineo: data.id_tipo_sanguineo,
  };

  // Se o usuário informou nova senha
  if (data.senha_hash) out.senha_hash = data.senha_hash;
  return out;
}

/** CREATE */
export async function criarUsuario(data) {
  try {
    const payload = buildCreatePayload(data);
    console.log('=== DEBUG CRIAÇÃO USUÁRIO ===');
    console.log('Dados recebidos:', data);
    console.log('Payload final:', payload);
    console.log('Tamanhos dos campos:', {
      nome: payload.nome?.length || 0,
      email: payload.email?.length || 0,
      senha: payload.senha?.length || 0,
      cpf: payload.cpf?.length || 0,
      cep: payload.cep?.length || 0,
      numero: payload.numero?.length || 0,
      data_nascimento: payload.data_nascimento?.length || 0,
      foto_perfil: payload.foto_perfil?.length || 0,
    });
    console.log('=== FIM DEBUG ===');
    
    const res = await http.post('/usuario', payload);
    
    return {
      success: res.data.status || false,
      data: res.data.usuario,
      message: res.data.message || 'Usuário criado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    console.error('Resposta do erro:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao criar usuário'
    };
  }
}

/** UPDATE (id obrigatório) */
export async function atualizarUsuario(id, data) {
  try {
    const payload = buildUpdatePayload(data);
    const res = await http.put(`/usuario/${id}`, payload);
    
    return {
      success: res.data.status || false,
      data: res.data,
      message: res.data.message || 'Usuário atualizado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao atualizar usuário'
    };
  }
}

/** DELETE */
export async function excluirUsuario(id) {
  try {
    const res = await http.delete(`/usuario/${id}`);
    return {
      success: res.data.status || false,
      message: res.data.message || 'Usuário excluído com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao excluir usuário'
    };
  }
}

/** LISTAR TODOS OS USUÁRIOS */
export async function listarUsuarios() {
  try {
    const res = await http.get('/usuario');
    return {
      success: res.data.status || false,
      data: res.data.usuarios || res.data,
      message: res.data.message
    };
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao listar usuários'
    };
  }
}

/** BUSCAR USUÁRIO POR ID */
export async function buscarUsuario(id) {
  try {
    const res = await http.get(`/usuario/${id}`);
    return {
      success: res.data.status || false,
      data: res.data.usuario || res.data,
      message: res.data.message
    };
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar usuário'
    };
  }
}

/** OBTER TIPOS SANGUÍNEOS */
export async function obterTiposSanguineos() {
  try {
    const res = await http.get('/tipo-sanguineo');
    return {
      success: res.data.status || false,
      data: res.data.tipos_sanguineos || res.data,
      message: res.data.message
    };
  } catch (error) {
    console.error('Erro ao obter tipos sanguíneos:', error);
    return {
      success: false,
      data: [
        { id: 1, tipo: 'A+' }, { id: 2, tipo: 'A-' },
        { id: 3, tipo: 'B+' }, { id: 4, tipo: 'B-' },
        { id: 5, tipo: 'AB+' }, { id: 6, tipo: 'AB-' },
        { id: 7, tipo: 'O+' }, { id: 8, tipo: 'O-' }
      ]
    };
  }
}

/** OBTER SEXOS */
export async function obterSexos() {
  try {
    const res = await http.get('/sexo-usuario');
    return {
      success: res.data.status || false,
      data: res.data.sexos || res.data,
      message: res.data.message
    };
  } catch (error) {
    console.error('Erro ao obter sexos:', error);
    return {
      success: false,
      data: [
        { id: 1, sexo: 'MASCULINO' },
        { id: 2, sexo: 'FEMININO' },
        { id: 3, sexo: 'OUTRO' }
      ]
    };
  }
}