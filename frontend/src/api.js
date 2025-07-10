import axios from 'axios';

const api = axios.create({
  baseURL: 'anudip-production.up.railway.app:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = token;
  return config;
});

export default api;
