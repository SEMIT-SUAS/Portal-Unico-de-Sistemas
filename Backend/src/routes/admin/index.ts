// src/routes/index.ts
import express from 'express';
import systemRoutes from './system';

const router = express.Router();

console.log('🔄 Registrando rotas no index.ts...');

// ✅ Registrar rotas de sistemas
router.use('/systems', systemRoutes);

console.log('✅ Rotas registradas no index.ts');

export default router;