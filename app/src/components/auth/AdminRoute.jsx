import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminRoute({ children }) {
    const { token, userType, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400 transition-colors duration-200">
                <p className="text-sm font-medium">Cargando...</p>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (userType !== 'admin') {
        return <Navigate to="/cliente/dashboard" replace />;
    }

    return children;
}