import http from '../../services/http.js';

// Util: normalizar payload para criar usuário
function buildCreatePayload(data) {
  return {
    nome: data.nome?.trim(),
    email: data.email?.trim(),
    senha: data.senha,     
    confirmar_senha: data.confirmar_senha, 
    cpf: data.cpf || null,
    cep: data.cep || null,
    numero: data.numero || null,
    data_nascimento: data.data_nascimento || null,
    id_banco_sangue: data.id_banco_sangue || null,
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
    id_banco_sangue: data.id_banco_sangue || null,
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
  const payload = buildCreatePayload(data);
  console.log(payload);
  
  const res = await http.post('usuario', payload);
  return res.data;
}

/** UPDATE (id obrigatório) */
export async function atualizarUsuario(id, data) {
  const payload = buildUpdatePayload(data);
  const res = await http.put(`/usuario/${id}`, payload);
  return res.data;
}

/** DELETE */
export async function excluirUsuario(id) {
  const res = await http.delete(`/usuario/${id}`);
  return res.data;
}

/** LISTAR TODOS OS USUÁRIOS */
export async function listarUsuarios() {
  const res = await http.get('/usuario');
  return res.data;
}

/** BUSCAR USUÁRIO POR ID */
export async function buscarUsuario(id) {
  const res = await http.get(`/usuario/${id}`);
  return res.data;
}

/** BUSCAR USUÁRIO POR EMAIL */
export async function buscarUsuarioPorEmail(email) {
  const res = await http.get(`/usuario/email/${encodeURIComponent(email)}`);
  return res.data;
}

/** BUSCAR USUÁRIO POR NOME */
export async function buscarUsuarioPorNome(nome) {
  const res = await http.get(`/usuario/nome/${encodeURIComponent(nome)}`);
  return res.data;
}

/** LOGIN */
export async function login(email, senha) {
  const res = await http.post('/login', { email, senha });
  return res.data;
}