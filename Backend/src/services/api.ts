// src/services/api.ts
import axios from 'axios';

// Para o backend, usamos a URL interna
// const API_BASE_URL = process.env.API_URL || 'https://sistemas.saoluis.ma.gov.br';
// const API_BASE_URL = 'https://sistemas.saoluis.ma.gov.br';
const API_BASE_URL = '';


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de requests
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
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
    
    // Tratamento de erro mais robusto
    if (error.code === 'ECONNREFUSED') {
      error.message = 'Servidor indisponível. Verifique se a API está rodando.';
    } else if (error.response?.status === 404) {
      error.message = 'Recurso não encontrado.';
    } else if (error.response?.status >= 500) {
      error.message = 'Erro interno do servidor.';
    }
    
    return Promise.reject(error);
  }
);

// Serviços para sistemas
export const systemService = {
  getAll: () => api.get('/api/systems'),
  getById: (id: number) => api.get(`/systems/${id}`),
  getByCategory: (category: string) => api.get(`/systems/category/${category}`),
  getByDepartment: (department: string) => api.get(`/systems/department/${department}`),
  search: (query: string) => api.post('/systems/search', { query }),
  addReview: (id: number, reviewData: any) => api.post(`/systems/${id}/review`, reviewData),
  incrementDownloads: (id: number) => api.post(`/systems/${id}/increment-downloads`),
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

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error };
  }
};

export default api;