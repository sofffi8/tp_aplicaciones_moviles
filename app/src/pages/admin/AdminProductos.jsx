import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CATEGORIAS = ["Procesadores", "Placas de Video", "Memorias RAM", "Almacenamiento"];

export default function AdminProductos() {
  const { token } = useAuth();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [order, setOrder] = useState("ASC");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refrescar, setRefrescar] = useState(0);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: CATEGORIAS[0] });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getProductos = async () => {
      setCargando(true);
      try {
        const res = await axios.get(`${API_URL}/api/products`, {
          params: { page, limit: 5, search, category, sortBy, order },
        });
        if (isMounted) {
          setProductos(res.data.data);
          setTotalPages(res.data.paginacion?.totalPages || 1);
        }
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        if (isMounted) setCargando(false);
      }
    };

    getProductos();

    return () => {
      isMounted = false;
    };
  }, [page, search, category, sortBy, order, refrescar]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setGuardando(true);

    try {
      await axios.post(
        `${API_URL}/api/products`,
        {
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje({ tipo: "ok", texto: `Producto "${form.name.trim()}" creado correctamente.` });
      setForm({ name: "", price: "", stock: "", category: form.category });
      setPage(1);
      setRefrescar((n) => n + 1);
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.mensaje || error.message || "No se pudo crear el producto.",
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleActualizarProducto = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setGuardando(true);

    try {
      await axios.put(
        `${API_URL}/api/products/${productoEnEdicion.id}`,
        {
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje({ tipo: "ok", texto: `Producto "${form.name.trim()}" actualizado correctamente.` });
      setProductoEnEdicion(null);
      setForm({ name: "", price: "", stock: "", category: CATEGORIAS[0] });
      setRefrescar((n) => n + 1);
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.mensaje || error.message || "No se pudo actualizar el producto.",
      });
    } finally {
      setGuardando(false);
    }
  };

  const iniciarEdicion = (producto) => {
    setProductoEnEdicion(producto);
    setForm({
      name: producto.name,
      price: String(producto.price),
      stock: String(producto.stock),
      category: producto.category,
    });
    setMensaje(null);
  };

  const cancelarEdicion = () => {
    setProductoEnEdicion(null);
    setForm({ name: "", price: "", stock: "", category: CATEGORIAS[0] });
    setMensaje(null);
  };

  // borra
  const handleEliminarProducto = async (producto) => {
    setMensaje(null);
    setEliminandoId(producto.id);

    try {
      await axios.delete(`${API_URL}/api/products/${producto.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (productoEnEdicion?.id === producto.id) {
        cancelarEdicion();
      }

      setMensaje({ tipo: "ok", texto: `Producto "${producto.name}" eliminado correctamente.` });

      // si era el único producto de la página, retrocede una página.
      if (productos.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        setRefrescar((n) => n + 1);
      }
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.mensaje || error.message || "No se pudo eliminar el producto.",
      });
    } finally {
      setEliminandoId(null);
      setConfirmandoId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-sm transition-colors duration-200">
            <div className="flex items-center gap-3">
              <Box className="h-7 w-7 text-gray-600 dark:text-gray-400" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Catálogo y Gestión de Productos
              </h1>
            </div>
          </div>

          {/* Búsqueda, filtro y orden */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 shadow-sm transition-colors duration-200">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-slate-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-800 px-4 py-2 text-sm font-medium hover:bg-blue-700 transition text-white"
              >
                Buscar
              </button>
            </form>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
            >
              <option value="">Todas las Categorías</option>
              <option value="Procesadores">Procesadores</option>
              <option value="Placas de Video">Placas de Video</option>
              <option value="Memorias RAM">Memorias RAM</option>
              <option value="Almacenamiento">Almacenamiento</option>
            </select>

            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split("-");
                setSortBy(field);
                setOrder(dir);
                setPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            >
              <option value="price-ASC">Precio: Menor a Mayor</option>
              <option value="price-DESC">Precio: Mayor a Menor</option>
              <option value="name-ASC">Nombre: A - Z</option>
              <option value="name-DESC">Nombre: Z - A</option>
            </select>
          </div>

          {/* Edición de producto */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 shadow-sm transition-colors duration-200">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              {productoEnEdicion ? `Editar producto #${productoEnEdicion.id}` : "Nuevo producto"}
            </h2>

            {mensaje && (
              <div
                className={`mb-4 rounded-xl border p-3 text-sm ${
                  mensaje.tipo === "ok"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
                }`}
              >
                {mensaje.texto}
              </div>
            )}

            <form
              onSubmit={productoEnEdicion ? handleActualizarProducto : handleCrearProducto}
              className="grid grid-cols-1 gap-4 md:grid-cols-5"
            >
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Ej: Memoria RAM Corsair 16GB"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Precio</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Stock</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 md:col-span-5">
                <button
                  type="submit"
                  disabled={guardando}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
                >
                  {guardando
                    ? "Guardando..."
                    : productoEnEdicion
                      ? "Guardar cambios"
                      : "Crear producto"}
                </button>

                {productoEnEdicion && (
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="rounded-xl border border-slate-300 bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tabla de Productos */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm transition-colors duration-200">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-950 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {cargando ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-6 text-center text-slate-500 dark:text-slate-400"
                    >
                      Cargando productos...
                    </td>
                  </tr>
                ) : productos.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-6 text-center text-slate-500 dark:text-slate-400"
                    >
                      No se encontraron productos
                    </td>
                  </tr>
                ) : (
                  productos.map((prod) => (
                    <tr
                      key={prod.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-slate-400 dark:text-slate-500">
                        #{prod.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {prod.name}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {prod.category}
                      </td>
                      <td className="px-4 py-3 text-green-600 dark:text-green-500 font-semibold">
                        ${prod.price}
                      </td>
                      <td className="px-4 py-3">{prod.stock} u.</td>
                      <td className="px-4 py-3">
                        {confirmandoId === prod.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                              ¿Desea eliminar?
                            </span>
                            <button
                              type="button"
                              onClick={() => handleEliminarProducto(prod)}
                              disabled={eliminandoId === prod.id}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 disabled:opacity-50 cursor-pointer"
                            >
                              {eliminandoId === prod.id ? "..." : "Sí"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmandoId(null)}
                              className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => iniciarEdicion(prod)}
                              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-800 dark:hover:text-white cursor-pointer"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmandoId(prod.id)}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-800 dark:hover:text-white cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginador */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 shadow-sm transition-colors duration-200">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-xl border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 px-4 py-2 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-100 dark:disabled:hover:bg-slate-800 transition cursor-pointer"
            >
              Anterior
            </button>

            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Página{" "}
              <strong className="text-slate-900 dark:text-white">{page}</strong>{" "}
              de{" "}
              <strong className="text-slate-900 dark:text-white">
                {totalPages}
              </strong>
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-xl border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 px-4 py-2 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-100 dark:disabled:hover:bg-slate-800 transition cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}