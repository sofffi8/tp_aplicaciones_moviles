import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { verifyToken, isAdmin, checkAdminRole } from '../middleware/auth.js';

const router = Router();

// ruta publica, muestra los productos sin haber iniciado sesion
router.get('/', getProducts);

// requiere que el usuario este autenticado como admin (superadmin o gestor) para poder crear productos
router.post('/', verifyToken, isAdmin, checkAdminRole(['superadmin', 'gestor_productos']), createProduct);

// para modificar (put) requiere que el admin sea superadmin o gestor para poder actualizar un producto
router.put('/:id', verifyToken, isAdmin, checkAdminRole(['superadmin', 'gestor_productos']), updateProduct);

// elimina solamente un superadmin o gestor
router.delete('/:id', verifyToken, isAdmin, checkAdminRole(['superadmin', 'gestor_productos']), deleteProduct);

export default router;