import express from 'express';
import { SystemController } from '../../controllers/SystemController';

const router = express.Router();

// 🔐 ROTAS ADMIN - CRUD COMPLETO
// GET /api/admin/systems - Listar todos os sistemas (admin)
router.get('/systems', SystemController.adminGetAllSystems);

// POST /api/admin/systems - Criar novo sistema
router.post('/systems', SystemController.adminCreateSystem);

// PUT /api/admin/systems/:id - Atualizar sistema
router.put('/systems/:id', SystemController.adminUpdateSystem);

// DELETE /api/admin/systems/:id - Deletar sistema
router.delete('/systems/:id', SystemController.adminDeleteSystem);

export default router;