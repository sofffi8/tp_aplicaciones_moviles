import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminDashboard() {
  const [metricas, setMetricas] = useState({
    ventasTotales: 0,
    pedidosPendientes: 0,
    usuariosRegistrados: 0,
    productosBajoStock: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_URL}/api/admin/metricas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const datos = res.data?.metricas || res.data?.data || res.data;
        if (datos) {
          setMetricas({
            ventasTotales: datos.ventasTotales ?? 0,
            pedidosPendientes: datos.pedidosPendientes ?? 0,
            usuariosRegistrados: datos.usuariosRegistrados ?? datos.usuariosActivos ?? 0,
            productosBajoStock: datos.productosBajoStock ?? datos.bajoStock ?? 0,
          });
        }
      })
      .catch((err) => {
        console.error('Error al cargar métricas del backend:', err);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard General</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Resumen operativo y métricas en tiempo real</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ventas Totales</p>
          <p className="mt-2 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            ${Number(metricas.ventasTotales || 0).toLocaleString('es-AR')}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pedidos Pendientes</p>
          <p className="mt-2 text-2xl font-extrabold text-amber-500">{metricas.pedidosPendientes || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Usuarios Registrados</p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-500">{metricas.usuariosRegistrados || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bajo Stock</p>
          <p className="mt-2 text-2xl font-extrabold text-red-500">{metricas.productosBajoStock || 0}</p>
        </div>
      </div>
    </div>
  );
}