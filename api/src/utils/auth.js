import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Controla cuantas veces hago el hash
const SALT_ROUNDS = 10;

// Las claves secretas, las busco en el .env, si no tiene se les pone una clave por defecto
export const JWT_SECRET_CLIENT = process.env.JWT_SECRET_CLIENT || 'clave_por_defecto_cliente';
export const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN || 'clave_por_defecto_admin';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || 'clave_por_defecto_refresh';

// Recibe el texto y lo hashea con el numero de salt rounds para hacerlo más serguro
export const encriptarPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Recibe le texto y el hash, y compara si son iguakes
export const compararPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// recibe el payload y la contraseña secreta para crear (firmar) el token jwt
export const generarToken = (payload, secret) => {
  return jwt.sign(payload, secret, { expiresIn: '15m' });
};

// recibe el payload y crea el token con la clave secreta
export const generarRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

// revisa la "firma" del token y devuelve los datos decodificados del payload 
export const verificarRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};