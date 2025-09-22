// src/controllers/SystemController.ts
import { Request, Response } from 'express';
import { SystemModel } from '../models/SystemModel';
import pool from '../config/database';

export class SystemController {
  // Obter todos os sistemas
  static async getAllSystems(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const { category, department, search, isNew, isHighlight } = req.query;
      
      const filters = {
        category: category as string,
        department: department as string,
        search: search as string,
        isNew: isNew ? isNew === 'true' : undefined,
        isHighlight: isHighlight ? isHighlight === 'true' : undefined
      };

      const systems = await SystemModel.findAll(filters);
      
      res.json({
        success: true,
        data: systems,
        count: systems.length,
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

  // Obter sistema por ID
  static async getSystemById(req: Request, res: Response) {
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

      const system = await SystemModel.findById(id);
      if (!system) {
        return res.status(404).json({
          success: false,
          message: 'Sistema não encontrado'
        });
      }

      res.json({
        success: true,
        data: system
      });
    } catch (error) {
      console.error('Error fetching system:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar sistema',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // Obter sistemas por categoria
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

  // Obter sistemas por departamento
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

  // Buscar sistemas
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

  // Adicionar avaliação
  static async addReview(req: Request, res: Response) {
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

      const { userName, rating, comment, demographics, location } = req.body;

      if (!userName || !rating) {
        return res.status(400).json({
          success: false,
          message: 'Nome de usuário e avaliação são obrigatórios'
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'A avaliação deve ser entre 1 e 5'
        });
      }

      await SystemModel.addReview(id, {
        userName,
        rating,
        comment,
        demographics,
        location
      });

      res.json({
        success: true,
        message: 'Avaliação adicionada com sucesso'
      });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao adicionar avaliação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // Obter sistemas em destaque
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

  // Obter sistemas novos
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
}