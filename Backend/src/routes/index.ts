import express from 'express';
import systemsRoutes from './systems';
import dashboardRoutes from './dashboard';
import categoriesRoutes from './categories';

const router = express.Router();

// Rotas principais
router.use('/systems', systemsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/categories', categoriesRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API está funcionando' });
});

export default router;