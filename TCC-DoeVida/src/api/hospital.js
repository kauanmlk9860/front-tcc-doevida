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

/**
 * Upload de foto do hospital
 * Endpoint: POST /hospital/upload-foto
 */
export async function uploadFotoHospital(file) {
  try {
    console.log('📤 Iniciando upload da foto:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const formData = new FormData();
    formData.append('foto_hospital', file);

    const res = await http.post('/hospital/upload-foto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('✅ Upload bem-sucedido:', res.data);

    return {
      success: true,
      url: res.data.url,
      message: res.data.message
    };
  } catch (error) {
    console.error('❌ Erro ao fazer upload da foto do hospital:', error);
    console.error('📋 Detalhes do erro:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Mensagem mais específica baseada no erro
    let errorMessage = 'Erro ao fazer upload da foto';
    
    if (error.response?.status === 400) {
      errorMessage = error.response?.data?.message || 'Requisição inválida. Verifique se o backend está configurado corretamente.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Rota de upload não encontrada. Configure a rota /hospital/upload-foto no backend.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Erro no servidor. Verifique a configuração do Multer no backend.';
    } else if (!error.response) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
    }
    
    return {
      success: false,
      message: errorMessage,
      details: error.response?.data
    };
  }
}
