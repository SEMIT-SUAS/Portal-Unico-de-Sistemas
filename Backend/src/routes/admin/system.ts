// src/routes/systems.ts
import express from 'express';
import { SystemController } from '../../controllers/SystemController'

const router = express.Router();

console.log('🔧 Configurando rotas de sistemas...');

// Rotas existentes
router.get('/', SystemController.getAllSystems);
router.get('/recent', SystemController.getRecentSystems);
router.get('/highlighted', SystemController.getHighlightedSystems);
router.get('/new', SystemController.getNewSystems);
router.post('/search', SystemController.searchSystems);
router.get('/category/:category', SystemController.getSystemsByCategory);
router.get('/department/:department', SystemController.getSystemsByDepartment);
router.post('/:id/review', SystemController.addReview);
router.get('/:id', SystemController.getSystemById);

console.log('✅ Rotas de sistemas configuradas');

export default router;