// src/api/hospital.js
import http from '../../services/http.js'

/* =========================
   Limites do SEU backend
   ========================= */
const LIMITS = {
  nomeMax: 70,
  emailMax: 100,
  senhaMax: 255,
  cnpjMax: 20,       // backend aceita até 20 chars (pode ser com máscara)
  cepMax: 10,        // backend aceita até 10 chars (pode ser com máscara)
  telefoneMax: 20,
  conveniosMax: 255,
  crmMax: 255,
  fotoMax: 255
}

const DEFAULTS = {
  FOTO: 'https://via.placeholder.com/600x400?text=Hospital'
}

/* =========================
   Helpers
   ========================= */
function sanitizeStr(v) {
  const s = (v ?? '').toString().trim()
  return s.length ? s : null
}
function clamp(str, max) {
  if (str == null) return null
  const s = String(str).trim()
  return s.length > max ? s.slice(0, max) : s
}
function toInt(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : NaN
}
function normalizeTime(t) {
  // "HH:MM" ou "HH:MM:SS" -> "HH:MM"
  if (!t) return null
  const m = String(t).match(/^(\d{2}):(\d{2})(?::\d{2})?$/)
  return m ? `${m[1]}:${m[2]}` : null
}
function extractErrorMessage(error) {
  const data = error?.response?.data
  if (!data) return error.message || 'Erro'
  if (typeof data === 'string') return data
  let msg = data.message || 'Erro ao processar requisição'
  if (Array.isArray(data.errors) && data.errors.length) {
    msg += ' - ' + data.errors.join('; ')
  }
  return msg
}

/* =========================
   Builders (ajustados)
   ========================= */
function buildPayloadBase(data) {
  // trims e clamps conforme os limites do seu back
  const nome = clamp(sanitizeStr(data.nome), LIMITS.nomeMax)
  const email = clamp(sanitizeStr(data.email), LIMITS.emailMax)
  const senha = (data.senha ?? '').toString().slice(0, LIMITS.senhaMax)

  const cnpj = clamp(sanitizeStr(data.cnpj), LIMITS.cnpjMax)
  const cep = clamp(sanitizeStr(data.cep), LIMITS.cepMax)
  const telefone = clamp(sanitizeStr(data.telefone), LIMITS.telefoneMax)
  const convenios = clamp(sanitizeStr(data.convenios), LIMITS.conveniosMax)
  const crm = clamp(sanitizeStr(data.crm), LIMITS.crmMax)

  // FOTO: se vier vazia do front, usa padrão
  const fotoRaw = clamp(sanitizeStr(data.foto), LIMITS.fotoMax)
  const foto = fotoRaw || DEFAULTS.FOTO

  const capacidade_maxima = toInt(data.capacidade_maxima)

  const abertura = normalizeTime(data.horario_abertura)
  const fechamento = normalizeTime(data.horario_fechamento)

  // opcional para seu back
  const tipo_hospital = sanitizeStr(data.tipo_hospital) || null

  return {
    // obrigatórios no seu back:
    nome,
    email,
    senha,
    cnpj,
    crm,
    cep,
    telefone,
    capacidade_maxima: Number.isNaN(capacidade_maxima) ? undefined : capacidade_maxima,
    convenios,
    horario_abertura: abertura,
    horario_fechamento: fechamento,
    foto,

    // opcionais:
    tipo_hospital
  }
}

function buildCreateHospitalPayload(data) {
  return buildPayloadBase(data)
}

function buildUpdateHospitalPayload(data) {
  // seu back exige TODOS os campos também no update
  return buildPayloadBase(data)
}

/* =========================
   Validações (espelham seu back)
   ========================= */
