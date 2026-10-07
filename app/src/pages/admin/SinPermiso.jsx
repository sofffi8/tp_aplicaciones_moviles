import { Link } from 'react-router-dom';
import { CircleMinus } from 'lucide-react';

export default function SinPermiso() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <CircleMinus className="h-7 w-7 text-red-500 dark:text-red-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Acceso Denegado
          </h1>
        </div>
        
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Tu rol actual no posee los permisos necesarios para acceder.
        </p>

        <Link
          to="/admin/dashboard"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 cursor-pointer"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}