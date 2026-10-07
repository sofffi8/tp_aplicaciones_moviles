import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { Moon, Sun, Store, Menu, X, LogOut, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const { user, userType, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const esVistaAdmin = location.pathname.startsWith("/admin");
  const esHome = location.pathname === "/";

  const handleLogout = async () => {
    setMenuAbierto(false);
    await logout();
  };

  const handleIrAInicio = (e) => {
    if (esHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMenuAbierto(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md text-slate-800 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          {/* Lado izquierdo */}
          <div className="flex items-center gap-3">
            {!esVistaAdmin && (
              <button
                onClick={() => setMenuAbierto(true)}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 md:hidden cursor-pointer"
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}

            <Link
              to="/"
              onClick={handleIrAInicio}
              className="flex items-center gap-2 font-bold text-lg tracking-tight"
            >
              <span className="rounded-lg bg-blue-600 p-1.5 text-white flex items-center justify-center">
                <Store className="h-5 w-5" />
              </span>
              <span>TiendaTech</span>
            </Link>
          </div>

          {/* Navegación */}
          {!esVistaAdmin && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/"
                onClick={handleIrAInicio}
                className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition"
              >
                Inicio
              </Link>

              {/* Categorías y Destacados - Se muestran sólo estando en la página principal */}
              {esHome && (
                <>
                  <a
                    href="#categorias"
                    className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition"
                  >
                    Categorías
                  </a>
                  <a
                    href="#productos"
                    className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition"
                  >
                    Destacados
                  </a>
                </>
              )}

              {!userType && (
                <>
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition"
                  >
                    Ingreso Cliente
                  </Link>
                  <Link
                    to="/admin/login"
                    className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
                  >
                    Acceso Admin
                  </Link>
                </>
              )}

              {userType === "client" && (
                <Link
                  to="/cliente/dashboard"
                  className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition"
                >
                  Mi Panel
                </Link>
              )}

              {userType === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition"
                >
                  Panel Admin
                </Link>
              )}
            </nav>
          )}

          {/* Botón para volver a la tienda desde Admin */}
          {esVistaAdmin && (
            <Link
              to="/"
              onClick={handleIrAInicio}
              className="hidden sm:flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-800 dark:hover:text-white transition cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
          )}

          {/* Lado derecho */}
          <div className="flex items-center gap-3">
            {userType === "client" && (
              <span className="hidden sm:inline-block text-xs rounded-full bg-emerald-100 px-3 py-1 font-semibold text-green-800 dark:bg-green-950/60 dark:text-green-300">
                Cliente: {user?.nombre || user?.email?.split("@")[0]}
              </span>
            )}
            {userType === "admin" && (
              <span className="hidden sm:inline-block text-xs rounded-full bg-indigo-100 px-3 py-1 font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 uppercase">
                {user?.role || "Admin"}
              </span>
            )}

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Cambiar tema"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-white" />
                  <span className="hidden sm:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-600" />
                  <span className="hidden sm:inline">Modo Oscuro</span>
                </>
              )}
            </button>

            {userType && (
              <button
                onClick={handleLogout}
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-800 dark:hover:text-white transition cursor-pointer"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {!esVistaAdmin && (
        <>
          <div
            className={`fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
              menuAbierto
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setMenuAbierto(false)}
          />

          <aside
            className={`fixed top-0 left-0 z-50 h-full w-72 bg-white p-6 shadow-2xl transition-transform duration-300 dark:bg-slate-900 dark:text-slate-100 md:hidden flex flex-col justify-between ${
              menuAbierto ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                  <Store className="h-6 w-6" />
                  <span className="text-lg">TiendaTech</span>
                </div>
                <button
                  onClick={() => setMenuAbierto(false)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="space-y-2">
                <Link
                  to="/"
                  onClick={handleIrAInicio}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                >
                  <Store className="h-5 w-5" />
                  <span>Inicio</span>
                </Link>

                {esHome && (
                  <>
                    <a
                      href="#categorias"
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                    >
                      <span>Categorías</span>
                    </a>

                    <a
                      href="#productos"
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                    >
                      <span>Destacados</span>
                    </a>
                  </>
                )}
              </nav>
            </div>

            <div className="border-t border-slate-200 pt-4 dark:border-slate-800 space-y-3">
              {!userType ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuAbierto(false)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Ingreso Cliente
                  </Link>
                  <Link
                    to="/admin/login"
                    onClick={() => setMenuAbierto(false)}
                    className="w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Ingreso Admin
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-500 cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
