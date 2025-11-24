// src/controllers/DashboardController.ts
import { Request, Response } from 'express';
import { StatsModel } from '../models/StatsModel';
import pool from '../config/database';

// ✅ MAPEAMENTO CORRETO E COMPLETO DOS DEPARTAMENTOS
const departmentMap: Record<string, string[]> = {
  'saude': ['SEMUS'], // Apenas SEMUS - NÃO inclui SEMUSC
  'educacao': ['SEMED'],
  'assistencia-social': ['SEMCAS'],
  'meio-ambiente': ['SEMMAM'], // Apenas SEMMAM - NÃO inclui SEMAPA
  'agricultura-pesca-abastecimento': ['SEMAPA'], // ✅ NOVO: Departamento específico para SEMAPA
  'fazenda-financas': ['SEMFAZ'],
  'planejamento': ['SEPLAN'],
  'tecnologia': ['SEMIT'],
  'transito-transporte': ['SMTT'],
  'cultura': ['SECULT'],
  'urbanismo': ['SEMURH'],
  'comunicacao': ['SECOM'],
  'turismo': ['SETUR'],
  'seguranca': ['SEMUSC'], // Apenas SEMUSC - NÃO inclui SEMUS
  'administracao': ['SEMAD'], // ✅ NOVO
  'inovacao-sustentabilidade': ['SEMISPE'], // ✅ NOVO
  'pessoa-com-deficiencia': ['SEMEPED'], // ✅ NOVO
  'patrimonio-historico': ['FUMPH'], // ✅ NOVO
  'procuradoria': ['PGM'], // ✅ NOVO
  'defesa-civil': ['DC'] // ✅ NOVO
};

// Função auxiliar
function getDepartmentSecretaries(department: string): string[] {
  return departmentMap[department] || [];
}

// Função para estatísticas específicas do departamento
async function getDepartmentSpecificStats(department: string): Promise<any> {
  let client;
  try {
    client = await pool.connect();
    
    const secretaries = getDepartmentSecretaries(department);
    if (secretaries.length === 0) return null;

    // ✅ USANDO IGUALDADE EXATA para evitar sobreposições
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
      totalSystems: parseInt(row.total_systems) || 0,
      totalDownloads: parseInt(row.total_downloads) || 0,
      totalUsers: parseInt(row.total_users) || 0,
      averageRating: parseFloat(row.average_rating) || 0,
      totalReviews: parseInt(row.total_reviews) || 0
    };
  } catch (error) {
    console.error('Error fetching department specific stats:', error);
    return null;
  } finally {
    if (client) client.release();
  }
}

// Controller principal
export const DashboardController = {
  // Obter as 5 métricas principais
  async getDashboardStats(req: Request, res: Response) {
    const { department } = req.query;
    let client;

    try {
      client = await pool.connect();
      
      // Buscar estatísticas gerais
      const generalStats = await StatsModel.getDashboardStats();
      
      // Se houver filtro por departamento, calcular estatísticas específicas
      let departmentStats = null;
      if (department && typeof department === 'string') {
        departmentStats = await getDepartmentSpecificStats(department);
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
  },

  // MÉTODO PARA FILTERED-COUNTS
  async getFilteredCategoryCounts(req: Request, res: Response) {
    const { department } = req.query;
    let client;

    try {
      client = await pool.connect();

      if (!department || typeof department !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Parâmetro department é obrigatório'
        });
      }

      const secretaries = getDepartmentSecretaries(department);
      if (secretaries.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Departamento não encontrado'
        });
      }

      // ✅ USANDO IGUALDADE EXATA aqui também
      const conditions = secretaries.map((secretary, index) => 
        `responsible_secretary = $${index + 1}`
      ).join(' OR ');

      const query = `
        SELECT 
          category,
          COUNT(*) as count
        FROM digital_systems
        WHERE ${conditions}
        GROUP BY category
        ORDER BY count DESC
      `;

      const result = await client.query(query, secretaries);
      
      const categoryCounts = result.rows.map(row => ({
        category: row.category,
        count: parseInt(row.count) || 0
      }));

      res.json({
        success: true,
        data: categoryCounts
      });

    } catch (error) {
      console.error('Error fetching filtered category counts:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao carregar contagens por categoria',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }
};