const PERMISSIONS = [
  { area: 'Usuarios, roles y seguridad', admin: 'Administrar', supervisor: 'Sin acceso', operador: 'Sin acceso' },
  { area: 'Configuración global e integraciones ERP', admin: 'Pendiente del módulo', supervisor: 'No disponible', operador: 'No disponible' },
  { area: 'Auditoría de inventario', admin: 'Consultar y registrar', supervisor: 'Sin acceso', operador: 'Sin acceso' },
  { area: 'Logs de eventos del sistema', admin: 'Pendiente del módulo', supervisor: 'Sin acceso', operador: 'Sin acceso' },
  { area: 'Datos maestros del almacén', admin: 'Administrar', supervisor: 'Solo lectura operativa', operador: 'Sin acceso' },
  { area: 'Stock y catálogo de productos', admin: 'Administrar', supervisor: 'Consultar y validar ajustes', operador: 'Solo lectura de existencias' },
  { area: 'Recepción, picking, packing y envíos', admin: 'Sin operación diaria', supervisor: 'Gestionar flujo', operador: 'Ejecutar tareas' },
  { area: 'Incidencias', admin: 'Administrar', supervisor: 'Resolver', operador: 'Reportar' },
  { area: 'Dashboard y métricas operativas', admin: 'Administrar el sistema', supervisor: 'Indicadores en tiempo real', operador: 'Sin acceso' },
  { area: 'Turnos y flujo operativo', admin: 'Administrar', supervisor: 'Gestionar y validar', operador: 'Sin acceso' },
];

const ROLES = [
  { key: 'admin', label: 'Admin', focus: 'Infraestructura, seguridad y configuración' },
  { key: 'supervisor', label: 'Supervisor', focus: 'Control de flujo, excepciones y productividad' },
  { key: 'operador', label: 'Operario', focus: 'Ejecución física de tareas' },
];

export default function RoleMatrix() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-accent">Mínimo privilegio</p>
        <h2 className="mt-1 text-[24px] font-semibold text-fg">Matriz de roles WMS</h2>
        <p className="mt-2 text-[13px] text-fg-muted">
          Los permisos se aplican también en la API; ocultar una opción en la interfaz no concede ni revoca acceso.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {ROLES.map(({ key, label, focus }) => (
          <article key={key} className="rounded-xl border border-line bg-elevated p-4">
            <h3 className="text-[14px] font-semibold text-fg">{label}</h3>
            <p className="mt-1 text-[12px] text-fg-muted">{focus}</p>
          </article>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-elevated shadow-card">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-line bg-subtle/60">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-fg-muted">Módulo</th>
              {ROLES.map(({ key, label }) => (
                <th key={key} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-fg-muted">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map(({ area, ...access }) => (
              <tr key={area} className="border-b border-line/60 last:border-0">
                <th scope="row" className="px-4 py-3 font-medium text-fg">{area}</th>
                {ROLES.map(({ key }) => (
                  <td key={key} className="px-4 py-3 text-fg-muted">{access[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-[12px] text-fg-muted">
        ERP, configuración global, logs de eventos, aprobación formal de ajustes, reasignación de tareas y reportes individuales de rendimiento todavía no tienen módulos implementados en este proyecto. La matriz limita el acceso a las funciones que sí existen; no representa esas funciones pendientes como disponibles.
      </p>
    </section>
  );
}
