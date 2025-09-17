import { Request, Response } from 'express';
import { StatsModel } from '../models/StatsModel';
import { SystemModel } from '../models/SystemModel';
import { CategoryModel } from '../models/CategoryModel';

export class DashboardController {
  /**
   * Obter estatísticas gerais do dashboard
   */
  static async getDashboardStats(req: Request, res: Response) {
    try {
      // Obter estatísticas básicas
      const stats = await StatsModel.getDashboardStats();
      
      // Obter estatísticas por departamento
      const departmentStats = await StatsModel.getDepartmentStats();
      
      // Obter contagem de sistemas por departamento (formato específico para o frontend)
      const systemsByDepartment = await DashboardController.getSystemsByDepartmentCount();
      
      // Obter sistemas mais populares e melhor avaliados
      const popularSystems = await StatsModel.getPopularSystems(5);
      const topRatedSystems = await StatsModel.getTopRatedSystems(5);

      res.json({
        success: true,
        data: {
          // Estatísticas gerais
          totalSystems: stats.totalSystems,
          totalDownloads: stats.totalDownloads,
          totalUsers: stats.totalUsers,
          averageRating: stats.averageRating,
          
          // Estatísticas por departamento (formato do frontend)
          systemsByDepartment,
          
          // Dados adicionais para gráficos
          departmentStats,
          
          // Sistemas em destaque
          popularSystems,
          topRatedSystems,
          
          // Timestamp
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar estatísticas do dashboard',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Obter dados para gráficos do dashboard
   */
  static async getDashboardCharts(req: Request, res: Response) {
    try {
      const [departmentStats, categoryStats, ratingDistribution] = await Promise.all([
        StatsModel.getDepartmentStats(),
        SystemModel.countByCategory(),
        DashboardController.getRatingDistribution()
      ]);

      res.json({
        success: true,
        data: {
          byDepartment: departmentStats,
          byCategory: categoryStats,
          ratingDistribution
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard charts:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar dados dos gráficos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Obter dados para cards do dashboard (formato específico do frontend)
   */
  static async getDashboardCards(req: Request, res: Response) {
    try {
      const stats = await StatsModel.getDashboardStats();
      const totalReviews = await DashboardController.getTotalReviews();

      res.json({
        success: true,
        data: {
          totalSystems: stats.totalSystems,
          totalDownloads: stats.totalDownloads,
          averageRating: stats.averageRating,
          totalReviews,
          systemsByDepartment: await DashboardController.getSystemsByDepartmentCount()
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard cards:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar cards do dashboard',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Métodos auxiliares privados
   */
  private static async getSystemsByDepartmentCount(): Promise<Record<string, number>> {
    try {
      const query = `
        SELECT 
          CASE 
            WHEN responsible_secretary LIKE '%SEMUS%' THEN 'saude'
            WHEN responsible_secretary LIKE '%SEMED%' THEN 'educacao'
            WHEN responsible_secretary LIKE '%SEMAS%' THEN 'assistencia-social'
            WHEN responsible_secretary LIKE '%SEMAPA%' THEN 'meio-ambiente'
            WHEN responsible_secretary LIKE '%SEMFAZ%' THEN 'fazenda-financas'
            WHEN responsible_secretary LIKE '%SEPLAN%' THEN 'planejamento'
            WHEN responsible_secretary LIKE '%SEMIT%' THEN 'tecnologia'
            WHEN responsible_secretary LIKE '%SEMTT%' THEN 'transito-transporte'
            WHEN responsible_secretary LIKE '%SECULT%' THEN 'cultura'
            WHEN responsible_secretary LIKE '%SEMURH%' THEN 'urbanismo'
            ELSE 'outros'
          END as department,
          COUNT(*) as count
        FROM digital_systems
        GROUP BY department
      `;

      const result = await pool.query(query);
      
      // Converter para o formato esperado pelo frontend
      const formattedResult: Record<string, number> = {
        'saude': 0,
        'educacao': 0,
        'assistencia-social': 0,
        'meio-ambiente': 0,
        'fazenda-financas': 0,
        'planejamento': 0,
        'tecnologia': 0,
        'transito-transporte': 0,
        'cultura': 0,
        'urbanismo': 0
      };

      result.rows.forEach(row => {
        if (formattedResult.hasOwnProperty(row.department)) {
          formattedResult[row.department] = parseInt(row.count);
        }
      });

      return formattedResult;
    } catch (error) {
      console.error('Error counting systems by department:', error);
      return {
        'saude': 0,
        'educacao': 0,
        'assistencia-social': 0,
        'meio-ambiente': 0,
        'fazenda-financas': 0,
        'planejamento': 0,
        'tecnologia': 0,
        'transito-transporte': 0,
        'cultura': 0,
        'urbanismo': 0
      };
    }
  }

  private static async getTotalReviews(): Promise<number> {
    try {
      const query = `SELECT COALESCE(SUM(reviews_count), 0) as total_reviews FROM digital_systems`;
      const result = await pool.query(query);
      return parseInt(result.rows[0].total_reviews);
    } catch (error) {
      console.error('Error getting total reviews:', error);
      return 0;
    }
  }

  private static async getRatingDistribution(): Promise<{ rating: number; count: number }[]> {
    try {
      const query = `
        SELECT 
          CASE 
            WHEN rating IS NULL THEN 0
            WHEN rating < 1 THEN 1
            WHEN rating >= 1 AND rating < 2 THEN 1
            WHEN rating >= 2 AND rating < 3 THEN 2
            WHEN rating >= 3 AND rating < 4 THEN 3
            WHEN rating >= 4 AND rating < 5 THEN 4
            ELSE 5
          END as rating_group,
          COUNT(*) as count
        FROM digital_systems
        WHERE rating IS NOT NULL
        GROUP BY rating_group
        ORDER BY rating_group
      `;

      const result = await pool.query(query);
      return result.rows.map(row => ({
        rating: parseInt(row.rating_group),
        count: parseInt(row.count)
      }));
    } catch (error) {
      console.error('Error getting rating distribution:', error);
      return [];
    }
  }
}

// Importar pool diretamente (ajuste conforme sua estrutura)
import { pool } from '../config/database';