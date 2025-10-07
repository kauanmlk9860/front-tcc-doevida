import http from './http.js';

class AuthService {
  /**
   * Realiza login do usuário
   */
  async login(email, senha) {
    try {
      const response = await http.post('/login', {
        email: email.trim(),
        senha
      });

      if (response.data.status && response.data.token) {
        // Salva token no localStorage
        localStorage.setItem('token', response.data.token);
        
        // Salva dados básicos do usuário
        if (response.data.usuario) {
          localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        }

        return {
          success: true,
          data: response.data,
          message: response.data.message || 'Login realizado com sucesso!'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Erro ao realizar login'
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao conectar com o servidor'
      };
    }
  }

  /**
   * Solicita recuperação de senha
   */
  async recuperarSenha(email) {
    try {
      const response = await http.post('/recuperar-senha', {
        email: email.trim()
      });

      return {
        success: response.data.status || false,
        message: response.data.message || 'Email de recuperação enviado!'
      };
    } catch (error) {
      console.error('Erro na recuperação:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao enviar email de recuperação'
      };
    }
  }

  /**
   * Redefine senha com código
   */
  async redefinirSenha(codigo, novaSenha) {
    try {
      console.log('=== REDEFININDO SENHA ===');
      console.log('Código:', codigo);
      console.log('Nova senha length:', novaSenha?.length);
      
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida';
      const url = `${baseURL}/redefinir-senha`;
      console.log('URL:', url);
      
      const payload = {
        codigo: codigo,
        novaSenha: novaSenha
      };
      
      console.log('Payload enviado:', JSON.stringify(payload, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('=== RESPOSTA DA API ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Data:', JSON.stringify(data, null, 2));
      console.log('======================');

      if (response.ok && data.status) {
        return {
          success: true,
          message: data.message || 'Senha redefinida com sucesso!'
        };
      } else {
        return {
          success: false,
          message: data.message || `Erro ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      console.error('=== ERRO NA REDEFINIÇÃO ===');
      console.error('Tipo do erro:', error.constructor.name);
      console.error('Mensagem do erro:', error.message);
      console.error('Erro completo:', error);
      console.error('==============================');
      
      return {
        success: false,
        message: `Erro de conexão: ${error.message}`
      };
    }
  }

  /**
   * Obtém perfil do usuário logado
   */
  async obterPerfil() {
    try {
      const response = await http.get('/perfil');
      return {
        success: response.data.status || false,
        data: response.data.usuario,
        message: response.data.message
      };
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar perfil'
      };
    }
  }

  /**
   * Realiza logout
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  /**
   * Verifica se usuário está logado
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * Obtém dados do usuário do localStorage
   */
  getUsuario() {
    const userData = localStorage.getItem('usuario');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Obtém token do localStorage
   */
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();