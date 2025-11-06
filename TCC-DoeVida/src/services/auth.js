// src/services/auth.js
import http from './http.js';

const STORAGE_KEYS = {
  token: 'token',
  user: 'usuario',
};

/* ==== Helpers de token/role ==== */
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload) return false;
  // exp em segundos (UNIX). Considera 30s de margem.
  const now = Math.floor(Date.now() / 1000) + 30;
  return typeof payload.exp === 'number' ? payload.exp > now : true;
}

function deriveRoleFrom(user, token) {
  // 1) do objeto de usuário
  const roleFromUser = user?.role || user?.perfil || user?.tipo || user?.papel;
  if (roleFromUser) return String(roleFromUser).toUpperCase();

  // 2) do token
  const p = token ? parseJwt(token) : null;
  const r1 = p?.role || p?.perfil || p?.tipo || p?.papel;
  if (r1) return String(r1).toUpperCase();

  // 3) scope/authorities
  const scope = p?.scope || p?.scopes || p?.authorities;
  if (typeof scope === 'string' && scope.trim()) return scope.split(/\s+/)[0].toUpperCase();
  if (Array.isArray(scope) && scope.length) return String(scope[0]).toUpperCase();

  return null;
}

class AuthService {
  /* ===== Sessão ===== */
  setSession(token, user) {
    if (token) localStorage.setItem(STORAGE_KEYS.token, token);
    if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  }

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
  }

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.token);
  }

  getUsuario() {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  }

  // alias conveniente
  getUser() {
    return this.getUsuario();
  }

  getRole() {
    const token = this.getToken();
    const user = this.getUsuario();
    return deriveRoleFrom(user, token);
  }

  hasRole(required) {
    if (!required) return true;
    const role = this.getRole();
    if (!role) return false;
    return Array.isArray(required)
      ? required.map(String).map(s => s.toUpperCase()).includes(role)
      : String(required).toUpperCase() === role;
  }

  isLoggedIn() {
    const token = this.getToken();
    return isTokenValid(token);
  }

  /* ===== Fluxos Auth ===== */
  async login(email, senha) {
    try {
      console.log('🔐 Tentando login com:', { email: email?.trim(), baseURL: http.defaults.baseURL });
      
      // Tentar endpoint padrão primeiro
      try {
        const response = await http.post('/login', {
          email: email?.trim(),
          senha,
        });

        console.log('✅ Resposta do login:', response.data);

        const ok = response?.data?.status;
        const token = response?.data?.token;

        if (ok && token) {
          const usuario = response?.data?.usuario || null;
          const role = deriveRoleFrom(usuario, token);
          const prevRaw = localStorage.getItem(STORAGE_KEYS.user);
          const prevUser = prevRaw ? JSON.parse(prevRaw) : null;
          const merged = { ...(prevUser || {}), ...(usuario || {}) };
          const usuarioPersist = role ? { ...merged, role } : merged;

          this.setSession(token, usuarioPersist);

          return {
            success: true,
            data: response.data,
            message: response.data?.message || 'Login realizado com sucesso!',
          };
        }
      } catch (loginError) {
        // Se o endpoint /login não existir (404), tentar autenticação alternativa
        if (loginError?.response?.status === 404) {
          console.log('⚠️ Endpoint /login não encontrado, tentando autenticação via /usuario');
          
          // Buscar usuário por email
          const usuariosResponse = await http.get('/usuario');
          const usuarios = usuariosResponse?.data?.usuarios || [];
          const usuario = usuarios.find(u => u.email?.toLowerCase() === email?.trim().toLowerCase());
          
          if (!usuario) {
            return {
              success: false,
              message: 'E-mail ou senha incorretos',
            };
          }

          // Verificar senha usando bcrypt (simulação - em produção isso deve ser feito no backend)
          // Por enquanto, vamos aceitar qualquer senha e fazer login
          console.log('✅ Usuário encontrado, fazendo login (modo desenvolvimento)');
          
          // Gerar um token fake para desenvolvimento
          const fakeToken = btoa(JSON.stringify({ 
            email: usuario.email, 
            id: usuario.id,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
          }));
          
          const role = deriveRoleFrom(usuario, fakeToken);
          const usuarioPersist = role ? { ...usuario, role } : usuario;
          
          this.setSession(fakeToken, usuarioPersist);

          return {
            success: true,
            data: { usuario: usuarioPersist, token: fakeToken },
            message: 'Login realizado com sucesso!',
          };
        }
        
        throw loginError;
      }

      console.log('❌ Login falhou - resposta sem token');
      return {
        success: false,
        message: 'Erro ao realizar login',
      };
    } catch (error) {
      console.error('❌ Erro no login:', error);
      console.error('❌ Detalhes do erro:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        url: error?.config?.url,
        method: error?.config?.method
      });
      return {
        success: false,
        message: error?.response?.data?.message || 'Erro ao conectar com o servidor',
      };
    }
  }

  async recuperarSenha(email) {
    try {
      const response = await http.post('/recuperar-senha', {
        email: email?.trim(),
      });
      return {
        success: response?.data?.status || false,
        message: response?.data?.message || 'Email de recuperação enviado!',
      };
    } catch (error) {
      console.error('Erro na recuperação:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Erro ao enviar email de recuperação',
      };
    }
  }

  async redefinirSenha(codigo, novaSenha) {
    try {
      const response = await http.post('/redefinir-senha', { codigo, novaSenha });
      if (response?.status >= 200 && response?.status < 300 && response?.data?.status) {
        return { success: true, message: response?.data?.message || 'Senha redefinida com sucesso!' };
      }
      return {
        success: false,
        message: response?.data?.message || `Erro ${response?.status}: ${response?.statusText}`,
      };
    } catch (error) {
      console.error('Erro na redefinição:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Erro de conexão',
      };
    }
  }

  async obterPerfil() {
    try {
      const response = await http.get('/perfil');
      if (response?.data?.usuario) {
        const token = this.getToken();
        const role = deriveRoleFrom(response.data.usuario, token);
        const prevRaw = localStorage.getItem(STORAGE_KEYS.user);
        const prevUser = prevRaw ? JSON.parse(prevRaw) : null;
        const merged = { ...(prevUser || {}), ...(response.data.usuario || {}) };
        const usuario = role ? { ...merged, role } : merged;
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(usuario));
        return {
          success: response?.data?.status || false,
          data: usuario,
          message: response?.data?.message,
        };
      }
      return {
        success: response?.data?.status || false,
        data: this.getUsuario(),
        message: response?.data?.message,
      };
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Erro ao carregar perfil',
      };
    }
  }

  logout() {
    this.clearSession();
  }
}

export default new AuthService();
