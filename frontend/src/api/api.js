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
  create: (data) => api.post('/documents', data),
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
};

// Section APIs
export const sectionAPI = {
  create: (data) => api.post('/sections', data),
  getByDocument: (documentId) => api.get(`/sections/${documentId}`),
  update: (id, data) => api.put(`/sections/${id}`, data),
  delete: (id) => api.delete(`/sections/${id}`),
};

// Yearly Progress APIs
export const yearlyProgressAPI = {
  createOrUpdate: (data) => api.post('/yearly-progress', data),
  getBySection: (sectionId) => api.get(`/yearly-progress/${sectionId}`),
  delete: (id) => api.delete(`/yearly-progress/${id}`),
};

export default api;

