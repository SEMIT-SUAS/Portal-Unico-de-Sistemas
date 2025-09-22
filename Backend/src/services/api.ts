import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de requests
api.interceptors.request.use(
  (config: { method: string; url: any; }) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: { response: { data: any; }; message: any; }) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Serviços para sistemas
export const systemService = {
  getAll: () => api.get('/systems'),
  getById: (id: number) => api.get(`/systems/${id}`),
  getByCategory: (category: string) => api.get(`/systems/category/${category}`),
  getByDepartment: (department: string) => api.get(`/systems/department/${department}`),
  search: (query: string) => api.post('/systems/search', { query }),
  addReview: (id: number, reviewData: any) => api.post(`/systems/${id}/review`, reviewData),
};

// Serviços para dashboard
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getCharts: () => api.get('/dashboard/charts'),
  getCards: () => api.get('/dashboard/cards'),
};

// Serviços para categorias
export const categoryService = {
  getAll: () => api.get('/categories'),
  getDepartments: () => api.get('/categories/departments'),
  getSecretaries: () => api.get('/categories/secretaries'),
};

export default api;