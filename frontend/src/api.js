import axios from 'axios';

const api = axios.create({
  baseURL: 'https://anudip-production.up.railway.app/api',
  withCredentials: true, // Important for refresh token cookies
});

// Attach access token before requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  // Skip token for these routes
  const noAuthRoutes = ['/login', '/register', '/admin-login', '/refresh-token'];
  const isPublic = noAuthRoutes.some(route => config.url.endsWith(route));

  if (token && !isPublic) {
    config.headers.Authorization = token;
  }

  return config;
});

// Refresh access token on 401
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.post('/refresh-token'); // sends cookie
        const newAccessToken = refreshRes.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = newAccessToken;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/'; // or login route
      }
    }

    return Promise.reject(error);
  }
);

export default api;
