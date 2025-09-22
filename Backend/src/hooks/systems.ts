import { useState, useEffect } from 'react';
import { systemService, dashboardService } from '../services/api';
import { DigitalSystem } from '../data/systems';

export interface DashboardStats {
  totalSystems: number;
  totalDownloads: number;
  totalUsers: number;
  averageRating: number;
  systemsByDepartment: Record<string, number>;
}

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

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getStats();
      setStats(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar dashboard');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const refetch = () => {
    fetchDashboardStats();
  };

  return { stats, loading, error, refetch };
};