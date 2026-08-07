import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';

const api = axios.create({
  baseURL: isDev ? 'http://localhost:5000/api' : '/api'
});

export const getUploadUrl = (filename) => {
  return isDev ? `http://localhost:5000/uploads/${filename}` : `/uploads/${filename}`;
};

// Interceptor to attach Authorization JWT header if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
