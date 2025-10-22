// src/controllers/DashboardController.ts
import { Request, Response } from 'express';
import { StatsModel } from '../models/StatsModel';
import pool from '../config/database';

export class DashboardController {
  private static readonly departmentMap: Record<string, string[]> = {
    'saude': ['SEMUS'],
    'educacao': ['SEMED'],
    'assistencia-social': ['SEMAS'],
    'meio-ambiente': ['SEMAPA'],
    'fazenda-financas': ['SEMFAZ'],
    'planejamento': ['SEPLAN'],
    'tecnologia': ['SEMIT'],
    'transito-transporte': ['SEMTT'],
    'cultura': ['SECULT'],
    'urbanismo': ['SEMURH']
  };

  // Obter as 5 métricas principais
  static async getDashboardStats(req: Request, res: Response) {
    const { department } = req.query;
    let client;

    try {
      client = await pool.connect();
      
      // Buscar estatísticas gerais
      const generalStats = await StatsModel.getDashboardStats();
      
      // Se houver filtro por departamento, calcular estatísticas específicas
      let departmentStats = null;
      if (department && typeof department === 'string' && this.departmentMap[department]) {
        departmentStats = await this.getDepartmentSpecificStats(department);
      }

      // Usar estatísticas do departamento se disponível, senão usar gerais
      const stats = departmentStats || generalStats;

      res.json({
        success: true,
        data: {
          totalSystems: stats.totalSystems,
          totalDownloads: stats.totalDownloads,
          totalUsers: stats.totalUsers,
          averageRating: stats.averageRating,
          totalReviews: stats.totalReviews,
          isFiltered: !!departmentStats,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar estatísticas do dashboard',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // Obter estatísticas específicas de um departamento
  private static async getDepartmentSpecificStats(department: string): Promise<any> {
    let client;
    try {
      client = await pool.connect();
      
      const secretaries = this.departmentMap[department] || [];
      if (secretaries.length === 0) return null;

      // ✅ CORREÇÃO: Usar igualdade ao invés de LIKE
      const conditions = secretaries.map((secretary, index) => 
        `responsible_secretary = $${index + 1}`
      ).join(' OR ');

      const query = `
        SELECT 
          COUNT(*) as total_systems,
          COALESCE(SUM(downloads), 0) as total_downloads,
          COALESCE(SUM(usage_count), 0) as total_users,
          COALESCE(AVG(rating), 0) as average_rating,
          COALESCE(SUM(reviews_count), 0) as total_reviews
        FROM digital_systems
        WHERE ${conditions}
      `;

      const result = await client.query(query, secretaries);
      const row = result.rows[0];

      return {
        totalSystems: parseInt(row.total_systems),
        totalDownloads: parseInt(row.total_downloads),
        totalUsers: parseInt(row.total_users),
        averageRating: parseFloat(row.average_rating),
        totalReviews: parseInt(row.total_reviews)
      };
    } catch (error) {
      console.error('Error fetching department specific stats:', error);
      return null;
    } finally {
      if (client) client.release();
    }
  }
}