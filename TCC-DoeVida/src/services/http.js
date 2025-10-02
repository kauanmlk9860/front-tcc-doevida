import axios from 'axios';

// Use .env: VITE_API_URL=http://localhost:8080/v1/doevida
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://10.107.144.16:8080/v1/doevida/',
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

export default http;