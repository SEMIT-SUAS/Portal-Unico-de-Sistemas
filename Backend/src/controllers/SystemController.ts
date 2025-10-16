// src/controllers/SystemController.ts
import { Request, Response } from 'express';
import { SystemModel } from '../models/SystemModel';
import pool from '../config/database';

export class SystemController {
  // ✅ ATUALIZADO: Obter todos os sistemas com mesma lógica para Destaques e Novidades
  static async getAllSystems(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const { 
        category, 
        department, 
        search, 
        isNew, 
        isHighlight,
        recentlyAdded
      } = req.query;
      
      const filters = {
        category: category as string,
        department: department as string,
        search: search as string,
        isNew: isNew ? isNew === 'true' : undefined,
        isHighlight: isHighlight ? isHighlight === 'true' : undefined,
        recentlyAdded: recentlyAdded ? recentlyAdded === 'true' : undefined
      };

      const systems = await SystemModel.findAll(filters);
      
      // ✅ MESMA LÓGICA PARA DESTAQUES E NOVIDADES
      const featuredSystems = systems.filter(system => system.isHighlight);
      const newSystems = systems.filter(system => system.isNew);
      
      res.json({
        success: true,
        data: systems,
        count: systems.length,
        featuredCount: featuredSystems.length,
        newCount: newSystems.length,
        filters
      });
    } catch (error) {
      console.error('Error fetching systems:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar sistemas',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // ✅ ATUALIZADO: Obter sistemas em destaque
  static async getHighlightedSystems(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const systems = await SystemModel.findHighlighted();
      
      res.json({
        success: true,
        data: systems,
        count: systems.length
      });
    } catch (error) {
      console.error('Error fetching highlighted systems:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar sistemas em destaque',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // ✅ ATUALIZADO: Obter sistemas novos (MESMA LÓGICA DOS DESTAQUES)
  static async getNewSystems(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const systems = await SystemModel.findNewSystems();
      
      res.json({
        success: true,
        data: systems,
        count: systems.length
      });
    } catch (error) {
      console.error('Error fetching new systems:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar sistemas novos',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // NOVA ROTA: Obter sistemas recentes (MANTIDO)
  static async getRecentSystems(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const { limit } = req.query;
      
      const systems = await SystemModel.findRecentSystems(
        limit ? parseInt(limit as string) : undefined
      );
      
      res.json({
        success: true,
        data: systems,
        count: systems.length,
        limit: limit ? parseInt(limit as string) : 'default'
      });
    } catch (error) {
      console.error('Error fetching recent systems:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar sistemas recentes',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // Obter sistema por ID (MANTIDO)
  static async getSystemById(req: Request, res: Response) {
  let client;
  try {
    console.log('🎯 [CONTROLLER] getSystemById CHAMADO!');
    console.log('🎯 [CONTROLLER] Params:', req.params);
    
    client = await pool.connect();
    const id = parseInt(req.params.id);
    
    console.log('🔍 [CONTROLLER] Buscando sistema ID:', id);
    
    if (isNaN(id)) {
      console.log('❌ [CONTROLLER] ID inválido:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    console.log('💾 [CONTROLLER] Chamando SystemModel.findById...');
    const system = await SystemModel.findById(id);
    
    if (!system) {
      console.log('❌ [CONTROLLER] Sistema não encontrado:', id);
      return res.status(404).json({
        success: false,
        message: 'Sistema não encontrado'
      });
    }

    console.log('✅ [CONTROLLER] Sistema encontrado:', {
      id: system.id,
      name: system.name,
      reviewsCount: system.reviewsCount,
      rating: system.rating
    });

    res.json({
      success: true,
      data: system
    });
  } catch (error) {
    console.error('❌ [CONTROLLER] Erro ao buscar sistema:', error);
    console.error('❌ [CONTROLLER] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    res.status(500).json({
      success: false,
      message: 'Erro interno ao buscar sistema',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  } finally {
    if (client) client.release();
  }
}

  // Obter sistemas por categoria (MANTIDO)
  static async getSystemsByCategory(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const { category } = req.params;
      const systems = await SystemModel.findByCategory(category);
      
      res.json({
        success: true,
        data: systems,
        count: systems.length,
        category
      });
    } catch (error) {
      console.error('Error fetching systems by category:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar sistemas por categoria',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // Obter sistemas por departamento (MANTIDO)
  static async getSystemsByDepartment(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const { department } = req.params;
      const systems = await SystemModel.findByDepartment(department);
      
      res.json({
        success: true,
        data: systems,
        count: systems.length,
        department
      });
    } catch (error) {
      console.error('Error fetching systems by department:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar sistemas por departamento',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // Buscar sistemas (MANTIDO)
  static async searchSystems(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Query de busca é obrigatória'
        });
      }

      const systems = await SystemModel.search(query);
      
      res.json({
        success: true,
        data: systems,
        count: systems.length,
        query
      });
    } catch (error) {
      console.error('Error searching systems:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar sistemas',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // ✅✅✅ CORRIGIDO: Adicionar avaliação - COM LOGS DETALHADOS
  static async addReview(req: Request, res: Response) {
  let client;
  try {
    console.log('🎯 [CONTROLLER] addReview CHAMADO!');
    console.log('🎯 [CONTROLLER] URL:', req.url);
    console.log('🎯 [CONTROLLER] Method:', req.method);
    console.log('🎯 [CONTROLLER] Params:', req.params);
    console.log('🎯 [CONTROLLER] Body:', JSON.stringify(req.body, null, 2));
    
    client = await pool.connect();
    const id = parseInt(req.params.id);
    
    console.log('📥 [CONTROLLER] Recebendo avaliação para sistema ID:', id);
    
    if (isNaN(id)) {
      console.log('❌ [CONTROLLER] ID inválido:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const { userName, rating, comment, demographics, location } = req.body;

    console.log('👤 [CONTROLLER] Dados extraídos:', {
      userName,
      rating,
      comment,
      demographics,
      location
    });

    // Validações mais robustas
    if (!userName || userName.trim() === '') {
      console.log('❌ [CONTROLLER] Nome de usuário vazio');
      return res.status(400).json({
        success: false,
        message: 'Nome de usuário é obrigatório'
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      console.log('❌ [CONTROLLER] Rating inválido:', rating);
      return res.status(400).json({
        success: false,
        message: 'A avaliação deve ser entre 1 e 5'
      });
    }

    console.log('💾 [CONTROLLER] Chamando SystemModel.addReview...');
    
    // ✅ CORREÇÃO: Aguardar a conclusão e capturar possíveis erros
    const result = await SystemModel.addReview(id, {
      userName: userName.trim(),
      rating: Number(rating),
      comment: (comment || '').trim(),
      demographics,
      location
    });

    console.log('✅ [CONTROLLER] Avaliação processada com sucesso, resultado:', result);

    // ✅ BUSCAR SISTEMA ATUALIZADO PARA RETORNAR DADOS CORRETOS
    console.log('🔄 [CONTROLLER] Buscando sistema atualizado...');
    const updatedSystem = await SystemModel.findById(id);
    
    if (!updatedSystem) {
      console.log('⚠️ [CONTROLLER] Sistema não encontrado após atualização');
    }

    console.log('✅ [CONTROLLER] Resposta enviada com sucesso');
    
    res.json({
      success: true,
      message: 'Avaliação adicionada com sucesso',
      system: updatedSystem // ✅ RETORNAR SISTEMA ATUALIZADO
    });
  } catch (error) {
    console.error('❌ [CONTROLLER] Erro ao adicionar avaliação:', error);
    console.error('❌ [CONTROLLER] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    res.status(500).json({
      success: false,
      message: 'Erro interno ao adicionar avaliação',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  } finally {
    if (client) client.release();
  }
}

  // ✅ MÉTODO INCREMENT DOWNLOADS (MANTIDO)
  static async incrementDownloads(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }

      // Verificar se o sistema existe
      const system = await SystemModel.findById(id);
      if (!system) {
        return res.status(404).json({
          success: false,
          message: 'Sistema não encontrado'
        });
      }

      // Incrementar contador de downloads NO BANCO
      await SystemModel.incrementDownloads(id);

      // Buscar sistema atualizado para retornar o novo count REAL
      const updatedSystem = await SystemModel.findById(id);

      console.log(`📥 Download REAL contabilizado para sistema ${system.name} (ID: ${id})`);
      console.log(`📊 De ${system.downloads || 0} para ${updatedSystem?.downloads || 0} downloads`);

      res.json({
        success: true,
        message: 'Download contabilizado com sucesso',
        newCount: updatedSystem?.downloads || 0, // ✅ COUNT REAL DO BANCO
        systemName: system.name
      });
    } catch (error) {
      console.error('Error incrementing downloads:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao contabilizar download',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // ✅ MÉTODO ATUALIZADO: INCREMENTAR ACESSOS (MANTIDO)
  static async incrementAccess(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }

      // Verificar se o sistema existe
      const system = await SystemModel.findById(id);
      if (!system) {
        return res.status(404).json({
          success: false,
          message: 'Sistema não encontrado'
        });
      }

      // ✅ DEBUG: Log antes do incremento
      console.log('🔍 DEBUG - Antes do incremento:', {
        systemId: id,
        currentUsageCount: system.usageCount,
        currentDownloads: system.downloads
      });

      // Incrementar contador de acessos NO BANCO
      await SystemModel.incrementUsage(id);

      // Buscar sistema atualizado para retornar o novo count REAL
      const updatedSystem = await SystemModel.findById(id);
      
      // ✅ GARANTIR que seja número
      const newCount = Number(updatedSystem?.usageCount) || 0;

      console.log(`🚀 Acesso REAL contabilizado para sistema ${system.name} (ID: ${id})`);
      console.log(`📈 De ${system.usageCount || 0} para ${updatedSystem?.usageCount || 0} acessos`);

      res.json({
        success: true,
        message: 'Acesso contabilizado com sucesso',
        newCount: newCount,
        systemName: system.name,
        ststemId: id,
        previousCounte: system.usageCount || 0
      });
    } catch (error) {
      console.error('Error incrementing access:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao contabilizar acesso',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // ✅ MÉTODO DE TESTE TEMPORÁRIO
  static async testReview(req: Request, res: Response) {
    try {
      console.log('🧪 [TEST] Endpoint de teste chamado');
      console.log('📋 [TEST] Body recebido:', req.body);
      console.log('🔍 [TEST] Params recebidos:', req.params);
      
      res.json({
        success: true,
        message: 'Teste funcionando',
        received: {
          body: req.body,
          params: req.params
        }
      });
    } catch (error) {
      console.error('❌ [TEST] Erro no teste:', error);
      res.status(500).json({
        success: false,
        message: 'Erro no teste'
      });
    }
  }

  // ✅ MÉTODO SIMPLIFICADO TEMPORÁRIO
  static async simpleReview(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const id = parseInt(req.params.id);
      
      console.log('🧪 [SIMPLE] Sistema ID:', id);
      console.log('🧪 [SIMPLE] Dados:', req.body);

      // Inserir diretamente sem transação complexa
      const query = `
        INSERT INTO user_reviews (system_id, user_name, rating, comment, date)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)
        RETURNING id
      `;
      
      const result = await client.query(query, [
        id,
        req.body.userName,
        req.body.rating,
        req.body.comment || ''
      ]);

      console.log('✅ [SIMPLE] Review inserido com ID:', result.rows[0].id);

      res.json({
        success: true,
        message: 'Avaliação simples adicionada',
        reviewId: result.rows[0].id
      });
    } catch (error) {
      console.error('❌ [SIMPLE] Erro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro na avaliação simples',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // ✅ NOVO MÉTODO: Debug de reviews
  static async debugReviews(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const systemId = parseInt(req.params.id);
      
      const reviewStats = await client.query(`
        SELECT 
          ds.id,
          ds.name,
          ds.reviews_count as db_reviews_count,
          COUNT(ur.id) as actual_reviews_count,
          ds.rating as db_rating,
          AVG(ur.rating)::numeric(10,2) as actual_rating
        FROM digital_systems ds
        LEFT JOIN user_reviews ur ON ds.id = ur.system_id
        WHERE ds.id = $1
        GROUP BY ds.id, ds.name, ds.reviews_count, ds.rating
      `, [systemId]);

      const reviews = await client.query(`
        SELECT id, user_name, rating, comment, date
        FROM user_reviews 
        WHERE system_id = $1
        ORDER BY date DESC
      `, [systemId]);

      res.json({
        success: true,
        systemId,
        stats: reviewStats.rows[0] || {},
        reviews: reviews.rows,
        reviewCount: reviews.rows.length
      });
    } catch (error) {
      console.error('Error in debugReviews:', error);
      res.status(500).json({
        success: false,
        message: 'Erro no debug',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }
}