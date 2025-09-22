// src/hooks/system.ts
import { systemService, dashboardService } from '../services/api';
import { DigitalSystem } from '../types';

export interface DashboardStats {
  totalSystems: number;
  totalDownloads: number;
  totalUsers: number;
  averageRating: number;
  systemsByDepartment: Record<string, number>;
}

// Se você quer usar isso no backend, provavelmente são funções utilitárias, não hooks React
export class SystemHooks {
  static async useSystems() {
    try {
      const response = await systemService.getAll();
      return {
        systems: response.data.data,
        error: null
      };
    } catch (err: any) {
      console.error('Error fetching systems:', err);
      return {
        systems: [],
        error: err.response?.data?.message || 'Erro ao carregar sistemas'
      };
    }
  }

  static async useDashboard() {
    try {
      const response = await dashboardService.getStats();
      return {
        stats: response.data.data,
        error: null
      };
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      return {
        stats: null,
        error: err.response?.data?.message || 'Erro ao carregar dashboard'
      };
    }
  }
}

// Ou se preferir funções separadas:
export const fetchSystems = async () => {
  try {
    const response = await systemService.getAll();
    return response.data.data;
  } catch (error) {
    console.error('Error fetching systems:', error);
    throw error;
  }
};

export const fetchDashboardStats = async () => {
  try {
    const response = await dashboardService.getStats();
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};