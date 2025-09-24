import express from 'express';
import { DashboardController } from '../controllers/DashboardController';

const router = express.Router();

// GET /api/dashboard/stats - Estatísticas do dashboard (com suporte a ?department=)
router.get('/stats', DashboardController.getDashboardStats);

// REMOVA estas rotas ou comente-as pois os métodos não existem mais:
// router.get('/charts', DashboardController.getDashboardCharts);
// router.get('/cards', DashboardController.getDashboardCards);

export default router;