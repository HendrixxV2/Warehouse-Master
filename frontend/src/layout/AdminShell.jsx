import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, LogOut, Shield, Users, Package, Truck, Tags,
  Warehouse, ClipboardCheck, FileText, CircleDollarSign,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/admin', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/permisos', label: 'Matriz de roles', icon: Shield },
  { to: '/admin/auditorias', label: 'Auditoría', icon: ClipboardCheck },
  { to: '/admin/productos', label: 'Productos maestros', icon: Package },
  { to: '/admin/proveedores', label: 'Proveedores', icon: Truck },
  { to: '/admin/categorias', label: 'Categorías', icon: Tags },
  { to: '/admin/almacenes', label: 'Almacenes', icon: Warehouse },
  { to: '/admin/contratos', label: 'Contratos', icon: FileText },
  { to: '/admin/tarifas', label: 'Tarifas', icon: CircleDollarSign },
  { to: '/admin/costos', label: 'Costos', icon: CircleDollarSign },
];

export default function AdminShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-base">
      <aside className="w-[248px] shrink-0 h-screen sticky top-0 flex flex-col bg-sidebar-bg border-r border-sidebar-border">
        <div className="px-5 h-16 flex items-center gap-3 border-b border-sidebar-border">
          <img
            src="/warehouse-master-logo.jpeg"
            alt="Logo de Warehouse Master"
            className="size-12 shrink-0 rounded-full object-cover ring-1 ring-sidebar-border"
          />
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-sidebar-active">Warehouse</p>
            <p className="text-[11px] text-sidebar-text">Administración</p>
          </div>
        </div>

        <nav aria-label="Navegación de administración" className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (
                `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-active'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active'
                }`
              )}
            >
              <Icon size={16} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            type="button"
            className="w-full flex items-center gap-3 p-2 rounded-lg text-left hover:bg-sidebar-hover transition"
            onClick={handleLogout}
            aria-label={`Cerrar sesión de ${user?.nombre || 'Administrador'}`}
          >
            <div className="size-8 rounded-full bg-gradient-to-br from-accent to-info grid place-items-center text-white text-[12px] font-semibold">
              {user?.nombre?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-sidebar-active truncate">
                {user?.nombre || 'Administrador'}
              </p>
              <p className="text-[11px] text-sidebar-text truncate">Administrador · sesión activa</p>
            </div>
            <LogOut size={14} className="text-sidebar-text/60 ml-2" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-8 flex items-center bg-base/60 backdrop-blur border-b border-line sticky top-0 z-20">
          <div>
            <h1 className="text-[15px] font-semibold text-fg leading-tight">Panel de administración</h1>
            <p className="text-[12px] text-fg-muted">Seguridad, configuración y datos maestros</p>
          </div>
        </header>
        <main className="flex-1 px-8 py-8">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
