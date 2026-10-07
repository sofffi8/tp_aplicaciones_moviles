import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'clients',
  timestamps: false,
  indexes: [{ unique: true, fields: ['email'] }],
  hooks: {
    beforeCreate: async (cliente) => {
      if (cliente.password) {
        cliente.password = await bcrypt.hash(cliente.password, 10);
      }
    },
    beforeUpdate: async (cliente) => {
      if (cliente.changed('password')) {
        cliente.password = await bcrypt.hash(cliente.password, 10);
      }
    },
  },
});

export default Client;