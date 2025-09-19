import express from 'express';
import { DashboardController } from '../controllers/DashboardController';

const router = express.Router();

// GET /api/dashboard/stats - Estatísticas do dashboard
router.get('/stats', DashboardController.getDashboardStats);

// GET /api/dashboard/charts - Dados para gráficos
router.get('/charts', DashboardController.getDashboardCharts);

// GET /api/dashboard/cards - Dados para cards
router.get('/cards', DashboardController.getDashboardCards);

export default router;