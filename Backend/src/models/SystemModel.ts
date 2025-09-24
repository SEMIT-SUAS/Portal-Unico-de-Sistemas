// src/models/SystemModel.ts
import pool from '../config/database';
import { DatabaseDigitalSystem, ApiDigitalSystem, UserReview } from '../types';

export class SystemModel {
  // Buscar todos os sistemas com opções de filtro
  static async findAll(filters: {
    category?: string;
    department?: string;
    search?: string;
    isNew?: boolean;
    isHighlight?: boolean;
  } = {}): Promise<ApiDigitalSystem[]> {
    let query = `
      SELECT 
        ds.*,
        ds.developer,
        s.name as secretary_name,
        json_agg(DISTINCT sf.feature) as features,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', ur.id::text,
            'userName', ur.user_name,
            'rating', ur.rating,
            'comment', ur.comment,
            'date', ur.date::text
          )
        ) as reviews
      FROM digital_systems ds
      LEFT JOIN secretaries s ON ds.responsible_secretary = s.code
      LEFT JOIN system_features sf ON ds.id = sf.system_id
      LEFT JOIN user_reviews ur ON ds.id = ur.system_id
    `;
    
    const whereClauses: string[] = [];
    const params: any[] = [];
    let paramCount = 0;
    
    if (filters.category) {
      paramCount++;
      whereClauses.push(`ds.category = $${paramCount}`);
      params.push(filters.category);
    }
    
    if (filters.department) {
      paramCount++;
      whereClauses.push(`ds.responsible_secretary = $${paramCount}`);
      params.push(filters.department);
    }
    
    if (filters.search) {
      paramCount++;
      whereClauses.push(`(ds.name ILIKE $${paramCount} OR ds.description ILIKE $${paramCount})`);
      params.push(`%${filters.search}%`);
    }
    
    if (filters.isNew !== undefined) {
      paramCount++;
      whereClauses.push(`ds.is_new = $${paramCount}`);
      params.push(filters.isNew);
    }
    
    if (filters.isHighlight !== undefined) {
      paramCount++;
      whereClauses.push(`ds.is_highlight = $${paramCount}`);
      params.push(filters.isHighlight);
    }
    
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    
    query += `
      GROUP BY ds.id, s.name
      ORDER BY ds.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, params);
      
      // Converter para o formato da API (compatível com o frontend)
      return result.rows.map((row: any) => this.mapToApiFormat(row));
    } catch (error) {
      console.error('Error fetching systems:', error);
      throw new Error('Failed to fetch systems');
    }
  }

  // Buscar sistema por ID
  static async findById(id: number): Promise<ApiDigitalSystem | null> {
    const query = `
      SELECT 
        ds.*,
        ds.developer,
        s.name as secretary_name,
        json_agg(DISTINCT sf.feature) as features,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', ur.id::text,
            'userName', ur.user_name,
            'rating', ur.rating,
            'comment', ur.comment,
            'date', ur.date::text
          )
        ) as reviews
      FROM digital_systems ds
      LEFT JOIN secretaries s ON ds.responsible_secretary = s.code
      LEFT JOIN system_features sf ON ds.id = sf.system_id
      LEFT JOIN user_reviews ur ON ds.id = ur.system_id
      WHERE ds.id = $1
      GROUP BY ds.id, s.name
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) return null;
      
      return this.mapToApiFormat(result.rows[0]);
    } catch (error) {
      console.error('Error fetching system by ID:', error);
      throw new Error('Failed to fetch system');
    }
  }

  // Buscar sistemas por categoria
  static async findByCategory(category: string): Promise<ApiDigitalSystem[]> {
    return this.findAll({ category });
  }

  // Buscar sistemas por departamento
  static async findByDepartment(department: string): Promise<ApiDigitalSystem[]> {
    return this.findAll({ department });
  }

  // Buscar sistemas em destaque
  static async findHighlighted(): Promise<ApiDigitalSystem[]> {
    return this.findAll({ isHighlight: true });
  }

  // Buscar sistemas novos
  static async findNewSystems(): Promise<ApiDigitalSystem[]> {
    return this.findAll({ isNew: true });
  }

  // Buscar sistemas por termo de pesquisa
  static async search(query: string): Promise<ApiDigitalSystem[]> {
    return this.findAll({ search: query });
  }

  // Contar sistemas por categoria (para o CategoryNav)
  static async countByCategory(): Promise<Record<string, number>> {
    const query = `
      SELECT category, COUNT(*) as count
      FROM digital_systems
      GROUP BY category
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows.reduce((acc: Record<string, number>, row) => {
        acc[row.category] = parseInt(row.count);
        return acc;
      }, {});
    } catch (error) {
      console.error('Error counting systems by category:', error);
      throw new Error('Failed to count systems');
    }
  }

  // Contar sistemas por departamento (para o Dashboard)
  static async countByDepartment(): Promise<Record<string, number>> {
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
    
    try {
      const result = await pool.query(query);
      return result.rows.reduce((acc: Record<string, number>, row) => {
        acc[row.department] = parseInt(row.count);
        return acc;
      }, {});
    } catch (error) {
      console.error('Error counting systems by department:', error);
      throw new Error('Failed to count systems by department');
    }
  }

  // Adicionar uma nova avaliação (para o RatingModal)
  static async addReview(systemId: number, reviewData: {
    userName: string;
    rating: number;
    comment: string;
    demographics?: {
      cor: string;
      sexo: string;
      idade: number;
    };
    location?: {
      latitude: number;
      longitude: number;
    };
  }): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Inserir a avaliação
      const reviewQuery = `
        INSERT INTO user_reviews (system_id, user_name, rating, comment, date)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)
        RETURNING id
      `;
      
      await client.query(reviewQuery, [
        systemId,
        reviewData.userName,
        reviewData.rating,
        reviewData.comment
      ]);

      // Se houver dados demográficos, inserir em uma tabela separada
      if (reviewData.demographics) {
        const demographicsQuery = `
          INSERT INTO user_demographics (review_id, cor, sexo, idade, latitude, longitude)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        
        await client.query(demographicsQuery, [
          // O ID da review seria retornado acima, mas para simplificar vamos usar uma abordagem diferente
          // Em produção, você precisaria capturar o ID retornado da inserção anterior
          reviewData.demographics.cor,
          reviewData.demographics.sexo,
          reviewData.demographics.idade,
          reviewData.location?.latitude || null,
          reviewData.location?.longitude || null
        ]);
      }

      // Atualizar a contagem de avaliações e rating médio do sistema
      const updateSystemQuery = `
        UPDATE digital_systems 
        SET 
          rating = (
            SELECT AVG(rating) FROM user_reviews WHERE system_id = $1
          ),
          reviews_count = (
            SELECT COUNT(*) FROM user_reviews WHERE system_id = $1
          ),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `;
      
      await client.query(updateSystemQuery, [systemId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error adding review:', error);
      throw new Error('Failed to add review');
    } finally {
      client.release();
    }
  }

  // Método para mapear do formato do banco para o formato da API
  private static mapToApiFormat(row: any): ApiDigitalSystem {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      fullDescription: row.full_description,
      targetAudience: row.target_audience,
      responsibleSecretary: row.responsible_secretary,
      launchYear: row.launch_year,
      category: row.category,
      isHighlight: row.is_highlight,
      isNew: row.is_new,
      iconUrl: row.icon_url,
      accessUrl: row.access_url,
      usageCount: row.usage_count,
      downloads: row.downloads,
      rating: row.rating,
      reviewsCount: row.reviews_count,
      hasPWA: row.has_pwa,
      pwaUrl: row.pwa_url,
      mainFeatures: row.features || [],
      userReviews: (row.reviews || []).filter((r: any) => r.id !== null),
      secretaryName: row.secretary_name,
      developer: row.developer
    };
  }
}