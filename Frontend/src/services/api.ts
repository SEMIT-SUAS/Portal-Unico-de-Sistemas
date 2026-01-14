// src/services/api.ts
import axios from 'axios';

// PARA FRONTEND: Use import.meta.env (Vite) em vez de process.env
//const API_BASE_URL =  'http://10.0.0.116:3001/api';
//const API_BASE_URL =  'https://sistemas.saoluis.ma.gov.br/api/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (apenas logging no dev)
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🔧 [API] Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log(`🔧 [API] Data:`, config.data);
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
    if (import.meta.env.DEV) {
      console.log(`🔧 [API] Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    console.error('❌ [API] Error:', error.response?.data || error.message);
    
    // Tratamento de erros específicos
    if (error.code === 'ECONNREFUSED') {
      error.message = 'Servidor indisponível. Verifique se o backend está rodando.';
    } else if (error.response?.status === 404) {
      error.message = 'Recurso não encontrado.';
    }
    
    return Promise.reject(error);
  }
);

// Interface para as estatísticas do dashboard
export interface DashboardStats {
  totalSystems: number;
  totalDownloads: number;
  totalUsers: number;
  averageRating: number;
  totalReviews: number;
  isFiltered?: boolean;
  lastUpdated: string;
}

// Serviços para sistemas
export const systemService = {
  getAll: () => api.get('/systems'),
  getById: (id: number) => api.get(`/systems/${id}`),
  getByCategory: (category: string) => api.get(`/systems/category/${category}`),
  getByDepartment: (department: string) => api.get(`/systems/department/${department}`),
  search: (query: string) => api.post('/systems/search', { query }),
  
  addReview: (id: number, reviewData: any) => {
    console.log('🔧 [API SERVICE] Enviando review para:', `/systems/${id}/review`);
    console.log('🔧 [API SERVICE] Dados:', reviewData);
    return api.post(`/systems/${id}/review`, reviewData);
  },
  
  incrementDownloads: (id: number) => api.post(`/systems/${id}/increment-downloads`),
  // ✅ NOVO SERVIÇO: Incrementar acessos
  incrementAccess: (id: number) => api.post(`/systems/${id}/increment-access`),
  
  // ✅ SERVIÇOS DE TESTE
  testReview: (id: number, reviewData: any) => {
    console.log('🧪 [API SERVICE] Teste review para:', `/systems/test/${id}`);
    return api.post(`/systems/test/${id}`, reviewData);
  },
  
  simpleReview: (id: number, reviewData: any) => {
    console.log('🧪 [API SERVICE] Simple review para:', `/systems/simple/${id}`);
    return api.post(`/systems/simple/${id}`, reviewData);
  },
  
  // Novo método para dashboard com suporte a filtro por departamento
  getDashboardStats: (department?: string): Promise<{ data: DashboardStats }> => {
    const url = department 
      ? `/dashboard/stats?department=${encodeURIComponent(department)}`
      : '/dashboard/stats';
    return api.get(url);
  },
};

// Serviços para dashboard (mantidos para compatibilidade)
export const dashboardService = {
  getStats: (department?: string) => {
    const url = department 
      ? `/dashboard/stats?department=${encodeURIComponent(department)}`
      : '/dashboard/stats';
    return api.get(url);
  },
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