import { useState, useEffect } from 'react';
import { systemService, dashboardService } from '../services/api';
import { DigitalSystem } from '../types';

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

// Hook para sistemas
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
      console.log('✅ Sistemas carregados:', response.data.data?.length || 0);
      setSystems(response.data.data || []);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar sistemas';
      setError(errorMessage);
      console.error('❌ Error fetching systems:', err);
      
      // Fallback para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Tentando fallback para backend local...');
        // Você pode adicionar um fallback local aqui se necessário
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
      
      // Use o dashboardService que já existe
      const response = await dashboardService.getStats(department || undefined);
      console.log('✅ Estatísticas carregadas:', response.data.data);
      setStats(response.data.data);
      
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
  }, [selectedDepartment]); // Recarrega quando o departamento muda

  const refetch = () => {
    fetchDashboardStats(selectedDepartment);
  };

  return { stats, loading, error, refetch };
};

// Hook para incrementar downloads
export const useSystemDownloads = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const incrementDownload = async (systemId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📥 Incrementando download para sistema ${systemId}...`);
      
      const response = await systemService.incrementDownloads(systemId);
      console.log('✅ Download incrementado:', response.data);
      return response.data;
      
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

// Hook para incrementar acessos
export const useSystemAccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const incrementAccess = async (systemId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🚀 Incrementando acesso para sistema ${systemId}...`);
      
      const response = await systemService.incrementAccess(systemId);
      console.log('✅ Acesso incrementado:', response.data);
      return response.data;
      
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

export default { useSystems, useDashboard, useSystemDownloads, useSystemAccess };