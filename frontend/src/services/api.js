import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:10000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('intellibotic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const login = (credentials) => api.post('/login', credentials);
export const getBots = () => api.get('/bots');
export const createBot = (botData) => api.post('/bots', botData);
export const updateBot = (id, botData) => api.put(`/bots/${id}`, botData);
export const deleteBot = (id) => api.delete(`/bots/${id}`);
export const importBot = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/import-bot', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
