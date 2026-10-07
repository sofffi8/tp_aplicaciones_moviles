import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 mt-16 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">TiendaTech</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Arma tu PC de escritorio, gaming o estación de trabajo profesional desde cero.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="#categorias" className="hover:underline">Categorías</a></li>
              <li><a href="#productos" className="hover:underline">Productos Destacados</a></li>
              <li><Link to="/login" className="hover:underline">Acceso Clientes</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:underline">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:underline">Garantía y Devoluciones</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Contacto
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Email: soporte@tienda.com</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Atención: Lun a Vie 9:00 a 19:00 hs</p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} TiendaTech. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}