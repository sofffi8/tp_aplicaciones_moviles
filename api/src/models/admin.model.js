import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const Admin = sequelize.define('Admin', {
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
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'gestor_productos', 'auditor'),
    allowNull: false,
    defaultValue: 'gestor_productos',
  },
  // guarda el refresh token el la bd 
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'admins',
  timestamps: false,
  // verifica que sólo haya un email (no se registra dos usuarios con el mismo email)
  indexes: [{ unique: true, fields: ['email'] }],
  hooks: {
    // hashea la contraseña antes de almacenarse 
    beforeCreate: async (admin) => {
      if (admin.password) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    },
    // hashea la contraseña antes de guardar los cambios en la bd
    beforeUpdate: async (admin) => {
      if (admin.changed('password')) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    },
  },
});

export default Admin;