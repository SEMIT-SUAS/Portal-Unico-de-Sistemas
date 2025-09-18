import { Request, Response } from 'express';
import { SystemModel } from '../models/SystemModel';

export class SystemController {
  // Obter todos os sistemas
  static async getAllSystems(req: Request, res: Response) {
    try {
      const systems = await SystemModel.findAll();
      res.json({
        success: true,
        data: systems,
        count: systems.length
      });
    } catch (error) {
      console.error('Error fetching systems:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar sistemas',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // Obter sistema por ID
  static async getSystemById(req: Request, res: Response) {
    try {
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
    }
  }

  // Obter sistemas por categoria
  static async getSystemsByCategory(req: Request, res: Response) {
    try {
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
    }
  }

  // Obter sistemas por departamento
  static async getSystemsByDepartment(req: Request, res: Response) {
    try {
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
    }
  }

  // Buscar sistemas
  static async searchSystems(req: Request, res: Response) {
    try {
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
    }
  }

  // Adicionar avaliação
  static async addReview(req: Request, res: Response) {
    try {
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
    }
  }
}