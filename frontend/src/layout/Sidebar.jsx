import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ArrowLeftRight, ShoppingCart, Boxes,
  Truck, Tags, Warehouse, Users, Boxes as Logo, LogOut,
  MapPin, ClipboardList, FileText, CalendarDays, BellRing,
  ShieldCheck, CircleDollarSign, PackageCheck, Building2,
  ChevronDown, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SECTIONS = [
  {
    title: 'Operaciones',
    links: [
      { to: '/productos', icon: Package, label: 'Productos' },
      { to: '/movimientos', icon: ArrowLeftRight, label: 'Movimientos' },
      { to: '/pedidos', icon: ShoppingCart, label: 'Pedidos' },
      { to: '/detalles', icon: Boxes, label: 'Detalles' },
      { to: '/clientes', icon: Users, label: 'Clientes' },
      { to: '/paquetes', icon: PackageCheck, label: 'Paquetes' },
      { to: '/pedidos-internos', icon: ClipboardList, label: 'Pedidos internos' },
    ],
  },
  {
    title: 'Inventario',
    links: [
      { to: '/almacenes', icon: Warehouse, label: 'Almacenes' },
      { to: '/ubicaciones', icon: MapPin, label: 'Ubicaciones' },
      { to: '/lotes', icon: FileText, label: 'Lotes' },
      { to: '/inventario-critico', icon: BellRing, label: 'Inventario crítico' },
      { to: '/etiquetas', icon: Tags, label: 'Etiquetas' },
      { to: '/auditorias', icon: ShieldCheck, label: 'Auditorías' },
    ],
  },
  {
    title: 'Compras y costos',
    links: [
      { to: '/proveedores', icon: Truck, label: 'Proveedores' },
      { to: '/categorias', icon: Tags, label: 'Categorías' },
      { to: '/ordenes-compra', icon: ClipboardList, label: 'Órdenes de compra' },
      { to: '/recepciones', icon: Building2, label: 'Recepciones' },
      { to: '/contratos', icon: FileText, label: 'Contratos' },
      { to: '/tarifas', icon: CircleDollarSign, label: 'Tarifas' },
      { to: '/costos', icon: CircleDollarSign, label: 'Costos' },
    ],
  },
  {
    title: 'Personas y control',
    links: [
      { to: '/usuarios', icon: Users, label: 'Usuarios' },
      { to: '/transportistas', icon: Truck, label: 'Transportistas' },
      { to: '/turnos', icon: CalendarDays, label: 'Turnos' },
      { to: '/incidencias', icon: BellRing, label: 'Incidencias' },
      { to: '/permisos', icon: ShieldCheck, label: 'Permisos' },
    ],
  },
];

function getActiveSection(pathname) {
  return SECTIONS.find((section) =>
    section.links.some(({ to }) => pathname === to || pathname.startsWith(`${to}/`))
  )?.title;
}

function NavigationLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
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
          <Icon size={16} strokeWidth={2} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeSection = getActiveSection(pathname);
  const [expandedSection, setExpandedSection] = useState(activeSection);

  useEffect(() => {
    if (activeSection) setExpandedSection(activeSection);
  }, [activeSection]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-[248px] shrink-0 h-screen sticky top-0 flex flex-col bg-sidebar-bg border-r border-sidebar-border">
      <div className="px-5 h-16 flex items-center gap-3 border-b border-sidebar-border">
        <div className="size-8 rounded-lg bg-accent grid place-items-center text-white">
          <Logo size={18} strokeWidth={2.4} />
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-sidebar-active">Warehouse</p>
          <p className="text-[11px] text-sidebar-text">Master · WMS</p>
        </div>
      </div>

      <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        <NavigationLink to="/" icon={LayoutDashboard} label="Dashboard" />

        <div className="pt-2 space-y-1">
          {SECTIONS.map(({ title, links }) => {
            const isExpanded = expandedSection === title;
            const isActive = activeSection === title;
            const sectionId = `sidebar-section-${title.replace(/\s+/g, '-').toLowerCase()}`;
            const Chevron = isExpanded ? ChevronDown : ChevronRight;

            return (
              <section key={title}>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={sectionId}
                  onClick={() => setExpandedSection(isExpanded ? null : title)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[11px] uppercase tracking-[0.07em] font-semibold transition
                    ${isActive ? 'text-sidebar-active' : 'text-sidebar-text/70 hover:text-sidebar-active hover:bg-sidebar-hover'}`}
                >
                  <Chevron size={14} strokeWidth={2.4} className="shrink-0" />
                  <span className="flex-1">{title}</span>
                  <span className="text-[10px] font-medium normal-case tracking-normal text-sidebar-text/60">{links.length}</span>
                </button>
                {isExpanded && (
                  <div id={sectionId} className="ml-2 pl-2 border-l border-sidebar-border space-y-0.5">
                    {links.map((link) => <NavigationLink key={link.to} {...link} />)}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button
          type="button"
          className="w-full flex items-center gap-3 p-2 rounded-lg text-left hover:bg-sidebar-hover transition"
          onClick={handleLogout}
          aria-label={`Cerrar sesión de ${user?.nombre || 'Usuario'}`}
        >
          <div className="size-8 rounded-full bg-gradient-to-br from-accent to-info grid place-items-center text-white text-[12px] font-semibold">
            {user?.nombre?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-sidebar-active truncate">
              {user?.nombre || 'Usuario'}
            </p>
            <p className="text-[11px] text-sidebar-text truncate capitalize">
              {user?.rol || '—'} · sesión activa
            </p>
          </div>
          <LogOut size={14} className="text-sidebar-text/60 transition ml-2" />
        </button>
      </div>
    </aside>
  );
}
