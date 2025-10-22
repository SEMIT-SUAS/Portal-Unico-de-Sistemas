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
        -- ✅ CONTAGEM PARA SISTEMAS NOVOS: Apenas para is_new = true
        CASE 
          WHEN ds.is_new THEN DATE_PART('day', CURRENT_DATE - ds.created_at) 
          ELSE 61  -- Sistemas antigos sempre têm 61+ dias
        END as days_since_creation,
        -- ✅ VERIFICAÇÃO DE NOVIDADE: Apenas is_new = true e menos de 60 dias
        (ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days') as is_new_by_date
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
    
    // ✅ FILTRO NOVOS: Apenas is_new = true E menos de 60 dias
    if (filters.recentlyAdded !== undefined) {
      whereClauses.push(`ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days'`);
    }
    
    // ✅ FILTRO isNew: Considera is_new = true E menos de 60 dias
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
  const client = await pool.connect();
  
  try {
    console.log('🔍 [MODEL] Buscando sistema por ID:', id);
    
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
        -- ✅ CONTAGEM PARA SISTEMAS NOVOS: Apenas para is_new = true
        CASE 
          WHEN ds.is_new THEN EXTRACT(DAYS FROM (CURRENT_DATE - ds.created_at::DATE))
          ELSE 61  -- Sistemas antigos sempre têm 61+ dias
        END as days_since_creation,
        -- ✅ VERIFICAÇÃO DE NOVIDADE: Apenas is_new = true e menos de 60 dias
        (ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days') as is_new_by_date
      FROM digital_systems ds
      LEFT JOIN secretaries s ON ds.responsible_secretary = s.code
      LEFT JOIN system_features sf ON ds.id = sf.system_id
      LEFT JOIN user_reviews ur ON ds.id = ur.system_id
      WHERE ds.id = $1
      GROUP BY ds.id, s.name
    `;
    
    console.log('📝 [MODEL] Executando query para sistema ID:', id);
    
    const result = await client.query(query, [id]);
    
    console.log('📊 [MODEL] Resultado da query:', {
      rowsCount: result.rows.length,
      systemId: id
    });
    
    if (result.rows.length === 0) {
      console.log('⚠️ [MODEL] Sistema não encontrado:', id);
      return null;
    }
    
    const system = this.mapToApiFormat(result.rows[0]);
    console.log('✅ [MODEL] Sistema encontrado e mapeado:', {
      id: system.id,
      name: system.name,
      reviewsCount: system.reviewsCount,
      rating: system.rating
    });
    
    return system;
  } catch (error) {
    console.error('❌ [MODEL] Erro ao buscar sistema por ID:', error);
    console.error('❌ [MODEL] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to fetch system: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  } finally {
    client.release();
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

  // ✅ BUSCAR SISTEMAS NOVOS: Apenas is_new = true E menos de 60 dias
  static async findNewSystems(): Promise<ApiDigitalSystem[]> {
    return this.findAll({ recentlyAdded: true });
  }

  // Buscar sistemas por termo de pesquisa
  static async search(query: string): Promise<ApiDigitalSystem[]> {
    return this.findAll({ search: query });
  }

  // ✅ BUSCAR SISTEMAS RECENTES: Apenas is_new = true E menos de 60 dias
  static async findRecentSystems(limit?: number): Promise<ApiDigitalSystem[]> {
    let query = `
      SELECT 
        ds.*,
        s.name as secretary_name,
        json_agg(DISTINCT sf.feature) as features,
        -- ✅ CONTAGEM PARA SISTEMAS NOVOS: Apenas para is_new = true
        CASE 
          WHEN ds.is_new THEN EXTRACT(DAYS FROM (CURRENT_DATE - ds.created_at::DATE))
          ELSE 61  -- Sistemas antigos sempre têm 61+ dias
        END as days_since_creation,
        -- ✅ VERIFICAÇÃO DE NOVIDADE: Apenas is_new = true e menos de 60 dias
        (ds.is_new AND ds.created_at >= CURRENT_DATE - INTERVAL '60 days') as is_new_by_date
      FROM digital_systems ds
      LEFT JOIN secretaries s ON ds.responsible_secretary = s.code
      LEFT JOIN system_features sf ON ds.id = sf.system_id
      -- ✅ FILTRO: Apenas sistemas novos (is_new = true) e com menos de 60 dias
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

  // ✅ MÉTODO ATUALIZADO: Marcar sistemas existentes como não novos
  static async markExistingSystemsAsNotNew(): Promise<void> {
    const query = `
      UPDATE digital_systems 
      SET is_new = false, updated_at = NOW()
      WHERE is_new = true
    `;
    
    try {
      const result = await pool.query(query);
      console.log(`🔄 Sistemas existentes atualizados: ${result.rowCount} sistemas marcados como não novos`);
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
      
      // ✅ CORREÇÃO: Adicionar tipos explicitamente
      return result.rows.reduce((acc: Record<string, number>, row: any) => {
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
          WHEN responsible_secretary = 'SEMUS' THEN 'saude'
          WHEN responsible_secretary = 'SEMED' THEN 'educacao'
          WHEN responsible_secretary = 'SEMAS' THEN 'assistencia-social'
          WHEN responsible_secretary = 'SEMAPA' THEN 'meio-ambiente'
          WHEN responsible_secretary = 'SEMFAZ' THEN 'fazenda-financas'
          WHEN responsible_secretary = 'SEPLAN' THEN 'planejamento'
          WHEN responsible_secretary = 'SEMIT' THEN 'tecnologia'
          WHEN responsible_secretary = 'SEMTT' THEN 'transito-transporte'
          WHEN responsible_secretary = 'SECULT' THEN 'cultura'
          WHEN responsible_secretary = 'SEMURH' THEN 'urbanismo'
          WHEN responsible_secretary = 'SETUR' THEN 'turismo'
          WHEN responsible_secretary = 'SECOM' THEN 'comunicacao'
          WHEN responsible_secretary = 'SEMUSC' THEN 'seguranca'
          ELSE 'outros'
        END as department,
        COUNT(*) as count
      FROM digital_systems
      GROUP BY department
    `;
    
    try {
      const result = await pool.query(query);
      
      return result.rows.reduce((acc: Record<string, number>, row: any) => {
        acc[row.department] = parseInt(row.count);
        return acc;
      }, {});
    } catch (error) {
      console.error('Error counting systems by department:', error);
      throw new Error('Failed to count systems by department');
    }
  }


  // ✅✅✅ CORREÇÃO CRÍTICA: Adicionar uma nova avaliação - COM ATUALIZAÇÃO DE RATING E CONTAGEM
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
      console.log('💽 [MODEL] Iniciando transação para avaliação do sistema:', systemId);
      console.log('📝 [MODEL] Dados da avaliação:', JSON.stringify(reviewData, null, 2));
      
      await client.query('BEGIN');

      // 1. Primeiro, verificar se o sistema existe
      const systemCheck = await client.query(
        'SELECT id, name, reviews_count, rating FROM digital_systems WHERE id = $1',
        [systemId]
      );
      
      if (systemCheck.rows.length === 0) {
        throw new Error(`Sistema com ID ${systemId} não encontrado`);
      }

      console.log('✅ [MODEL] Sistema encontrado:', systemCheck.rows[0]);

      // 2. Inserir a avaliação na tabela user_reviews
      const reviewQuery = `
        INSERT INTO user_reviews (system_id, user_name, rating, comment, date)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)
        RETURNING id
      `;
      
      console.log('📝 [MODEL] Executando query de review...');
      
      const reviewResult = await client.query(reviewQuery, [
        systemId,
        reviewData.userName,
        reviewData.rating,
        reviewData.comment || ''
      ]);

      const reviewId = reviewResult.rows[0].id;
      console.log('✅ [MODEL] Review inserido com ID:', reviewId);

      // 3. Se houver dados demográficos, inserir na tabela user_demographics
      if (reviewData.demographics) {
        try {
          const tableCheck = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'user_demographics'
            );
          `);

          if (tableCheck.rows[0].exists) {
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
            console.log('✅ [MODEL] Dados demográficos inseridos');
          } else {
            console.log('⚠️ [MODEL] Tabela user_demographics não existe, pulando...');
          }
        } catch (demographicsError) {
          console.log('⚠️ [MODEL] Erro ao inserir dados demográficos, continuando...', demographicsError);
        }
      }

      // 4. ✅✅✅ CORREÇÃO CRÍTICA: Atualizar rating e reviews_count de forma mais robusta
      const updateSystemQuery = `
        WITH review_stats AS (
          SELECT 
            COUNT(*) as total_reviews,
            AVG(rating::numeric) as avg_rating
          FROM user_reviews 
          WHERE system_id = $1
        )
        UPDATE digital_systems 
        SET 
          rating = COALESCE((SELECT avg_rating FROM review_stats), 0),
          reviews_count = COALESCE((SELECT total_reviews FROM review_stats), 0),
          updated_at = NOW()
        WHERE id = $1
        RETURNING rating, reviews_count
      `;
      
      const updateResult = await client.query(updateSystemQuery, [systemId]);
      const updatedStats = updateResult.rows[0];
      
      console.log('✅ [MODEL] Sistema atualizado com novas estatísticas:', {
        newRating: updatedStats.rating,
        newReviewsCount: updatedStats.reviews_count,
        systemId: systemId
      });

      await client.query('COMMIT');
      console.log('💾 [MODEL] Transação concluída com sucesso');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ [MODEL] Erro na transação:', error);
      throw new Error(`Failed to add review: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      client.release();
    }
  }

  // ✅✅✅ CORREÇÃO CRÍTICA: Mapear do formato do banco para o formato da API
  private static mapToApiFormat(row: any): ApiDigitalSystem {
    const isNewByDate = row.is_new_by_date;
    const daysSinceCreation = row.days_since_creation;

    // ✅ DEBUG ESPECÍFICO PARA RATING E REVIEWS
    console.log('🔍 DEBUG SystemModel - RATING & REVIEWS INFO:', {
      id: row.id,
      name: row.name,
      rating: row.rating,
      rating_type: typeof row.rating,
      reviews_count: row.reviews_count,
      user_reviews_length: row.reviews?.length || 0,
      reviews_ratings: row.reviews?.map((r: any) => r.rating) || []
    });

    // ✅ CORREÇÃO: Mapear as reviews corretamente
    const userReviews = (row.reviews || [])
      .filter((r: any) => r.id !== null && r.id !== undefined)
      .map((review: any) => ({
        id: review.id,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        date: review.date
      }));

    // ✅ CORREÇÃO CRÍTICA: Calcular rating correto
    const calculateCorrectRating = (): number => {
      // Se temos rating do banco e é válido, usar ele
      const dbRating = parseFloat(row.rating);
      if (!isNaN(dbRating) && dbRating > 0) {
        console.log('📊 Usando rating do banco:', dbRating);
        return dbRating;
      }
      
      // Se não, calcular a partir das reviews
      if (userReviews.length > 0) {
        // ✅ CORREÇÃO: Adicionar tipos explicitamente para sum e review
        const avgRating = userReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / userReviews.length;
        const calculatedRating = parseFloat(avgRating.toFixed(1));
        console.log('📊 Calculando rating das reviews:', calculatedRating);
        return calculatedRating;
      }
      
      console.log('📊 Rating padrão: 0');
      return 0;
    };

    const finalRating = calculateCorrectRating();

    // ✅ CORREÇÃO CRÍTICA: Garantir que reviewsCount use o valor CORRETO do banco
    const reviewsCountFromDb = Number(row.reviews_count) || 0;
    const reviewsCountFromArray = userReviews.length;
    const finalReviewsCount = Math.max(reviewsCountFromDb, reviewsCountFromArray);

    console.log('📊 DEBUG SystemModel - RATING & COUNT FINAL:', {
      ratingFromDb: row.rating,
      ratingCalculated: finalRating,
      reviewsCountFromDb: reviewsCountFromDb,
      reviewsCountFromArray: reviewsCountFromArray,
      finalReviewsCount: finalReviewsCount
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
      isNew: Boolean(row.is_new && isNewByDate),
      iconUrl: row.icon_url,
      accessUrl: row.access_url,
      usageCount: Number(row.usage_count) || 0,
      downloads: row.downloads,
      // ✅ CORREÇÃO APLICADA: Usar o rating calculado corretamente
      rating: finalRating,
      // ✅ CORREÇÃO APLICADA: Usar a contagem correta
      reviewsCount: finalReviewsCount,
      hasPWA: row.has_pwa,
      pwaUrl: row.pwa_url,
      mainFeatures: row.features || [],
      userReviews: userReviews,
      secretaryName: row.secretary_name,
      developer: row.developer,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      daysSinceCreation: daysSinceCreation,
      isNewByDate: isNewByDate,
      daysRemaining: (row.is_new && isNewByDate) ? Math.max(0, 60 - (daysSinceCreation || 0)) : 0
    };
  }
}