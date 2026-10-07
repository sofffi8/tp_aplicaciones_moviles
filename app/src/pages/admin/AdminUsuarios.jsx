import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from 'lucide-react';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Admin General', email: 'admin@tienda.com', role: 'superadmin' },
    { id: 2, nombre: 'Gestor Stock', email: 'gestor@tienda.com', role: 'gestor_productos' },
    { id: 3, nombre: 'Auditor Cuentas', email: 'auditor@tienda.com', role: 'auditor' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_URL}/api/admin/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const datos = res.data.data || res.data;
        if (Array.isArray(datos) && datos.length > 0) setUsuarios(datos);
      })
      .catch(() => console.log('Cargando usuarios por defecto'));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <User className="h-7 w-7 text-gray-600 dark:text-gray-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Gestión de Usuarios
          </h1>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
            <tr>
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Nombre</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-4 text-slate-400">#{u.id}</td>
                <td className="p-4 font-medium">{u.nombre || u.name}</td>
                <td className="p-4 text-slate-500">{u.email}</td>
                <td className="p-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase">
                    {u.role || 'Admin'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}