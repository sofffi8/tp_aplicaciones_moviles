import { Router } from 'express';
import authRoutes from './authRoutes.js';
import clientesRoutes from './clientesRoutes.js';
import adminRoutes from './adminRoutes.js';
import productRoutes from './productRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/client', clientesRoutes);
router.use('/admin', adminRoutes);
router.use('/products', productRoutes);

export default router;