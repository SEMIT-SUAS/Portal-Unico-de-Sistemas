// src/routes/systems.ts
import express from 'express';
import { SystemController } from '../controllers/SystemController';

const router = express.Router();

// Rotas de debug (adicionar no topo)
router.get('/debug/mapping', SystemController.testDepartmentMapping);
router.get('/debug/filter-test', SystemController.testDepartmentFilter);
router.get('/debug/all-systems', SystemController.debugAllSystems);

// Rotas principais (mantidas)
router.get('/', SystemController.getAllSystems);
router.get('/highlighted', SystemController.getHighlightedSystems);
router.get('/new', SystemController.getNewSystems);
router.get('/recent', SystemController.getRecentSystems);
router.get('/category/:category', SystemController.getSystemsByCategory);
router.get('/department/:department', SystemController.getSystemsByDepartment);
router.get('/:id', SystemController.getSystemById);

// Rotas de ação
router.post('/search', SystemController.searchSystems);
router.post('/:id/review', SystemController.addReview);
router.post('/:id/increment-downloads', SystemController.incrementDownloads);
router.post('/:id/increment-access', SystemController.incrementAccess);

// Rotas de teste (manter se necessário)
router.post('/test/:id', SystemController.testReview);
router.post('/simple/:id', SystemController.simpleReview);
router.get('/:id/debug-reviews', SystemController.debugReviews);

export default router;