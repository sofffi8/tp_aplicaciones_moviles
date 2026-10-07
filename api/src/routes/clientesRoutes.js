import { Router } from 'express';
import { obtenerPerfil } from '../controllers/clientesController.js';
import { verifyToken, isClient } from '../middleware/auth.js';

const router = Router();

// se ejecuta primero verifytoken para verificar la identidad, luego isclient para asegurar que sea cliente, y luego obtenerperfil para devolver los datos del perfil
router.get('/perfil', verifyToken, isClient, obtenerPerfil);

export default router;