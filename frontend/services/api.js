// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://api.intellibotic.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API methods
export const botService = {
  getAllBots: () => api.get('/bots'),
  getBotById: (id) => api.get(`/bots/${id}`),
  createBot: (botData) => api.post('/bots', botData),
  updateBot: (id, botData) => api.put(`/bots/${id}`, botData),
  deleteBot: (id) => api.delete(`/bots/${id}`),
  saveBotFlow: (botId, flowData) => api.post(`/bots/${id}/flow`, flowData),
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getUserProfile: () => api.get('/auth/me'),
};

export const featureService = {
  getAllFeatures: () => api.get('/features'),
  createFeature: (featureData) => api.post('/features', featureData),
  executeCode: (code) => api.post('/dev/execute', { code }),
};
