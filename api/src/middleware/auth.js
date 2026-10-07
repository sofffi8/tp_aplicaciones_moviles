import jwt from 'jsonwebtoken';
// importo los secretos y los modelos de cliente y admin
import { JWT_SECRET_CLIENT, JWT_SECRET_ADMIN } from '../utils/auth.js';
import Client from '../models/clientes.model.js';
import Admin from '../models/admin.model.js';

// extrae el token, verifica que sea "correcto" y 
export const verifyToken = (req, res, next) => {
  // lee 
  const authHeader = req.headers['authorization'];
  // recorta el "bearer", y sólo utiliza la segunda parte del texto
  const token = authHeader && authHeader.split(' ')[1];

  // si no hay token
  if (!token) {
    return res.status(401).json({ estado: false, mensaje: 'Token no proporcionado' });
  }

  // lee el contenido del token
 const payload = jwt.decode(token);

 // 
  const secretos = {
    client: JWT_SECRET_CLIENT,
    admin: JWT_SECRET_ADMIN,
  };

  // busca el secreto según el tipo (type), si el payload es nulo (token ilegible), o el tipo es no es client ni admin, el secret queda indefinido (undefined) 
  const secret = payload && secretos[payload.type];

  // si no hay secret, el token es invalido
  if (!secret) {
    return res.status(401).json({ estado: false, mensaje: 'Token inválido o expirado' });
  }

  try {
    // verifica que la "firma" coincida con el secreto, y verifica que el token no haya expirado, y se guarda el payload en el req.user
    req.user = jwt.verify(token, secret);
    return next();
  } catch (error) {
    return res.status(401).json({ estado: false, mensaje: 'Token inválido o expirado ' });
  }
};

// exigir que sea cliente
export const isClient = async (req, res, next) => {

  // primero comprueba que req.user exista (que verifyToken haya corrido antes), y luego verifica que el type sea 'cliemt'
  if (!req.user || req.user.type !== 'client') {
    return res.status(403).json({ estado: false, mensaje: 'Acceso denegado: Se requiere rol de cliente' });
  }

  try {
    // busca en la bd el cliente con el id
    const client = await Client.findByPk(req.user.id);
    if (!client) {
      return res.status(404).json({ estado: false, mensaje: 'Cliente no encontrado' });
    }
    // guardo el modelo Client
    req.cliente = client;
    next();
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: 'Error al verificar cliente' });
  }
};

// exigir que sea administrador
export const isAdmin = async (req, res, next) => {
  // primero comprueba que req.user exista (que verifyToken haya corrido antes), y luego verifica que el type sea 'admin'
  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({ estado: false, mensaje: 'Acceso denegado: Se requiere rol de admin' });
  }

  try {
    // busca el cliente con el id en la bd
    const admin = await Admin.findByPk(req.user.id);
    if (!admin) {
      return res.status(404).json({ estado: false, mensaje: 'Administrador no encontrado' });
    }
    // guardo el modelo Admin
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: 'Error al verificar administrador' });
  }
};

// clousure, revisa el rol del administrador, recibe el array de roles permitidos (allowedRoles) 
export const checkAdminRole = (allowedRoles = []) => {
  return (req, res, next) => {
    // busca el rol del admin, la primera instancia es la cargada en isAdmin en la bd, la segunda instancia es la que está en el token
    const role = req.admin?.role || req.user?.role;
    // si no encontró el rol se niega el acceso
    if (!role) {
      return res.status(403).json({
        estado: false,
        mensaje: 'Acceso denegado: Rol no especificado',
      });
    }

    // si no está en la lista de permitidos se rechaza
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        estado: false,
        mensaje: `Acceso denegado: Se requiere alguno de los siguientes roles: [${allowedRoles.join(', ')}]`,
      });
    }

    // si el rol fue permitido, continua
    next();
  };
};