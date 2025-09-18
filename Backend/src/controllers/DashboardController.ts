import { Request, Response } from 'express';
import { StatsModel } from '../models/StatsModel';
import { SystemModel } from '../models/SystemModel';
import { getConnection } from '../config/database';

export class DashboardController {
  // Obter estatísticas do dashboard
  static async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await StatsModel.getDashboardStats();
      const departmentStats = await StatsModel.getDepartmentStats();
      
      // Obter contagem por departamento (formato específico para o frontend)
      const systemsByDepartment = await DashboardController.getSystemsByDepartmentCount();
      
      res.json({
        success: true,
        data: {
          totalSystems: stats.totalSystems,
          totalDownloads: stats.totalDownloads,
          totalUsers: stats.totalUsers,
          averageRating: stats.averageRating,
          systemsByDepartment,
          departmentStats,
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
    }
  }

  // Obter dados para gráficos
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
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Obter dados para cards
  static async getDashboardCards(req: Request, res: Response) {
    try {
      const stats = await StatsModel.getDashboardStats();
      const totalReviews = await DashboardController.getTotalReviews();
      const systemsByDepartment = await DashboardController.getSystemsByDepartmentCount();

      res.json({
        success: true,
        data: {
          totalSystems: stats.totalSystems,
          totalDownloads: stats.totalDownloads,
          averageRating: stats.averageRating,
          totalReviews,
          systemsByDepartment
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard cards:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar cards do dashboard',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Métodos auxiliares
  private static async getSystemsByDepartmentCount(): Promise<Record<string, number>> {
    let connection;
    try {
      connection = await getConnection();
      
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

      const [rows] = await connection.execute(query);
      
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
        'urbanismo': 0,
        'outros': 0
      };

      (rows as any[]).forEach((row: any) => {
        const department = row.department.toLowerCase();
        if (formattedResult.hasOwnProperty(department)) {
          formattedResult[department] = parseInt(row.count);
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
        'urbanismo': 0,
        'outros': 0
      };
    } finally {
      if (connection) {
        await connection.release();
      }
    }
  }

  private static async getTotalReviews(): Promise<number> {
    let connection;
    try {
      connection = await getConnection();
      const query = `SELECT COALESCE(SUM(reviews_count), 0) as total_reviews FROM digital_systems`;
      const [rows] = await connection.execute(query);
      return parseInt((rows as any[])[0].total_reviews);
    } catch (error) {
      console.error('Error getting total reviews:', error);
      return 0;
    } finally {
      if (connection) {
        await connection.release();
      }
    }
  }

  private static async getRatingDistribution(): Promise<{ rating: number; count: number }[]> {
    let connection;
    try {
      connection = await getConnection();
      
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

      const [rows] = await connection.execute(query);
      return (rows as any[]).map((row: any) => ({
        rating: parseInt(row.rating_group),
        count: parseInt(row.count)
      }));
    } catch (error) {
      console.error('Error getting rating distribution:', error);
      return [];
    } finally {
      if (connection) {
        await connection.release();
      }
    }
  }
}