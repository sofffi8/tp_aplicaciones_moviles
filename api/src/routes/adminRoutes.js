import { Router } from 'express';
import { verifyToken, isAdmin, checkAdminRole } from '../middleware/auth.js';
import { Admin } from '../models/index.js';

const router = Router();

// le aplica los middlewares a todas las rutas
router.use(verifyToken, isAdmin);

// requiere checkadminrole para autorizar administradores autorizados
router.get('/metricas', checkAdminRole(['superadmin', 'auditor', 'gestor_productos']), (req, res) => {
  res.json({
    estado: true,
    data: {
      ventasTotales: 1250000,
      pedidosPendientes: 14,
      usuariosActivos: 340,
      productosBajoStock: 5,
    },
  });
});

// requiere checkadminrole para autorizar unicamente a los administradores autorizados
router.get('/usuarios', checkAdminRole(['superadmin']), async (req, res) => {
  // muestra la lista completa de admins registrados en la bd
  const admins = await Admin.findAll({
    attributes: ['id', 'nombre', 'email', 'role'],
  });
  res.json({ estado: true, data: admins });
});

// requiere checkadminrole para autorizar unicamente a los administradores autorizados
router.post('/productos', checkAdminRole(['superadmin', 'gestor_productos']), (req, res) => {
  res.json({
    estado: true,
    mensaje: 'Producto creado exitosamente',
    producto: req.body,
  });
});

// requiere checkadminrole para autorizar unicamente a los administradores autorizados
router.get('/reportes', checkAdminRole(['superadmin', 'auditor']), (req, res) => {
  res.json({
    estado: true,
    reportes: {
      ventasTotales: 1250000,
      pedidosPendientes: 14,
      usuariosActivos: 340,
    },
  });
});

export default router;