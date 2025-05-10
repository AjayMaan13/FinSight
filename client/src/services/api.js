// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;

// Transaction endpoints
export const createTransaction = (data) => api.post('/transactions', data);
export const getTransactions = (params) => api.get('/transactions', { params });
export const getTransaction = (id) => api.get(`/transactions/${id}`);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
export const getTransactionSummary = (params) => api.get('/transactions/summary', { params });
export const getMonthlyTrends = (params) => api.get('/transactions/monthly', { params });
export const importFromCSV = (data) => api.post('/transactions/import', data);

// Goal endpoints
export const createGoal = (data) => api.post('/goals', data);
export const getGoals = (params) => api.get('/goals', { params });
export const getGoal = (id) => api.get(`/goals/${id}`);
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);
export const getGoalProgress = (id) => api.get(`/goals/${id}/progress`);