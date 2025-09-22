import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';

export interface DashboardStats {
  totalSystems: number;
  totalDownloads: number;
  totalUsers: number;
  averageRating: number;
  systemsByDepartment: Record<string, number>;
}

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