import axios from 'axios';

const api = axios.create({
  baseURL: 'https://anudip-production.up.railway.app/api',
  withCredentials: true, // for sending cookies like refreshToken
});

const noAuthRoutes = ['/login', '/register', '/admin-login', '/refresh-token'];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const urlPath = new URL(config.url, api.defaults.baseURL).pathname;

  const isPublic = noAuthRoutes.some(route => urlPath.endsWith(route));

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auto-refresh access token if expired
api.interceptors.response.use(
  res => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith('/refresh-token')
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.post('/refresh-token');
        const newAccessToken = refreshRes.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/';
      }
    }

    return Promise.reject(err);
  }
);

export default api;
