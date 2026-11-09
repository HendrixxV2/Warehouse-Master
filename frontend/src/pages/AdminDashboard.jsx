import { Link } from 'react-router-dom';
import { ArrowUpRight, Shield, Users, Package, ClipboardCheck } from 'lucide-react';

const SECTIONS = [
  {
    to: '/admin/usuarios',
    title: 'Usuarios',
    description: 'Administra cuentas, roles y acceso al sistema.',
    icon: Users,
  },
  {
    to: '/admin/permisos',
    title: 'Matriz de roles',
    description: 'Consulta los accesos efectivos de Admin, Supervisor y Operario.',
    icon: Shield,
  },
  {
    to: '/admin/productos',
    title: 'Datos maestros',
    description: 'Administra catálogo de productos y parámetros de almacén.',
    icon: Package,
  },
  {
    to: '/admin/auditorias',
    title: 'Auditoría',
    description: 'Consulta registros de auditoría del almacén.',
    icon: ClipboardCheck,
  },
];

export default function AdminDashboard() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-accent">Administración</p>
        <h2 className="mt-1 text-[24px] font-semibold text-fg">Control de acceso</h2>
        <p className="mt-2 text-[13px] text-fg-muted">
          Este panel está separado de las herramientas operativas del almacén.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map(({ to, title, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl bg-elevated border border-line p-5 hover:border-accent/40 transition"
          >
            <div className="flex items-start justify-between">
              <span className="grid size-10 place-items-center rounded-lg bg-accent/10 text-accent">
                <Icon size={19} />
              </span>
              <ArrowUpRight size={17} className="text-fg-faint group-hover:text-accent transition" />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-fg">{title}</h3>
            <p className="mt-1 text-[12px] text-fg-muted">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
