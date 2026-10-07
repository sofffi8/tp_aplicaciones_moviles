import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const PROMOCIONES = {
  Procesadores: 15,
  'Placas de Video': 10,
  'Memorias RAM': 20,
  Almacenamiento: 5,
};

const obtenerDescuento = (categoria) => PROMOCIONES[categoria] || 0;

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => {
        const datos = res.data.data || res.data.productos || res.data;
        setProductos(Array.isArray(datos) ? datos : []);
      })
      .catch((err) => console.error('Error cargando productos de la seed:', err))
      .finally(() => setCargando(false));
  }, []);

  const categorias = [
    { id: 1, nombre: 'Procesadores',  count: 'Procesadores e Integrados' },
    { id: 2, nombre: 'Placas de Video', count: 'NVIDIA y AMD Radeon' },
    { id: 3, nombre: 'Memorias RAM', count: 'DDR4 y DDR5' },
    { id: 4, nombre: 'Almacenamiento', count: 'SSDs NVMe y Discos' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-16">
        <section className="flex flex-col items-center justify-between gap-8 md:flex-row md:py-12">
          <div className="text-center md:w-1/2 md:text-left space-y-4">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Componentes de PC de la mejor calidad
            </span>
            <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl text-slate-900 dark:text-white leading-tight">
              Potenciá tu Setup a un máximo nivel
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto md:mx-0">
              Encontrá los mejores componentes informáticos, de la mejor calidad, envíos a todo el país y las mejores promociones.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="#productos"
                className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-500 shadow-lg shadow-blue-600/20"
              >
                Ver Catálogo
              </a>
              <a
                href="#categorias"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Explorar Categorías
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80"
                alt="Hardware de PC"
                className="h-64 sm:h-80 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* categorias destacadas */}

        <section id="categorias" className="space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Categorías Destacadas</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Buscá productos según tu necesidad.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <div
                key={cat.id}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="text-4xl mb-3">{cat.icono}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {cat.nombre}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.count}</p>
              </div>
            ))}
          </div>
        </section>

        {/* productos destacados */}

        <section id="productos" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Productos Destacados</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Productos más vendidos y productos nuevos.</p>
            </div>
          </div>

          {cargando ? (
            <div className="flex justify-center py-12">
              <p className="text-sm font-medium text-slate-500 animate-pulse">
                Cargando productos desde la base de datos...
              </p>
            </div>
          ) : productos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
              <p className="text-sm text-slate-500">No se encontraron productos registrados en la seed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productos.map((prod) => {
                const titulo = prod.name || prod.nombre || prod.titulo || prod.title || 'Producto sin nombre';
                const precio = Number(prod.precio || prod.price || 0);
                const imagen =
                  prod.imagen ||
                  prod.imagen_url ||
                  prod.image_url ||
                  prod.image ||
                  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60';

                const descuento = obtenerDescuento(prod.category);
                const precioFinal = descuento > 0
                  ? Number((precio * (1 - descuento / 100)).toFixed(2))
                  : precio;

                return (
                  <div
                    key={prod.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                        <img
                          src={imagen}
                          alt={titulo}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60';
                          }}
                        />
                        {descuento > 0 && (
                          <span className="absolute top-3 right-3 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                            -{descuento}%
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">
                          {titulo}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                            ${precioFinal.toLocaleString('es-AR')}
                          </p>
                          {descuento > 0 && (
                            <p className="text-xs font-semibold text-slate-400 line-through">
                              ${precio.toLocaleString('es-AR')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 cursor-pointer">
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}