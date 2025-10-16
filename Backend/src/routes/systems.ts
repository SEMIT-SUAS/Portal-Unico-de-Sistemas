// src/routes/systemRoutes.ts
import express from 'express';
import { SystemController } from '../controllers/SystemController';

const router = express.Router();

// GET /api/systems - Listar todos os sistemas
router.get('/', SystemController.getAllSystems);

// GET /api/systems/highlighted - Sistemas em destaque
router.get('/highlighted', SystemController.getHighlightedSystems);

// GET /api/systems/new - Sistemas novos
router.get('/new', SystemController.getNewSystems);

// GET /api/systems/recent - Sistemas recentes
router.get('/recent', SystemController.getRecentSystems);

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

// ✅ ADICIONAR ESTAS ROTAS QUE ESTÃO FALTANDO:
// POST /api/systems/:id/increment-downloads - Incrementar downloads
router.post('/:id/increment-downloads', SystemController.incrementDownloads);

// POST /api/systems/:id/increment-access - Incrementar acessos
router.post('/:id/increment-access', SystemController.incrementAccess);

// ✅ ROTAS DE TESTE TEMPORÁRIAS:
// POST /api/systems/test/:id - Teste de review
router.post('/test/:id', SystemController.testReview);

// POST /api/systems/simple/:id - Review simplificado
router.post('/simple/:id', SystemController.simpleReview);

export default router;