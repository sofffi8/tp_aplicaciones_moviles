// herramientas para navegar
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ClientRoute from "./components/auth/ClientRoute.jsx";
import AdminRoute from "./components/auth/AdminRoute.jsx";
import AdminRoleGuard from "./components/auth/AdminRoleGuard.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import LoginCliente from "./pages/LoginCliente.jsx";
import LoginAdmin from "./pages/LoginAdmin.jsx";
import ClienteDashboard from "./pages/ClienteDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProductos from "./pages/admin/AdminProductos.jsx";
import AdminUsuarios from "./pages/admin/AdminUsuarios.jsx";
import AdminReportes from "./pages/admin/AdminReportes.jsx";
import SinPermiso from "./pages/admin/SinPermiso.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* rutas públicas: , pagina principal, login cliente, login admin */}

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginCliente />} />
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* ruta cliente */}
          <Route
            path="/cliente/dashboard"
            element={
              <ClientRoute>
                <ClienteDashboard />
              </ClientRoute>
            }
          />

          {/* rutas admin */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/sin-permiso"
            element={
              <AdminRoute>
                <SinPermiso />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/usuarios"
            element={
              <AdminRoute>
                <AdminRoleGuard allowedRoles={["superadmin"]}>
                  <AdminLayout>
                    <AdminUsuarios />
                  </AdminLayout>
                </AdminRoleGuard>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/productos"
            element={
              <AdminRoute>
                <AdminRoleGuard
                  allowedRoles={["superadmin", "gestor_productos"]}
                >
                  <AdminLayout>
                    <AdminProductos />
                  </AdminLayout>
                </AdminRoleGuard>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/reportes"
            element={
              <AdminRoute>
                <AdminRoleGuard allowedRoles={["superadmin", "auditor"]}>
                  <AdminLayout>
                    <AdminReportes />
                  </AdminLayout>
                </AdminRoleGuard>
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
