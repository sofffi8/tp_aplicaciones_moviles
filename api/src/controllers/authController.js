// importo los modelos, las funciones de seguridad y los secretos
import { Client, Admin } from '../models/index.js';
import {
  compararPassword,
  generarToken,
  generarRefreshToken,
  verificarRefreshToken,
  JWT_SECRET_CLIENT,
  JWT_SECRET_ADMIN,
} from '../utils/auth.js';

// login del administrador
export const loginAdmin = async (req, res) => {
  try {
    // agarro el email y contraseña de la peticion
    const { email, password } = req.body;
    // busco en la tabla Admin el que tenga ese email
    const admin = await Admin.findOne({ where: { email } });

    // si no existe, error
    if (!admin) {
      return res.status(404).json({ estado: false, mensaje: 'Administrador no encontrado' });
    }

    // comparo la contarseña escrita por el usuario con el hash guardado (admin.password)
    const passwordValida = await compararPassword(password, admin.password);
    if (!passwordValida) {
      return res.status(400).json({ estado: false, mensaje: 'Contraseña incorrecta' });
    }

    // guarda el payload con la imformacion necesaria (id, tipo y rol)
    const payload = { id: admin.id, type: 'admin', role: admin.role };
    // "firma" el token con el payload y el secreto admin
    const token = generarToken(payload, JWT_SECRET_ADMIN);
    // "firma" el refresh token
    const refreshToken = generarRefreshToken(payload);
    // guarda el refresh token en la bd
    await admin.update({ refreshToken });

    // devuelve como respuesta las credenciales y los datos del admin
    return res.json({
      estado: true,
      token,
      refreshToken,
      usuario: {
        id: admin.id,
        nombre: admin.nombre,
        email: admin.email,
        role: admin.role,
        type: 'admin',
      },
    });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: 'Error en servidor', error: error.message });
  }
};

// login del cliente
export const loginClient = async (req, res) => {
  try {
    // guardo el email y contraseña de la peticion
    const { email, password } = req.body;
    // busco en  la tabla Client el que tenga ese email
    const client = await Client.findOne({ where: { email } });

    // cliente no encontrado
    if (!client) {
      return res.status(404).json({ estado: false, mensaje: 'Cliente no encontrado' });
    }

    // comparo la contarseña escrita por el usuario con el hash guardado (client.password)
    const passwordValida = await compararPassword(password, client.password);
    if (!passwordValida) {
      return res.status(400).json({ estado: false, mensaje: 'Contraseña incorrecta' });
    }

    // guarda el payload con la imformacion necesaria (id y tipo)
    const payload = { id: client.id, type: 'client' };
    // genera el token del cliente
    const token = generarToken(payload, JWT_SECRET_CLIENT);
    // genera el refresh token
    const refreshToken = generarRefreshToken(payload);
    // guarda en la bd el refresh token
    await client.update({ refreshToken });

    // devuelve como respuesta las credenciales y los datos del cliente
    return res.json({
      estado: true,
      token,
      refreshToken,
      cliente: {
        id: client.id,
        nombre: client.nombre,
        email: client.email,
        type: 'client',
      },
    });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: 'Error en servidor', error: error.message });
  }
};

// renovar la clave de acceso
export const refreshTokenHandler = async (req, res) => {
  try {
    // guardo refresh token
    const { refreshToken } = req.body;
    // si no lo mandaron
    if (!refreshToken) {
      return res.status(400).json({ estado: false, mensaje: 'Refresh token requerido' });
    }

    // verifica la firma con la clave secreta usando verificarRefreshToken y se guardan los datos decodificados
    const decoded = verificarRefreshToken(refreshToken);
    // crea el Model porque dentro va a contener un modelo, vemos si el tipo es admin se asigna modelo Admin, sino se le asigna Client
    const Model = decoded.type === 'admin' ? Admin : Client;
    // se verifica si el tipo es admin, y se le guarda el secreto de admin, sino se le guarda el secreto de cliente
    const secret = decoded.type === 'admin' ? JWT_SECRET_ADMIN : JWT_SECRET_CLIENT

    // busca el usuario por el id
    const user = await Model.findByPk(decoded.id);
    // si el usuario no existe o si el token de refresh no coincide con el de la peticion
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ estado: false, mensaje: 'Refresh token inválido o revocado' });
    }

    // firma el token nuevo 
    const newToken = generarToken(
      { id: user.id, type: decoded.type, role: user.role },
      secret
    );

    // devuelve el nuevo token
    return res.json({ estado: true, token: newToken });
  } catch (error) {
    return res.status(403).json({ estado: false, mensaje: 'Refresh token expirado o inválido' });
  }
};

// cerrar sesion completamente
export const logoutHandler = async (req, res) => {
  try {
    const { refreshToken, type } = req.body;
    if (refreshToken) {
      // se fija si es cliente o si es admin
      const Model = type === 'admin' ? Admin : Client;

      // busca el usuario con sesion activa que tenga ese mismo refresh token
      const user = await Model.findOne({ where: { refreshToken } });

      //si lo encuentra, pone la columna en nulo, haciendo que no sirva más
      if (user) {
        await user.update({ refreshToken: null });
      }
    }

    return res.json({ estado: true, mensaje: 'Sesión cerrada correctamente' });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: 'Error al cerrar sesión' });
  }
};