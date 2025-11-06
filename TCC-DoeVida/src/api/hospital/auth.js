// src/api/hospital/auth.js
import http from '../../services/http.js';

/**
 * Login para hospitais
 * Como não existe endpoint de login, busca o hospital por email e valida a senha
 * Endpoint: GET /hospital para buscar todos e validar localmente
 */
export async function loginHospital(email, senha) {
  try {
    console.log('🏥 Tentando login de hospital:', { email: email?.trim() });
    
    if (!email || !senha) {
      return {
        success: false,
        message: 'Email e senha são obrigatórios'
      };
    }

    // Buscar todos os hospitais
    const response = await http.get('/hospital');
    console.log('✅ Resposta da busca de hospitais:', response.data);

    const hospitais = response.data.hospitais || response.data.dados || response.data || [];
    
    // Procurar hospital pelo email
    const hospital = hospitais.find(h => 
      h.email?.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!hospital) {
      return {
        success: false,
        message: 'Hospital não encontrado. Verifique o email digitado.'
      };
    }

    // Verificar senha (comparação simples - o ideal é que o backend faça isso)
    // NOTA: Em produção, NUNCA faça validação de senha no frontend!
    // Isso é apenas temporário até o backend implementar autenticação
    if (hospital.senha !== senha) {
      return {
        success: false,
        message: 'Senha incorreta'
      };
    }

    // Gerar um token temporário (em produção, isso vem do backend)
    const tokenTemp = btoa(JSON.stringify({
      id: hospital.id,
      email: hospital.email,
      role: 'HOSPITAL',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    }));

    // Garantir que o role seja HOSPITAL
    const hospitalData = {
      ...hospital,
      role: 'HOSPITAL',
      tipo: 'HOSPITAL'
    };

    console.log('✅ Hospital encontrado e autenticado:', hospitalData);

    return {
      success: true,
      token: tokenTemp,
      hospital: hospitalData,
      message: 'Login realizado com sucesso!',
    };

  } catch (error) {
    console.error('❌ Erro no login do hospital:', error);
    console.error('❌ Detalhes:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message
    });
    
    return {
      success: false,
      message: error?.response?.data?.message || 'Erro ao conectar com o servidor. Verifique se o backend está rodando.',
    };
  }
}

/**
 * Obter perfil do hospital logado
 * Busca o hospital pelo ID armazenado no localStorage
 * Endpoint: GET /hospital/:id
 */
export async function obterPerfilHospital() {
  try {
    // Pegar dados do localStorage
    const userStr = localStorage.getItem('usuario');
    if (!userStr) {
      return {
        success: false,
        message: 'Usuário não autenticado'
      };
    }

    const user = JSON.parse(userStr);
    const hospitalId = user.id;

    if (!hospitalId) {
      return {
        success: false,
        message: 'ID do hospital não encontrado'
      };
    }

    // Buscar hospital pelo ID
    const response = await http.get(`/hospital/${hospitalId}`);
    
    const data = response?.data || {};
    const hospitalRaw = data.hospital || data.dados || data;
    
    if (hospitalRaw) {
      const hospitalData = {
        ...hospitalRaw,
        role: 'HOSPITAL',
        tipo: 'HOSPITAL'
      };
      
      return {
        success: data?.status || true,
        data: hospitalData,
        message: data?.message,
      };
    }
    
    return {
      success: false,
      message: 'Perfil do hospital não encontrado'
    };
  } catch (error) {
    console.error('Erro ao obter perfil do hospital:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Erro ao carregar perfil',
    };
  }
}
