import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm token vào header của mỗi request
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

// Xử lý lỗi token hết hạn (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Một số logic nếu muốn logout hoặc redirect khi token hết hạn
      // localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Document APIs
export const documentAPI = {
  create: (formData) => api.post('/documents', formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  }),
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  update: (id, formData) => api.put(`/documents/${id}`, formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  }),
  delete: (id) => api.delete(`/documents/${id}`),
};

// Section APIs
export const sectionAPI = {
  create: (data) => api.post('/sections', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
  }),
  getByDocument: (documentId) => api.get(`/sections/${documentId}`),
  update: (id, data) => api.put(`/sections/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
  }),
  delete: (id) => api.delete(`/sections/${id}`),
};

// Yearly Progress APIs
export const yearlyProgressAPI = {
  createOrUpdate: (data) => api.post('/yearly-progress', data),
  getBySection: (sectionId) => api.get(`/yearly-progress/${sectionId}`),
  delete: (id) => api.delete(`/yearly-progress/${id}`),
};

// Project APIs
export const projectAPI = {
  create: (data) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Văn bản APIs
export const vanBanAPI = {
  getAll: (params) => api.get('/van-ban', { params }),
  getById: (id) => api.get(`/van-ban/${id}`),
  // create/update dùng FormData vì có thể kèm file
  create: (formData) => api.post('/van-ban', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/van-ban/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/van-ban/${id}`),
  // URL download proxy — backend stream file về
  downloadUrl: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/van-ban/${id}/download`,
  // URL view proxy
  viewUrl: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/van-ban/${id}/download?view=true`,
};

// User APIs
export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;

