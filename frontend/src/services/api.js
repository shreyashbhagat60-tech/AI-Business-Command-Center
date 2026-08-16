import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-business-command-center-api.onrender.com';
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Authorization Bearer Token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('ai_bcc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor: Format error messages
apiClient.interceptors.response.use(
  response => response,
  error => {
    let message = 'An unexpected network error occurred.';
    if (error.response) {
      message = error.response.data?.detail || error.response.data?.message || `Server returned ${error.response.status}`;
    } else if (error.request) {
      message = 'Cannot connect to backend server. Please verify the FastAPI backend is running.';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const apiService = {
  // Authentication & Profile
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await apiClient.put('/profile', profileData);
    return res.data;
  },

  forgotPassword: async (data) => {
    const res = await apiClient.post('/auth/forgot-password', data);
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },

  // Business Intelligence & Predictions
  getDashboard: async () => {
    const res = await apiClient.get('/dashboard');
    return res.data;
  },

  predictSales: async (data) => {
    const res = await apiClient.post('/predict/sales', data);
    return res.data;
  },

  predictProfit: async (data) => {
    const res = await apiClient.post('/predict/profit', data);
    return res.data;
  },

  predictChurn: async (data) => {
    const res = await apiClient.post('/predict/churn', data);
    return res.data;
  },

  predictSegment: async (data) => {
    const res = await apiClient.post('/predict/segment', data);
    return res.data;
  },

  getAdvisor: async (data = {}) => {
    const res = await apiClient.post('/advisor', data);
    return res.data;
  },

  chatAdvisor: async (query) => {
    const res = await apiClient.post('/advisor/chat', { query });
    return res.data;
  },

  getAnalytics: async () => {
    const res = await apiClient.get('/analytics');
    return res.data;
  },

  filterAnalytics: async (filters) => {
    const res = await apiClient.post('/analytics/filter', filters);
    return res.data;
  },

  getReports: async (type = 'sales') => {
    const res = await apiClient.get(`/reports?type=${type}`);
    return res.data;
  },

  getHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  reloadModels: async () => {
    const res = await apiClient.post('/health/reload');
    return res.data;
  },

  getExportUrl: (type = 'sales', format = 'csv') => {
    return `${BASE_URL}/reports/export?type=${type}&format=${format}`;
  }
};

export default apiService;
