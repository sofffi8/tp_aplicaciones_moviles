import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { BarChart3, UsersRound, PackageSearch, TrendingUp } from 'lucide-react';

export default function AdminSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role || 'auditor';

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <BarChart3 className="h-5 w-5" />, roles: ['superadmin', 'gestor_productos', 'auditor'] },
    { name: 'Gestión de Usuarios', path: '/admin/usuarios', icon: <UsersRound className="h-5 w-5" />, roles: ['superadmin'] },
    { name: 'Catálogo y Stock', path: '/admin/productos', icon: <PackageSearch className="h-5 w-5" />, roles: ['superadmin', 'gestor_productos'] },
    { name: 'Reportes y Métricas', path: '/admin/reportes', icon: <TrendingUp className="h-5 w-5" />, roles: ['superadmin', 'auditor'] },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 flex-shrink-0 hidden md:block">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Panel Admin</h2>
        <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Rol: {role}</p>
      </div>

      <nav className="space-y-1">
        {links.map((item) => {
          if (!item.roles.includes(role)) return null;
          // comprueba si la ruta actual es la del enlace
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}