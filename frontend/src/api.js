import axios from 'axios';

const api = axios.create({
  baseURL: 'https://anudip-production.up.railway.app/api',
  withCredentials: true,
});

// Attach access token before requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const noAuthRoutes = ['/login', '/register', '/admin-login', '/refresh-token'];
  const isPublic = noAuthRoutes.some(route => config.url.endsWith(route));

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 by attempting refresh
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
        const refreshRes = await api.post('/refresh-token'); // sends cookie
        const newAccessToken = refreshRes.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/'; // Or redirect to login
      }
    }

    return Promise.reject(err);
  }
);

export default api;
