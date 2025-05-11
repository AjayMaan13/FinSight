import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests if available
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Transaction endpoints
export const transactionAPI = {
  create: (data) => api.post('/transactions', data),
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getSummary: (params) => api.get('/transactions/summary', { params }),
  getMonthlyTrends: (params) => api.get('/transactions/monthly', { params }),
  importCSV: (data) => api.post('/transactions/import', data),
};

// Goal endpoints  
export const goalAPI = {
  create: (data) => api.post('/goals', data),
  getAll: (params) => api.get('/goals', { params }),
  getById: (id) => api.get(`/goals/${id}`),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
  updateProgress: (id, amount) => api.put(`/goals/${id}/progress`, { amount }),
  getStats: () => api.get('/goals/stats'),
};

// Budget endpoints
export const budgetAPI = {
  create: (data) => api.post('/budgets', data),
  getAll: (params) => api.get('/budgets', { params }),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
};

// User endpoints
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  deleteAccount: () => api.delete('/users/account'),
};

// Export individual functions for backward compatibility
export const createTransaction = transactionAPI.create;
export const getTransactions = transactionAPI.getAll;
export const getTransaction = transactionAPI.getById;
export const updateTransaction = transactionAPI.update;
export const deleteTransaction = transactionAPI.delete;
export const getTransactionSummary = transactionAPI.getSummary;
export const getMonthlyTrends = transactionAPI.getMonthlyTrends;
export const importFromCSV = transactionAPI.importCSV;

export const createGoal = goalAPI.create;
export const getGoals = goalAPI.getAll;
export const getGoal = goalAPI.getById;
export const updateGoal = goalAPI.update;
export const deleteGoal = goalAPI.delete;
export const getGoalProgress = goalAPI.updateProgress;

export default api;