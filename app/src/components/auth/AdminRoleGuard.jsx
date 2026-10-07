import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminRoleGuard({ allowedRoles, children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400 transition-colors duration-200">
        <p className="text-sm font-medium">Verificando...</p>
      </div>
    );
  }

  const currentRole = user?.role;

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to="/admin/sin-permiso" replace />;
  }

  return children;
}