// src/models/CategoryModel.ts
import pool from '../config/database';

export class CategoryModel {
  // Obter todas as categorias
  static async findAll() {
    const query = `SELECT * FROM categories ORDER BY name`;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  // Obter todas as categorias de departamento
  static async findAllDepartments() {
    const query = `SELECT * FROM department_categories ORDER BY name`;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching department categories:', error);
      throw new Error('Failed to fetch department categories');
    }
  }

  // Obter todas as secretarias
  static async findAllSecretaries() {
    const query = `SELECT * FROM secretaries ORDER BY name`;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching secretaries:', error);
      throw new Error('Failed to fetch secretaries');
    }
  }
}