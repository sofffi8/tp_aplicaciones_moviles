import { ChartLine } from "lucide-react";

export default function AdminReportes() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <ChartLine className="h-7 w-7 text-gray-600 dark:text-gray-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Reportes y Métricas
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="font-bold text-lg">Categorías más vendidas</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Placas de Video</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-yellow-600 h-full w-[45%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Procesadores</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[30%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="font-bold text-lg">Actividad Reciente</h3>
          <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
            <li className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <strong>admin@tienda.com</strong> actualizó el stock del
              producto con id:6
            </li>
            <li className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <strong>auditor@tienda.com</strong> exportó el informe mensual
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
