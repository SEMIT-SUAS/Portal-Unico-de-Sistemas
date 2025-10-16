import { useState, useEffect } from 'react';
import { systemService, dashboardService } from '../services/api';
import { DigitalSystem, ApiDigitalSystem, UserReview } from '../types';

// ✅ Interfaces para as respostas da API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

interface SystemsResponse {
  data: DigitalSystem[];
  success: boolean;
  count: number;
  featuredCount?: number;
  newCount?: number;
  filters?: any;
}

interface SystemResponse {
  data: DigitalSystem;
  success: boolean;
}

interface StatsResponse {
  data: DashboardStats;
  success: boolean;
}

interface OperationResponse {
  success: boolean;
  message: string;
  newCount?: number;
  systemName?: string;
}

export interface DashboardStats {
  totalSystems: number;
  totalDownloads: number;
  totalUsers: number;
  averageRating: number;
  totalReviews: number;
  systemsByDepartment: Record<string, number>;
  isFiltered?: boolean;
  lastUpdated: string;
}

// Hook para sistemas - CORRIGIDO
export const useSystems = () => {
  const [systems, setSystems] = useState<DigitalSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Buscando sistemas...');
      
      const response = await systemService.getAll();
      const responseData = response.data as SystemsResponse;
      
      console.log('✅ Sistemas carregados:', responseData.data?.length || 0);
      setSystems(responseData.data || []);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar sistemas';
      setError(errorMessage);
      console.error('❌ Error fetching systems:', err);
      
      // Fallback para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Tentando fallback para backend local...');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  const refetch = () => {
    fetchSystems();
  };

  return { systems, loading, error, refetch };
};

// ✅ NOVO HOOK: Para operações específicas do sistema - CORRIGIDO
export const useSystemOperations = () => {
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  // ✅ Buscar sistema por ID
  const fetchSystemById = async (id: number): Promise<DigitalSystem | null> => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      
      const response = await systemService.getById(id);
      const responseData = response.data as SystemResponse;
      
      if (responseData.success) {
        return responseData.data;
      } else {
        setOperationError(responseData.message || 'Erro ao buscar sistema');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar sistema';
      setOperationError(errorMessage);
      console.error('❌ Error fetching system by ID:', err);
      return null;
    } finally {
      setOperationLoading(false);
    }
  };

  // ✅✅✅ CORRIGIDO: Adicionar avaliação - COM LOGS DETALHADOS
  const addReview = async (systemId: number, reviewData: {
    userName: string;
    rating: number;
    comment: string;
    demographics: {
      cor: string;
      sexo: string;
      idade: number;
    };
    location?: {
      latitude: number;
      longitude: number;
    };
  }): Promise<boolean> => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      
      console.log('🚀 [HOOK] Enviando avaliação para API...', {
        systemId,
        reviewData
      });
      
      const response = await systemService.addReview(systemId, reviewData);
      const responseData = response.data as OperationResponse;
      
      console.log('📨 [HOOK] Resposta da API:', responseData);
      
      if (responseData.success) {
        console.log('✅ [HOOK] Avaliação adicionada com sucesso no backend');
        return true;
      } else {
        console.log('❌ [HOOK] Erro do backend:', responseData.message);
        setOperationError(responseData.message || 'Erro ao adicionar avaliação');
        return false;
      }
    } catch (err: any) {
      console.error('💥 [HOOK] Erro na requisição:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao adicionar avaliação';
      setOperationError(errorMessage);
      console.error('❌ Error adding review:', err);
      return false;
    } finally {
      setOperationLoading(false);
    }
  };

  // ✅ Buscar sistemas por categoria
  const fetchSystemsByCategory = async (category: string): Promise<DigitalSystem[]> => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      
      const response = await systemService.getByCategory(category);
      const responseData = response.data as SystemsResponse;
      
      if (responseData.success) {
        return responseData.data || [];
      } else {
        setOperationError(responseData.message || 'Erro ao buscar sistemas por categoria');
        return [];
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar sistemas por categoria';
      setOperationError(errorMessage);
      console.error('❌ Error fetching systems by category:', err);
      return [];
    } finally {
      setOperationLoading(false);
    }
  };

  // ✅ Buscar sistemas por departamento
  const fetchSystemsByDepartment = async (department: string): Promise<DigitalSystem[]> => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      
      const response = await systemService.getByDepartment(department);
      const responseData = response.data as SystemsResponse;
      
      if (responseData.success) {
        return responseData.data || [];
      } else {
        setOperationError(responseData.message || 'Erro ao buscar sistemas por departamento');
        return [];
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar sistemas por departamento';
      setOperationError(errorMessage);
      console.error('❌ Error fetching systems by department:', err);
      return [];
    } finally {
      setOperationLoading(false);
    }
  };

  // ✅ Buscar sistemas em destaque
  const fetchHighlightedSystems = async (): Promise<DigitalSystem[]> => {
    try {
      const response = await systemService.getAll();
      const responseData = response.data as SystemsResponse;
      
      if (responseData.success) {
        return responseData.data.filter((system: DigitalSystem) => system.isHighlight) || [];
      }
      return [];
    } catch (err: any) {
      console.error('❌ Error fetching highlighted systems:', err);
      return [];
    }
  };

  // ✅ Buscar sistemas novos
  const fetchNewSystems = async (): Promise<DigitalSystem[]> => {
    try {
      const response = await systemService.getAll();
      const responseData = response.data as SystemsResponse;
      
      if (responseData.success) {
        return responseData.data.filter((system: DigitalSystem) => system.isNew) || [];
      }
      return [];
    } catch (err: any) {
      console.error('❌ Error fetching new systems:', err);
      return [];
    }
  };

  return {
    fetchSystemById,
    addReview,
    fetchSystemsByCategory,
    fetchSystemsByDepartment,
    fetchHighlightedSystems,
    fetchNewSystems,
    loading: operationLoading,
    error: operationError,
  };
};

