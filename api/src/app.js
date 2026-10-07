import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import sequelize from './config/database.js';
import { Client, Admin } from './models/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PUERTO = process.env.PORT || 3000;

// Inicializa client y admin
const inicializarBaseDeDatos = async () => {
  await sequelize.sync({ alter: true });

  // Uso findOrCreate porque si el usuario ya existe no lo crea
  await Admin.findOrCreate({
    where: { email: 'admin@tienda.com' },
    defaults: {
      nombre: 'Administrador General',
      email: 'admin@tienda.com',
      password: 'admin123',
      role: 'superadmin',
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

  console.log('Usuarios por defecto verificados.');
};

// Arrancar el servidor
const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    await inicializarBaseDeDatos();

    app.listen(PUERTO, () => {
      console.log('Servidor iniciado correctamente en el puerto:', PUERTO);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

iniciarServidor();