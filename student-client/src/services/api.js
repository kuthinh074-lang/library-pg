import axios from 'axios';

export const apiBaseUrl = process.env.REACT_APP_API_URL || '/api';
const api = axios.create({ baseURL: apiBaseUrl });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('student_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('student_token');
      localStorage.removeItem('student_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
