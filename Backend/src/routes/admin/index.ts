import express from 'express';
import systemRoutes from './systems';
// Futuramente: userRoutes, analyticsRoutes, etc.

const router = express.Router();

// Agrupa todas as rotas admin
router.use(systemRoutes);

export default router;