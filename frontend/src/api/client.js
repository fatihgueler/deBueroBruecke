import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

export const api = axios.create({
  baseURL,
  timeout: 60_000,
});

const STORAGE_KEY = 'buerbruecke.token';

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(STORAGE_KEY);
    delete api.defaults.headers.common.Authorization;
  }
}

export function getAuthToken() {
  return localStorage.getItem(STORAGE_KEY);
}

const initialToken = getAuthToken();
if (initialToken) {
  api.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
    }
    return Promise.reject(error);
  },
);

export function extractErrorMessage(error, fallback = 'Ein Fehler ist aufgetreten.') {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  if (error?.message) return error.message;
  return fallback;
}

export const authApi = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (email, password, preferred_language) =>
    api.post('/api/auth/register', { email, password, preferred_language }),
  me: () => api.get('/api/auth/me'),
  updateMe: (data) => api.patch('/api/auth/me', data),
};

export const documentsApi = {
  list: () => api.get('/api/documents/'),
  get: (id) => api.get(`/api/documents/${id}`),
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/documents/upload', formData, {
      onUploadProgress,
    });
  },
  remove: (id) => api.delete(`/api/documents/${id}`),
};

export const analysisApi = {
  analyze: (documentId) => api.post(`/api/analysis/${documentId}`),
  get: (documentId) => api.get(`/api/analysis/${documentId}`),
  reply: (documentId, additionalContext) =>
    api.post(`/api/analysis/${documentId}/reply`, { additional_context: additionalContext || null }),
};
