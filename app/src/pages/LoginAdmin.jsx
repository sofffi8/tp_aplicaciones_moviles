import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginAdmin() {
    const navigate = useNavigate();
    const { userType, logout, loginAdmin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    // advertencia si hay sesión de Cliente activa
    if (userType === 'client') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 px-4 transition-colors duration-200">
                <div className="w-full max-w-md space-y-4 rounded-2xl border border-yellow-300 bg-yellow-50 dark:border-yellow-500/30 dark:bg-slate-900 p-8 text-center shadow-xl transition-colors duration-200">
                    <div className="text-4xl">⚠️</div>
                    <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-400">Sesión de Cliente Activa</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Ya posee una sesión de Cliente activa. Para ingresar al panel de Administración, debe cerrar su sesión actual.
                    </p>
                    <button
                        onClick={async () => {
                            await logout('/admin/login');
                        }}
                        className="w-full rounded-xl bg-yellow-600 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-500"
                    >
                        Cerrar sesión de Cliente y continuar
                    </button>
                </div>
            </div>
        );
    }

    // redirección si ya es Administrador
    if (userType === 'admin') {
        navigate('/admin/dashboard');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setEnviando(true);
            await loginAdmin(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 px-4 transition-colors duration-200">
            <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-8 shadow-xl transition-colors duration-200">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Área de Gestión</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Ingreso Administrador</h1>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200 transition-colors duration-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full rounded-xl bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {enviando ? 'Accediendo...' : 'Ingresar al Panel'}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-500">
                    <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">← Volver al inicio</Link>
                </p>
            </div>
        </div>
    );
}