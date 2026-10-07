import { Router } from 'express';
import { loginClient, loginAdmin, refreshTokenHandler, logoutHandler } from '../controllers/authController.js';

const router = Router();

router.post('/client/login', loginClient);
router.post('/admin/login', loginAdmin);
router.post('/refresh', refreshTokenHandler);
router.post('/logout', logoutHandler);

export default router;