import axios from 'axios';

const api = axios.create({
  baseURL: 'http://hopper.proxy.rlwy.net:59595/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = token;
  return config;
});

export default api;
