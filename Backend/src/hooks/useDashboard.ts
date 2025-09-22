// src/hooks/Dashboard.ts
import { dashboardService } from '../services/api';

export interface DashboardStats {
  totalSystems: number;
  totalDownloads: number;
  totalUsers: number;
  averageRating: number;
  systemsByDepartment: Record<string, number>;
}

// Convertendo para uma classe ou funções utilitárias do backend
export class DashboardHooks {
  static async getDashboardStats() {
    try {
      const response = await dashboardService.getStats();
      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      return {
        success: false,
        data: null,
        error: err.response?.data?.message || 'Erro ao carregar dashboard'
      };
    }
  }
}

// Ou como função simples:
export const getDashboardData = async () => {
  try {
    const response = await dashboardService.getStats();
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};