function validateAgainstBackendRules(payload) {
  if (!payload.nome || payload.nome.length > LIMITS.nomeMax)
    throw new Error(`Nome é obrigatório e deve ter até ${LIMITS.nomeMax} caracteres`)

  if (!payload.email || payload.email.length > LIMITS.emailMax)
    throw new Error(`Email é obrigatório e deve ter até ${LIMITS.emailMax} caracteres`)

  if (!payload.senha || payload.senha.length > LIMITS.senhaMax)
    throw new Error(`Senha é obrigatória e deve ter até ${LIMITS.senhaMax} caracteres`)

  if (!payload.cnpj || payload.cnpj.length > LIMITS.cnpjMax)
    throw new Error(`CNPJ é obrigatório e deve ter até ${LIMITS.cnpjMax} caracteres`)

  if (!payload.crm || payload.crm.length > LIMITS.crmMax)
    throw new Error(`CRM é obrigatório e deve ter até ${LIMITS.crmMax} caracteres`)

  if (!payload.cep || payload.cep.length > LIMITS.cepMax)
    throw new Error(`CEP é obrigatório e deve ter até ${LIMITS.cepMax} caracteres`)

  if (!payload.telefone || payload.telefone.length > LIMITS.telefoneMax)
    throw new Error(`Telefone é obrigatório e deve ter até ${LIMITS.telefoneMax} caracteres`)

  if (
    payload.capacidade_maxima == null ||
    Number.isNaN(payload.capacidade_maxima) ||
    payload.capacidade_maxima <= 0
  ) throw new Error('Capacidade máxima é obrigatória e deve ser um número maior que 0')

  if (!payload.convenios || payload.convenios.length > LIMITS.conveniosMax)
    throw new Error(`Convênios é obrigatório e deve ter até ${LIMITS.conveniosMax} caracteres`)

  if (!payload.horario_abertura) throw new Error('Horário de abertura é obrigatório')
  if (!payload.horario_fechamento) throw new Error('Horário de fechamento é obrigatório')
  if (payload.horario_abertura >= payload.horario_fechamento)
    throw new Error('Horário de fechamento deve ser após a abertura')

  if (!payload.foto || payload.foto.length > LIMITS.fotoMax)
    throw new Error(`Foto é obrigatória e deve ter até ${LIMITS.fotoMax} caracteres`)
}

/* =========================
   CREATE
   ========================= */
export async function criarHospital(data) {
  try {
    const payload = buildCreateHospitalPayload(data)
    validateAgainstBackendRules(payload)

    const res = await http.post('/hospital', payload)

    return {
      success: res.data?.status || res.data?.status_code === 201 || false,
      data: res.data?.hospital || res.data,
      message: res.data?.message || 'Hospital criado com sucesso'
    }
  } catch (error) {
    console.error('Erro ao criar hospital:', error)
    return {
      success: false,
      message: extractErrorMessage(error)
    }
  }
}

/* =========================
   UPDATE (id)
   ========================= */
export async function atualizarHospital(id, data) {
  try {
    if (!id || Number.isNaN(Number(id)) || Number(id) <= 0)
      throw new Error('ID do hospital inválido')

    const payload = buildUpdateHospitalPayload(data)
    validateAgainstBackendRules(payload)

    const res = await http.put(`/hospital/${id}`, payload)

    return {
      success: res.data?.status || res.data?.status_code === 200 || false,
      data: res.data?.hospital || res.data,
      message: res.data?.message || 'Hospital atualizado com sucesso'
    }
  } catch (error) {
    console.error('Erro ao atualizar hospital:', error)
    return {
      success: false,
      message: extractErrorMessage(error)
    }
  }
}

/* =========================
   DELETE / LISTAR / BUSCAR
   ========================= */
export async function excluirHospital(id) {
  try {
    if (!id || Number.isNaN(Number(id)) || Number(id) <= 0)
      throw new Error('ID do hospital inválido')
    const res = await http.delete(`/hospital/${id}`)
    return {
      success: res.data?.status || false,
      message: res.data?.message || 'Hospital excluído com sucesso'
    }
  } catch (error) {
    console.error('Erro ao excluir hospital:', error)
    return { success: false, message: extractErrorMessage(error) }
  }
}

export async function listarHospitais(params = {}) {
  try {
    const res = await http.get('/hospital', { params })
    return {
      success: res.data?.status || res.data?.status_code === 200 || false,
      data: res.data?.hospitais || res.data?.items ? res.data : res.data,
      message: res.data?.message
    }
  } catch (error) {
    console.error('Erro ao listar hospitais:', error)
    return { success: false, message: extractErrorMessage(error) }
  }
}

export async function buscarHospital(id) {
  try {
    if (!id || Number.isNaN(Number(id)) || Number(id) <= 0)
      throw new Error('ID do hospital inválido')
    const res = await http.get(`/hospital/${id}`)
    return {
      success: res.data?.status || res.data?.status_code === 200 || false,
      data: res.data?.hospital || res.data,
      message: res.data?.message
    }
  } catch (error) {
    console.error('Erro ao buscar hospital:', error)
    return { success: false, message: extractErrorMessage(error) }
  }
}
