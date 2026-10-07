import AdminSidebar from '../../pages/admin/AdminSidebar.jsx';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* barra lateral */}
      <AdminSidebar />
      {/* contenido principal - subruta */}
      <main className="flex-1 p-6 md:p-8 overflow-x-auto">
        {children}
      </main>
    </div>
  );
}