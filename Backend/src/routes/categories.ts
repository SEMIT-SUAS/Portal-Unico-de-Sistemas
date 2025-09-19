import express from 'express';
import { CategoryController } from '../controllers/CategoryController';

const router = express.Router();

// GET /api/categories - Listar todas as categorias
router.get('/', CategoryController.getAllCategories);

// GET /api/categories/departments - Listar categorias de departamento
router.get('/departments', CategoryController.getDepartmentCategories);

// GET /api/categories/secretaries - Listar secretarias
router.get('/secretaries', CategoryController.getSecretaries);

export default router;