import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, ArrowLeftRight, ShoppingCart, Boxes,
  Truck, Tags, Warehouse, Users, Boxes as Logo,
} from 'lucide-react';

const NAV = [
  { section: 'Operaciones' },
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/productos',   icon: Package,         label: 'Productos' },
  { to: '/movimientos', icon: ArrowLeftRight,  label: 'Movimientos' },
  { to: '/pedidos',     icon: ShoppingCart,    label: 'Pedidos' },
  { to: '/detalles',    icon: Boxes,           label: 'Detalles' },
  { section: 'Catálogo' },
  { to: '/proveedores', icon: Truck,           label: 'Proveedores' },
  { to: '/categorias',  icon: Tags,            label: 'Categorías' },
  { to: '/almacenes',   icon: Warehouse,       label: 'Almacenes' },
  { to: '/usuarios',    icon: Users,           label: 'Usuarios' },
];

export default function Sidebar() {
  return (
    <aside className="w-[248px] shrink-0 h-screen sticky top-0 flex flex-col bg-sidebar-bg border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center gap-3 border-b border-sidebar-border">
        <div className="size-8 rounded-lg bg-accent grid place-items-center text-white">
          <Logo size={18} strokeWidth={2.4} />
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-sidebar-active">Warehouse</p>
          <p className="text-[11px] text-sidebar-text">Master · WMS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV.map((item, i) =>
          item.section ? (
            <p key={i} className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-[0.08em] font-semibold text-sidebar-text/60">
              {item.section}
            </p>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition
                 ${isActive
                   ? 'bg-sidebar-accent text-sidebar-active'
                   : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-accent" />}
                  <item.icon size={16} strokeWidth={2} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          )
        )}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-hover transition cursor-pointer">
          <div className="size-8 rounded-full bg-gradient-to-br from-accent to-info grid place-items-center text-white text-[12px] font-semibold">
            OP
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-sidebar-active truncate">Operador Demo</p>
            <p className="text-[11px] text-sidebar-text truncate">Sin sesión · modo libre</p>
          </div>
        </div>
      </div>
    </aside>
  );
}