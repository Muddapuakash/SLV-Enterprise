import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sv_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('sv_refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || ''}/api/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefresh } = res.data.data;
        localStorage.setItem('sv_access_token', accessToken);
        localStorage.setItem('sv_refresh_token', newRefresh);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('sv_access_token');
        localStorage.removeItem('sv_refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
