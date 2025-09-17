import express from 'express';
import { DashboardController } from '../controllers/DashboardController';

const router = express.Router();

/**
 * @route GET /api/dashboard/stats
 * @description Obter todas as estatísticas do dashboard
 * @access Public
 */
router.get('/stats', DashboardController.getDashboardStats);

/**
 * @route GET /api/dashboard/charts
 * @description Obter dados para gráficos do dashboard
 * @access Public
 */
router.get('/charts', DashboardController.getDashboardCharts);

/**
 * @route GET /api/dashboard/cards
 * @description Obter dados específicos para os cards do dashboard
 * @access Public
 */
router.get('/cards', DashboardController.getDashboardCards);

export default router;