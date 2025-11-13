// Serviço HTTP especial para desenvolvimento sem rate limiting
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'

export const createUserDev = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/usuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || response.statusText}`)
    }

    return {
      success: data.status || response.ok,
      data: data.usuario || data,
      message: data.message || 'Usuário criado com sucesso!'
    }
  } catch (error) {
    console.error('Erro na requisição dev:', error)
    return {
      success: false,
      message: error.message || 'Erro ao criar usuário'
    }
  }
}