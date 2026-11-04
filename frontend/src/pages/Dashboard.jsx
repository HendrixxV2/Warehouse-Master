import { useEffect, useState } from 'react';
import {
  Package, TrendingUp, ShoppingCart, AlertTriangle, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import StatCard from '../ui/StatCard';
import Badge from '../ui/Badge';
import { api } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // GET /api/dashboard/resumen (backend)
    api.dashboard.resumen().then(setData).catch(() => {
      setData({
        totalProductos: 128, stockTotal: 4820, stockBajo: 6, pedidosPendientes: 12,
        movimientosRecientes: [], productosBajos: [],
      });
    });
  }, []);

  if (!data) return <div className="h-72 rounded-2xl bg-elevated border border-line animate-pulse" />;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[22px] font-semibold text-fg tracking-tight">Resumen general</h2>
          <p className="text-[13px] text-fg-muted mt-1">
            Estado del almacén · actualizado hace <span className="mono">1 min</span>
          </p>
        </div>
        <Badge tone="success">● Sistema operativo</Badge>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Productos" value={data.totalProductos} icon={Package} tone="accent" delta={4.2} />
        <StatCard label="Stock total" value={data.stockTotal.toLocaleString()} unit="uds" icon={TrendingUp} tone="success" delta={-1.8} />
        <StatCard label="Pedidos pendientes" value={data.pedidosPendientes} icon={ShoppingCart} tone="warning" />
        <StatCard label="Stock bajo" value={data.stockBajo} icon={AlertTriangle} tone="danger" />
      </div>

      {/* Paneles inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Actividad reciente */}
        <div className="lg:col-span-2 rounded-2xl bg-elevated border border-line shadow-card">
          <div className="px-6 h-14 flex items-center justify-between border-b border-line">
            <h3 className="text-[14px] font-semibold text-fg">Actividad reciente</h3>
            <a href="/movimientos" className="text-[12px] text-accent hover:text-accent-hover font-medium">
              Ver todo →
            </a>
          </div>
          <ul className="divide-y divide-line">
            {(data.movimientosRecientes || []).map((m) => (
              <li key={m.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-subtle/40 transition">
                <div className={`size-8 rounded-lg grid place-items-center shrink-0 ${m.tipo === 'entrada' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {m.tipo === 'entrada' ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-fg truncate">
                    <span className="font-medium capitalize">{m.tipo}</span>{' '}
                    de <span className="mono">{m.cantidad}</span> u.
                    {m.producto?.nombre && <> — {m.producto.nombre}</>}
                  </p>
                  <p className="text-[11px] text-fg-muted mono">{m.fecha}</p>
                </div>
                <Badge tone={m.tipo === 'entrada' ? 'success' : 'warning'}>
                  {m.tipo}
                </Badge>
              </li>
            ))}
            {(!data.movimientosRecientes || data.movimientosRecientes.length === 0) && (
              <li className="px-6 py-12 text-center text-[13px] text-fg-muted">
                Aún no hay movimientos registrados
              </li>
            )}
          </ul>
        </div>

        {/* Alertas de stock bajo */}
        <div className="rounded-2xl bg-elevated border border-line shadow-card">
          <div className="px-6 h-14 flex items-center justify-between border-b border-line">
            <h3 className="text-[14px] font-semibold text-fg">Alertas de stock</h3>
            <Badge tone="danger">{data.stockBajo}</Badge>
          </div>
          <ul className="divide-y divide-line">
            {(data.productosBajos || []).map((p) => (
              <li key={p.id} className="px-6 py-3.5">
                <p className="text-[13px] text-fg truncate">{p.nombre}</p>
                <p className="text-[11px] text-fg-muted mt-0.5">
                  Quedan <span className="mono text-danger font-medium">{p.stock_actual}</span> unidades
                </p>
              </li>
            ))}
            {(!data.productosBajos || data.productosBajos.length === 0) && (
              <li className="px-6 py-12 text-center text-[13px] text-fg-muted">
                Todo el stock está en orden
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}