// Hook para dashboard - CORRIGIDO
export const useDashboard = (selectedDepartment?: string | null) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async (department?: string | null) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Buscando estatísticas do dashboard...');
      
      const response = await dashboardService.getStats(department || undefined);
      const responseData = response.data as StatsResponse;
      
      console.log('✅ Estatísticas carregadas:', responseData.data);
      setStats(responseData.data);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar dashboard';
      setError(errorMessage);
      console.error('❌ Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats(selectedDepartment);
  }, [selectedDepartment]);

  const refetch = () => {
    fetchDashboardStats(selectedDepartment);
  };

  return { stats, loading, error, refetch };
};

// Hook para incrementar downloads - CORRIGIDO
export const useSystemDownloads = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const incrementDownload = async (systemId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📥 Incrementando download para sistema ${systemId}...`);
      
      const response = await systemService.incrementDownloads(systemId);
      const responseData = response.data as OperationResponse;
      
      console.log('✅ Download incrementado:', responseData);
      return responseData;
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao registrar download';
      setError(errorMessage);
      console.error('❌ Error incrementing download:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { incrementDownload, loading, error };
};

// Hook para incrementar acessos - CORRIGIDO
export const useSystemAccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const incrementAccess = async (systemId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🚀 Incrementando acesso para sistema ${systemId}...`);
      
      const response = await systemService.incrementAccess(systemId);
      const responseData = response.data as OperationResponse;
      
      console.log('✅ Acesso incrementado:', responseData);
      return responseData;
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao registrar acesso';
      setError(errorMessage);
      console.error('❌ Error incrementing access:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { incrementAccess, loading, error };
};

// ✅ NOVO HOOK: Para busca de sistemas - CORRIGIDO
export const useSystemSearch = () => {
  const [searchResults, setSearchResults] = useState<DigitalSystem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchSystems = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);
      
      const response = await systemService.search(query);
      const responseData = response.data as SystemsResponse;
      
      if (responseData.success) {
        setSearchResults(responseData.data || []);
      } else {
        setSearchError(responseData.message || 'Erro na busca');
        setSearchResults([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro na busca';
      setSearchError(errorMessage);
      setSearchResults([]);
      console.error('❌ Error searching systems:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchError(null);
  };

  return {
    searchResults,
    searchLoading,
    searchError,
    searchSystems,
    clearSearch,
  };
};

export default { 
  useSystems, 
  useSystemOperations, 
  useDashboard, 
  useSystemDownloads, 
  useSystemAccess,
  useSystemSearch 
};