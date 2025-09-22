// src/hooks/system.ts
import { systemService, dashboardService } from '../services/api';
import { ApiDigitalSystem } from '../types';

export interface DashboardStats {
  totalSystems: number;
  totalDownloads: number;
  totalUsers: number;
  averageRating: number;
  systemsByDepartment: Record<string, number>;
}

// Utilitários para sistemas
export const SystemHooks = {
  async fetchSystems(filters?: any) {
    try {
      const response = await systemService.getAll();
      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error: any) {
      console.error('Error fetching systems:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Erro ao carregar sistemas'
      };
    }
  },

  async fetchSystemById(id: number) {
    try {
      const response = await systemService.getById(id);
      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error: any) {
      console.error('Error fetching system:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Erro ao carregar sistema'
      };
    }
  }
};

// Utilitários para dashboard
export const DashboardHooks = {
  async fetchDashboardStats() {
    try {
      const response = await dashboardService.getStats();
      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Erro ao carregar dashboard'
      };
    }
  },

  async fetchDashboardCharts() {
    try {
      const response = await dashboardService.getCharts();
      return {
        success: true,
        data: response.data.data,
        error: null
      };
    } catch (error: any) {
      console.error('Error fetching dashboard charts:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Erro ao carregar gráficos'
      };
    }
  }
};

export default {
  SystemHooks,
  DashboardHooks
};