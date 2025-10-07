import axios from 'axios';

// Use .env: VITE_API_URL=http://localhost:8080/v1/doevida
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida',
  timeout: 15000,
});

// Interceptor: anexa token (se houver)
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Garante que o content-type seja JSON
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// Interceptor de resposta para tratamento de erros
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default http;