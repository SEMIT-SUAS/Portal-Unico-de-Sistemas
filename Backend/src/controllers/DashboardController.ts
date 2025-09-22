import { Request, Response } from 'express';
import { StatsModel } from '../models/StatsModel';
import { SystemModel } from '../models/SystemModel';
import pool from '../config/database'; // Importe o pool diretamente

export class DashboardController {
  // Obter estatísticas do dashboard
  static async getDashboardStats(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect(); // Use pool.connect() em vez de getConnection()
      const stats = await StatsModel.getDashboardStats();
      const departmentStats = await StatsModel.getDepartmentStats();
      
      // Obter contagem por departamento
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
    } finally {
      if (client) {
        client.release(); // Use release() em vez de connection.release()
      }
    }
  }

  // Métodos auxiliares atualizados para PostgreSQL
  private static async getSystemsByDepartmentCount(): Promise<Record<string, number>> {
    let client;
    try {
      client = await pool.connect();
      
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

      const result = await client.query(query);
      
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

      result.rows.forEach((row: any) => {
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
      if (client) {
        client.release();
      }
    }
  }

  private static async getTotalReviews(): Promise<number> {
    let client;
    try {
      client = await pool.connect();
      const query = `SELECT COALESCE(SUM(reviews_count), 0) as total_reviews FROM digital_systems`;
      const result = await client.query(query);
      return parseInt(result.rows[0].total_reviews);
    } catch (error) {
      console.error('Error getting total reviews:', error);
      return 0;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  private static async getRatingDistribution(): Promise<{ rating: number; count: number }[]> {
    let client;
    try {
      client = await pool.connect();
      
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

      const result = await client.query(query);
      return result.rows.map((row: any) => ({
        rating: parseInt(row.rating_group),
        count: parseInt(row.count)
      }));
    } catch (error) {
      console.error('Error getting rating distribution:', error);
      return [];
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  // Atualize também os outros métodos getDashboardCharts e getDashboardCards
  static async getDashboardCharts(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
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
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  static async getDashboardCards(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
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
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}