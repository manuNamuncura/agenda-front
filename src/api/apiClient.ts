import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

apiClient.interceptors.request.use((config) => {
  // 1. Buscamos el token de forma limpia
  const token = localStorage.getItem('auth_token');

  // 2. Solo inyectamos el header si el token realmente existe
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;