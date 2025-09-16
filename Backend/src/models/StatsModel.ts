// src/models/StatsModel.ts
import pool from '../config/database';

export class StatsModel {
  // Obter estatísticas para o Dashboard
  static async getDashboardStats() {
    const totalSystemsQuery = `SELECT COUNT(*) as total FROM digital_systems`;
    const totalDownloadsQuery = `SELECT COALESCE(SUM(downloads), 0) as total_downloads FROM digital_systems`;
    const totalUsersQuery = `SELECT COALESCE(SUM(usage_count), 0) as total_users FROM digital_systems`;
    const avgRatingQuery = `SELECT AVG(rating) as avg_rating FROM digital_systems WHERE rating IS NOT NULL`;

    try {
      const [systemsResult, downloadsResult, usersResult, ratingResult] = await Promise.all([
        pool.query(totalSystemsQuery),
        pool.query(totalDownloadsQuery),
        pool.query(totalUsersQuery),
        pool.query(avgRatingQuery)
      ]);

      return {
        totalSystems: parseInt(systemsResult.rows[0].total),
        totalDownloads: parseInt(downloadsResult.rows[0].total_downloads),
        totalUsers: parseInt(usersResult.rows[0].total_users),
        averageRating: parseFloat(ratingResult.rows[0].avg_rating) || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  // Obter estatísticas por secretaria (para o Dashboard)
  static async getDepartmentStats() {
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
        COUNT(*) as system_count,
        COALESCE(SUM(downloads), 0) as total_downloads,
        COALESCE(SUM(usage_count), 0) as total_users,
        AVG(rating) as avg_rating
      FROM digital_systems
      GROUP BY department
      ORDER BY system_count DESC
    `;

    try {
      const result = await pool.query(query);
      return result.rows.map(row => ({
        department: row.department,
        systemCount: parseInt(row.system_count),
        totalDownloads: parseInt(row.total_downloads),
        totalUsers: parseInt(row.total_users),
        averageRating: parseFloat(row.avg_rating) || 0
      }));
    } catch (error) {
      console.error('Error fetching department stats:', error);
      throw new Error('Failed to fetch department statistics');
    }
  }

  // Obter sistemas mais populares (mais downloads)
  static async getPopularSystems(limit: number = 5) {
    const query = `
      SELECT id, name, downloads, icon_url
      FROM digital_systems 
      WHERE downloads IS NOT NULL 
      ORDER BY downloads DESC 
      LIMIT $1
    `;

    try {
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching popular systems:', error);
      throw new Error('Failed to fetch popular systems');
    }
  }

  // Obter sistemas melhor avaliados
  static async getTopRatedSystems(limit: number = 5) {
    const query = `
      SELECT id, name, rating, reviews_count, icon_url
      FROM digital_systems 
      WHERE rating IS NOT NULL 
      ORDER BY rating DESC, reviews_count DESC 
      LIMIT $1
    `;

    try {
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching top rated systems:', error);
      throw new Error('Failed to fetch top rated systems');
    }
  }
}