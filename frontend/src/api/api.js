import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Document APIs
export const documentAPI = {
  create: (data) => axios.post(`${API_BASE}/documents`, data),
  getAll: (params) => axios.get(`${API_BASE}/documents`, { params }),
  getById: (id) => axios.get(`${API_BASE}/documents/${id}`),
  update: (id, data) => axios.put(`${API_BASE}/documents/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/documents/${id}`),
};

// Section APIs
export const sectionAPI = {
  create: (data) => axios.post(`${API_BASE}/sections`, data),
  getByDocument: (documentId) => axios.get(`${API_BASE}/sections/${documentId}`),
  update: (id, data) => axios.put(`${API_BASE}/sections/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/sections/${id}`),
};

// Yearly Progress APIs
export const yearlyProgressAPI = {
  createOrUpdate: (data) => axios.post(`${API_BASE}/yearly-progress`, data),
  getBySection: (sectionId) => axios.get(`${API_BASE}/yearly-progress/${sectionId}`),
  delete: (id) => axios.delete(`${API_BASE}/yearly-progress/${id}`),
};
