import axios from 'axios';

// PARA FRONTEND: Use import.meta.env (Vite) em vez de process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (apenas logging no dev)
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // Tratamento de erros específicos
    if (error.code === 'ECONNREFUSED') {
      error.message = 'Servidor indisponível. Verifique se o backend está rodando.';
    } else if (error.response?.status === 404) {
      error.message = 'Recurso não encontrado.';
    }
    
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