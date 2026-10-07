import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ClienteDashboard() {
    const { token, logout } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get(`${API_URL}/api/client/perfil`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setPerfil(res.data.data || res.data.cliente || res.data))
            .catch((err) => setError(err.response?.data?.mensaje || err.message))
            .finally(() => setCargando(false));
    }, [token]);

    const handleLogout = () => {
        logout();
    };

    if (cargando) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400 transition-colors duration-200">
                <p className="text-sm font-medium">Cargando perfil de cliente...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 p-6 transition-colors duration-200">
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-sm transition-colors duration-200">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-slate-300 bg-slate-100/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:border-red-800 dark:hover:text-red-300"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200 transition-colors duration-200">
                        {error}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-sm space-y-4 transition-colors duration-200">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Datos</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
                                <p className="text-xs font-semibold text-slate-400">Nombre</p>
                                <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                                    {perfil?.nombre || perfil?.name || 'No especificado'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
                                <p className="text-xs font-semibold text-slate-400">Email</p>
                                <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                                    {perfil?.email || 'No especificado'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
                                <p className="text-xs font-semibold text-slate-400">Dirección</p>
                                <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                                    {perfil?.direccion || 'Sin dirección registrada'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
                                <p className="text-xs font-semibold text-slate-400">Teléfono</p>
                                <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                                    {perfil?.telefono || 'Sin teléfono registrado'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}