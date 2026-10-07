import sequelize from '../config/database.js';
import Client from './clientes.model.js';
import Admin from './admin.model.js';
import Product from './product.model.js';

// permite importar por separado
export {
  sequelize,
  Client,
  Admin,
  Product,
};

// agrupa los 4 en un sólo objeto
export default {
  sequelize,
  Client,
  Admin,
  Product,
};