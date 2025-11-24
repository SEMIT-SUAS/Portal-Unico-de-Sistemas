import express from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { DashboardController } from '../controllers/DashboardController'; // IMPORTAR O DASHBOARD CONTROLLER

const router = express.Router();

// GET /api/categories - Listar todas as categorias
router.get('/', CategoryController.getAllCategories);

// GET /api/categories/departments - Listar categorias de departamento
router.get('/departments', CategoryController.getDepartmentCategories);

// GET /api/categories/secretaries - Listar secretarias
router.get('/secretaries', CategoryController.getSecretaries);

// ✅ NOVA ROTA ADICIONADA: GET /api/categories/filtered-counts
router.get('/filtered-counts', DashboardController.getFilteredCategoryCounts);

export default router;