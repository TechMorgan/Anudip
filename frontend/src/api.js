import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mysql-production-ee23.up.railway.app:3306/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = token;
  return config;
});

export default api;
