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
    recentlyAdded?: boolean;
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
        ) as reviews,
        -- ✅ CORREÇÃO: Calcular se é novo baseado APENAS na coluna is_new = true
        (ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days') as is_new_by_date,
        -- ✅ CORREÇÃO: Calcular dias desde criação apenas se is_new = true
        CASE 
          WHEN ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days' 
          THEN DATE_PART('day', CURRENT_DATE - ds.created_at) 
          ELSE NULL 
        END as days_since_creation
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
    
    // ✅ CORREÇÃO: Filtro por sistemas novos (APENAS is_new = true E menos de 60 dias)
    if (filters.recentlyAdded !== undefined) {
      whereClauses.push(`ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days'`);
    }
    
    // ✅ CORREÇÃO: Filtro isNew considera APENAS is_new = true
    if (filters.isNew !== undefined) {
      if (filters.isNew) {
        whereClauses.push(`ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days'`);
      } else {
        whereClauses.push(`(NOT ds.is_new OR ds.created_at < CURRENT_DATE - INTERVAL '60 days')`);
      }
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
        ) as reviews,
        -- ✅ CORREÇÃO: Calcular dias apenas se is_new = true E menos de 60 dias
        CASE 
          WHEN ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days'
          THEN EXTRACT(DAYS FROM (CURRENT_DATE - ds.created_at::DATE))
          ELSE NULL 
        END as days_since_creation,
        -- ✅ CORREÇÃO: Considerar APENAS is_new = true na verificação
        (ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days') as is_new_by_date
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

  // Buscar sistemas novos (APENAS is_new = true E menos de 60 dias)
  static async findNewSystems(): Promise<ApiDigitalSystem[]> {
    return this.findAll({ recentlyAdded: true });
  }

  // Buscar sistemas por termo de pesquisa
  static async search(query: string): Promise<ApiDigitalSystem[]> {
    return this.findAll({ search: query });
  }

  // Buscar sistemas recentes (últimos 60 dias E is_new = true)
  static async findRecentSystems(limit?: number): Promise<ApiDigitalSystem[]> {
    let query = `
      SELECT 
        ds.*,
        s.name as secretary_name,
        json_agg(DISTINCT sf.feature) as features,
        -- ✅ CORREÇÃO: Calcular dias apenas se is_new = true E menos de 60 dias
        CASE 
          WHEN ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days'
          THEN EXTRACT(DAYS FROM (CURRENT_DATE - ds.created_at::DATE))
          ELSE NULL 
        END as days_since_creation,
        -- ✅ CORREÇÃO: Considerar APENAS is_new = true na verificação
        (ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days') as is_new_by_date
      FROM digital_systems ds
      LEFT JOIN secretaries s ON ds.responsible_secretary = s.code
      LEFT JOIN system_features sf ON ds.id = sf.system_id
      -- ✅ CORREÇÃO: Filtro considerando APENAS is_new = true
      WHERE ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days'
      GROUP BY ds.id, s.name
      ORDER BY ds.created_at DESC
    `;
    
    if (limit) {
      query += ` LIMIT $1`;
    }
    
    try {
      const result = limit ? await pool.query(query, [limit]) : await pool.query(query);
      return result.rows.map((row: any) => this.mapToApiFormat(row));
    } catch (error) {
      console.error('Error fetching recent systems:', error);
      throw new Error('Failed to fetch recent systems');
    }
  }

  // MÉTODO FALTANTE: Criar sistema
  static async create(systemData: Omit<DatabaseDigitalSystem, 'id' | 'created_at' | 'updated_at'>): Promise<ApiDigitalSystem> {
    const query = `
      INSERT INTO digital_systems (
        name, description, full_description, target_audience,
        responsible_secretary, launch_year, category, is_highlight,
        is_new, icon_url, access_url, usage_count, downloads,
        rating, reviews_count, has_pwa, pwa_url, developer,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [
      systemData.name,
      systemData.description,
      systemData.full_description,
      systemData.target_audience,
      systemData.responsible_secretary,
      systemData.launch_year,
      systemData.category,
      systemData.is_highlight || false,
      true, // Sempre marcar como novo quando criar
      systemData.icon_url,
      systemData.access_url,
      systemData.usage_count || 0,
      systemData.downloads || 0,
      systemData.rating || 0,
      systemData.reviews_count || 0,
      systemData.has_pwa || false,
      systemData.pwa_url,
      systemData.developer
    ];
    
    try {
      const result = await pool.query(query, values);
      return this.mapToApiFormat(result.rows[0]);
    } catch (error) {
      console.error('Error creating system:', error);
      throw new Error('Failed to create system');
    }
  }

  // MÉTODO FALTANTE: Atualizar sistema
  static async update(id: number, systemData: Partial<DatabaseDigitalSystem>): Promise<ApiDigitalSystem> {
    const fields = [];
    const values = [];
    let paramCount = 0;

    // Construir dinamicamente os campos a serem atualizados
    Object.entries(systemData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    });

    // Sempre atualizar updated_at
    paramCount++;
    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    values.push(id);

    const query = `
      UPDATE digital_systems 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount + 1}
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('System not found');
      }
      return this.mapToApiFormat(result.rows[0]);
    } catch (error) {
      console.error('Error updating system:', error);
      throw new Error('Failed to update system');
    }
  }

  // ✅ NOVO MÉTODO: Atualizar sistemas existentes para is_new = false
  static async markExistingSystemsAsNotNew(): Promise<void> {
    const query = `
      UPDATE digital_systems 
      SET is_new = false, updated_at = NOW()
      WHERE is_new = true
    `;
    
    try {
      const result = await pool.query(query);
      console.log(`🔄 Sistemos existentes atualizados: ${result.rowCount} sistemas marcados como não novos`);
    } catch (error) {
      console.error('Error updating existing systems:', error);
      throw new Error('Failed to update existing systems');
    }
  }

  // MÉTODO FALTANTE: Deletar sistema
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM digital_systems WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error('Error deleting system:', error);
      throw new Error('Failed to delete system');
    }
  }

  // ✅ MÉTODO ATUALIZADO: Atualizar estatísticas de uso (ACESSOS)
  static async incrementUsage(systemId: number): Promise<void> {
    const query = `
      UPDATE digital_systems 
      SET usage_count = usage_count + 1, updated_at = NOW()
      WHERE id = $1
    `;
    
    try {
      await pool.query(query, [systemId]);
      console.log(`📈 Acesso incrementado no banco para sistema ID: ${systemId}`);
    } catch (error) {
      console.error('Error incrementing usage:', error);
      throw new Error('Failed to increment usage');
    }
  }

  // ✅ MÉTODO ATUALIZADO: Atualizar contador de downloads NO BANCO
  static async incrementDownloads(systemId: number): Promise<void> {
    const query = `
      UPDATE digital_systems 
      SET downloads = downloads + 1, updated_at = NOW()
      WHERE id = $1
    `;
    
    try {
      await pool.query(query, [systemId]);
      console.log(`📊 Download incrementado no banco para sistema ID: ${systemId}`);
    } catch (error) {
      console.error('Error incrementing downloads:', error);
      throw new Error('Failed to increment downloads');
    }
  }

  // ✅ MÉTODO ATUALIZADO: Atualizar automaticamente sistemas que passaram do período de novidade
  static async updateNewStatus(): Promise<void> {
    const query = `
      UPDATE digital_systems 
      SET is_new = false, updated_at = NOW()
      WHERE is_new = true 
      AND created_at < CURRENT_DATE - INTERVAL '60 days'
    `;
    
    try {
      const result = await pool.query(query);
      console.log(`🔄 Sistemas atualizados: ${result.rowCount} sistemas saíram do status "novo"`);
    } catch (error) {
      console.error('Error updating new status:', error);
      throw new Error('Failed to update new status');
    }
  }

  // Contar sistemas por categoria
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

  // Contar sistemas por departamento
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

  // Adicionar uma nova avaliação
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
  }): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Inserir a avaliação
      const reviewQuery = `
        INSERT INTO user_reviews (system_id, user_name, rating, comment, date)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)
        RETURNING id
      `;
      
      const reviewResult = await client.query(reviewQuery, [
        systemId,
        reviewData.userName,
        reviewData.rating,
        reviewData.comment
      ]);

      const reviewId = reviewResult.rows[0].id;

      // Se houver dados demográficos, inserir em uma tabela separada
      if (reviewData.demographics) {
        const demographicsQuery = `
          INSERT INTO user_demographics (review_id, cor, sexo, idade, latitude, longitude)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        
        await client.query(demographicsQuery, [
          reviewId,
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
          updated_at = NOW()
        WHERE id = $1
      `;
      
      await client.query(updateSystemQuery, [systemId]);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error adding review:', error);
      throw new Error('Failed to add review');
    } finally {
      client.release();
    }
  }

  // ✅ MÉTODO CORRIGIDO: Mapear do formato do banco para o formato da API
  private static mapToApiFormat(row: any): ApiDigitalSystem {
    const isNewByDate = row.is_new_by_date;
    const daysSinceCreation = row.days_since_creation;

    // ✅ DEBUG: Log para verificar os valores do banco
    console.log('🔍 DEBUG SystemModel - Valores do banco:', {
      id: row.id,
      name: row.name,
      is_new: row.is_new,
      is_new_by_date: isNewByDate,
      days_since_creation: daysSinceCreation,
      created_at: row.created_at,
      usage_count: row.usage_count,
      downloads: row.downloads,
      usage_count_type: typeof row.usage_count
    });

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
      // ✅ CORREÇÃO DEFINITIVA: Considerar APENAS se is_new = true E menos de 60 dias
      isNew: Boolean(row.is_new && isNewByDate),
      iconUrl: row.icon_url,
      accessUrl: row.access_url,
      // ✅ CORRIGIDO: Mapear usage_count para usageCount
      usageCount: Number(row.usage_count) || 0,
      downloads: row.downloads,
      rating: row.rating,
      reviewsCount: row.reviews_count,
      hasPWA: row.has_pwa,
      pwaUrl: row.pwa_url,
      mainFeatures: row.features || [],
      userReviews: (row.reviews || []).filter((r: any) => r.id !== null),
      secretaryName: row.secretary_name,
      developer: row.developer,
      // Novos campos para a funcionalidade de tag NOVO
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      daysSinceCreation: daysSinceCreation,
      isNewByDate: isNewByDate,
      // ✅ CORREÇÃO: Calcular dias restantes apenas se for novo (is_new = true E menos de 60 dias)
      daysRemaining: (row.is_new && isNewByDate) ? Math.max(0, 60 - (daysSinceCreation || 0)) : 0
    };
  }
}