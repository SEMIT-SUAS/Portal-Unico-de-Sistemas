import { useState, useEffect } from 'react';
import { systemService, dashboardService } from '../services/api.ts';
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
      const response = await systemService.getAll();
      setSystems(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar sistemas');
      console.error('Error fetching systems:', err);
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
      
      // Use o dashboardService que já existe
      const response = await dashboardService.getStats(department || undefined);
      setStats(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar dashboard');
      console.error('Error fetching dashboard stats:', err);
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

export default { useSystems, useDashboard };