// src/services/http.js
import axios from 'axios';

// Use .env: VITE_API_URL=http://localhost:8080/v1/doevida
const httpConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida',
  timeout: 15000,
};

// Adicionar header de desenvolvimento se estiver em modo dev
if (import.meta.env.VITE_DEVELOPMENT_MODE === 'true') {
  httpConfig.headers = {
    'X-Development-Mode': 'true',
    'X-Bypass-Rate-Limit': 'true',
    'X-Test-Mode': 'unlimited-requests'
  };
}

const http = axios.create(httpConfig);

/* ==== Helpers locais (evitam dependência do AuthService) ==== */
const STORAGE_KEYS = { token: 'token', user: 'usuario' };

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
  const now = Math.floor(Date.now() / 1000) + 30; // margem 30s
  return typeof payload.exp === 'number' ? payload.exp > now : true;
}

function clearSessionAndRedirect() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
  const current = window.location.pathname + window.location.search;
  const to = `/login${current && current !== '/login' ? `?from=${encodeURIComponent(current)}` : ''}`;
  window.location.replace(to);
}

/* ===== Request interceptor ===== */
http.interceptors.request.use((config) => {
  // Rotas que não precisam de token (públicas)
  const publicRoutes = ['/usuario', '/login', '/sexo-usuario', '/tipo-sanguineo', '/hospital/login', '/hospital'];
  const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
  
  const token = localStorage.getItem(STORAGE_KEYS.token);
  
  // Só adicionar token se não for rota pública E se o token existir
  if (!isPublicRoute && token) {
    const isValid = isTokenValid(token);
    console.log('🔑 Token válido (JWT)?', isValid);
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token adicionado ao header');
  } else if (!isPublicRoute && !token) {
    console.warn('⚠️ Token necessário mas não existe no localStorage!');
  } else {
    console.log('📝 Rota pública, não precisa de token');
  }

  // Headers simples para desenvolvimento (sem causar CORS)
  if (import.meta.env.VITE_DEVELOPMENT_MODE === 'true') {
    // Apenas headers que não causam preflight CORS
    console.log('Modo desenvolvimento ativo - rate limiting pode estar ativo')
  }

  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

/* ===== Response interceptor ===== */
let isRedirecting = false;

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const currentPath = window.location.pathname;

    // Páginas que não devem redirecionar automaticamente (deixam o componente tratar)
    const noAutoRedirect = ['/login', '/cadastro', '/agendamento'];
    const shouldNotRedirect = noAutoRedirect.some(path => currentPath.includes(path));

    // Só redirecionar se não estiver em páginas especiais e for erro de autenticação
    if ((status === 401 || status === 403) && !isRedirecting && !shouldNotRedirect) {
      isRedirecting = true;
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
      const current = window.location.pathname + window.location.search;
      const to = `/login${current && current !== '/login' ? `?from=${encodeURIComponent(current)}` : ''}`;
      window.location.replace(to);
    }

    return Promise.reject(error);
  }
);

export default http;
