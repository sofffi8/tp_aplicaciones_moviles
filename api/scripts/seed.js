import 'dotenv/config';
import { sequelize, Client, Admin, Product } from '../src/models/index.js';

const runSeed = async () => {
  try {
    // comprueba que la conexion con la bd sea correcta, e intenta autenticarse
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // sincroniza los modelos con la bd
    await sequelize.sync({ alter: true });

    await Admin.findOrCreate({
      where: { email: 'admin@tienda.com' },
      defaults: {
        nombre: 'Administrador General',
        email: 'admin@tienda.com',
        password: 'admin123',
        role: 'superadmin',
      },
    });

    await Admin.findOrCreate({
      where: { email: 'gestor@tienda.com' },
      defaults: {
        nombre: 'Gestor de Productos',
        email: 'gestor@tienda.com',
        password: 'gestor123',
        role: 'gestor_productos',
      },
    });

    await Admin.findOrCreate({
      where: { email: 'auditor@tienda.com' },
      defaults: {
        nombre: 'Auditor de Ventas',
        email: 'auditor@tienda.com',
        password: 'auditor123',
        role: 'auditor',
      },
    });

    await Client.findOrCreate({
      where: { email: 'cliente@tienda.com' },
      defaults: {
        nombre: 'Cliente Inicial',
        email: 'cliente@tienda.com',
        password: 'cliente123',
        direccion: 'Calle Falsa 123',
        telefono: '1122334455',
      },
    });

    const cantidadProductos = await Product.count();

    if (cantidadProductos === 0) {
      await Product.bulkCreate([
        { name: 'Procesador Intel Core i7-13700K', price: 420.0, stock: 10, category: 'Procesadores' },
        { name: 'Procesador AMD Ryzen 7 7800X3D', price: 450.0, stock: 8, category: 'Procesadores' },
        { name: 'Placa de Video NVIDIA RTX 4070', price: 650.0, stock: 5, category: 'Placas de Video' },
        { name: 'Placa de Video AMD Radeon RX 7800 XT', price: 520.0, stock: 7, category: 'Placas de Video' },
        { name: 'Memoria RAM Corsair Vengeance 32GB DDR5', price: 130.0, stock: 20, category: 'Memorias RAM' },
        { name: 'Memoria RAM Kingston FURY 16GB DDR4', price: 55.0, stock: 15, category: 'Memorias RAM' },
        { name: 'Disco SSD NVMe Samsung 990 PRO 1TB', price: 120.0, stock: 12, category: 'Almacenamiento' },
        { name: 'Disco SSD NVMe Kingston NV2 2TB', price: 140.0, stock: 18, category: 'Almacenamiento' },
      ]);
      console.log('Seed completado: 8 productos cargados.');
    } else {
      console.log(`Seed completado: ya hay ${cantidadProductos} productos, no se insertó ninguno.`);
    }
  } catch (error) {
    console.error('Error al ejecutar el seed:', error);
  } finally {
    await sequelize.close();
  }
};

runSeed();