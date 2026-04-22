import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Gắn JWT token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý lỗi 401 → logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ─── SÁCH / BOOKS ─────────────────────────────────────────────────────────────
export const booksAPI = {
  getAll: (params) => api.get('/books', { params }),          // ?page=1&limit=10&genre=&search=
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  getGenres: () => api.get('/books/genres'),
  exportExcel: () => api.get('/books/export', { responseType: 'blob' }),
};

// ─── ĐỘC GIẢ / MEMBERS ────────────────────────────────────────────────────────
export const membersAPI = {
  getAll: (params) => api.get('/members', { params }),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
  getBorrowHistory: (id) => api.get(`/members/${id}/borrows`),
};

// ─── MƯỢN / TRẢ SÁCH / BORROWS ───────────────────────────────────────────────
export const borrowsAPI = {
  getAll: (params) => api.get('/borrows', { params }),        // ?status=active|overdue|returned
  getById: (id) => api.get(`/borrows/${id}`),
  issue: (data) => api.post('/borrows', data),               // { memberId, bookId, daysLoan }
  returnBook: (id, data) => api.put(`/borrows/${id}/return`, data), // { condition }
  extend: (id, data) => api.put(`/borrows/${id}/extend`, data),
  getOverdue: () => api.get('/borrows/overdue'),
  sendReminder: (id) => api.post(`/borrows/${id}/remind`),
  sendAllReminders: () => api.post('/borrows/remind-all'),
};

// ─── THỐNG KÊ / REPORTS ───────────────────────────────────────────────────────
export const reportsAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getMonthly: (params) => api.get('/reports/monthly', { params }), // ?year=2026
  getTopBooks: () => api.get('/reports/top-books'),
  exportMonthly: (params) => api.get('/reports/export', { params, responseType: 'blob' }),
};

export default api;
