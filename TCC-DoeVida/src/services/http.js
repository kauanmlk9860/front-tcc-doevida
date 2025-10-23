// src/services/http.js
import axios from 'axios';

// Use .env: VITE_API_URL=http://localhost:8080/v1/doevida
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida',
  timeout: 15000,
});

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
  const token = localStorage.getItem(STORAGE_KEYS.token);

  // Apenas adicionar token se válido (não redirecionar em cadastro/login)
  if (token && isTokenValid(token)) {
    config.headers.Authorization = `Bearer ${token}`;
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

    // Só redirecionar se não estiver em páginas de auth e for erro de autenticação
    if ((status === 401 || status === 403) && !isRedirecting && 
        !currentPath.includes('/login') && !currentPath.includes('/cadastro')) {
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
