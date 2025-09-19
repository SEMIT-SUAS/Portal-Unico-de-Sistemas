import express from 'express';
import { SystemController } from '../controllers/SystemController';

const router = express.Router();

// GET /api/systems - Listar todos os sistemas
router.get('/', SystemController.getAllSystems);

// GET /api/systems/:id - Obter sistema por ID
router.get('/:id', SystemController.getSystemById);

// GET /api/systems/category/:category - Obter sistemas por categoria
router.get('/category/:category', SystemController.getSystemsByCategory);

// GET /api/systems/department/:department - Obter sistemas por departamento
router.get('/department/:department', SystemController.getSystemsByDepartment);

// POST /api/systems/search - Buscar sistemas
router.post('/search', SystemController.searchSystems);

// POST /api/systems/:id/review - Adicionar avaliação
router.post('/:id/review', SystemController.addReview);

export default router;