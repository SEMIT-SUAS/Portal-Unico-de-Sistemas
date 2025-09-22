// src/controllers/CategoryController.ts
import { Request, Response } from 'express';
import { CategoryModel } from '../models/CategoryModel';
import pool from '../config/database';

export class CategoryController {
  // Obter todas as categorias
  static async getAllCategories(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const categories = await CategoryModel.findAll();
      
      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar categorias',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // Obter categorias de departamento
  static async getDepartmentCategories(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const departments = await CategoryModel.findAllDepartments();
      
      res.json({
        success: true,
        data: departments,
        count: departments.length
      });
    } catch (error) {
      console.error('Error fetching department categories:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar categorias de departamento',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }

  // Obter secretarias
  static async getSecretaries(req: Request, res: Response) {
    let client;
    try {
      client = await pool.connect();
      const secretaries = await CategoryModel.findAllSecretaries();
      
      res.json({
        success: true,
        data: secretaries,
        count: secretaries.length
      });
    } catch (error) {
      console.error('Error fetching secretaries:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar secretarias',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      if (client) client.release();
    }
  }
}