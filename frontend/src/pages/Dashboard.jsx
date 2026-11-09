import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, TrendingUp, ShoppingCart, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Activity, ChevronRight,
} from 'lucide-react';
import StatCard from '../ui/StatCard';
import Badge from '../ui/Badge';
import { api } from '../services/api';

function getMovementTrend(movements) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    return {
      date,
      key,
      label: new Intl.DateTimeFormat('es-MX', { weekday: 'short' }).format(date).replace('.', ''),
      entradas: 0,
      salidas: 0,
    };
  });
  const daysByKey = new Map(days.map((day) => [day.key, day]));

  movements.forEach((movement) => {
    const date = new Date(movement.fecha);
    const quantity = Number(movement.cantidad);
    if (Number.isNaN(date.getTime()) || !Number.isFinite(quantity) || quantity < 0) return;

    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const day = daysByKey.get(key);
    if (!day) return;

    if (movement.tipo === 'entrada') day.entradas += quantity;
    if (movement.tipo === 'salida') day.salidas += quantity;
  });

  return days;
}

function TrendChart({ days }) {
  const maxValue = Math.max(1, ...days.flatMap(({ entradas, salidas }) => [entradas, salidas]));
  const points = days.map((day, index) => ({
    ...day,
    x: 44 + (index * 112),
    yEntrada: 156 - ((day.entradas / maxValue) * 124),
    ySalida: 156 - ((day.salidas / maxValue) * 124),
  }));
  const hasMovements = points.some(({ entradas, salidas }) => entradas > 0 || salidas > 0);
  const entryLine = points.map(({ x, yEntrada }) => `${x},${yEntrada}`).join(' ');
  const exitLine = points.map(({ x, ySalida }) => `${x},${ySalida}`).join(' ');

  if (!hasMovements) {
    return (
      <div className="h-[210px] flex flex-col items-center justify-center gap-2 text-center">
        <Activity size={21} className="text-fg-faint" />
        <p className="text-[13px] text-fg-muted">Aún no hay movimientos para mostrar</p>
        <p className="text-[11px] text-fg-faint">La tendencia aparecerá cuando se registren entradas o salidas.</p>
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 760 194"
      role="img"
      aria-label="Entradas y salidas de inventario durante los últimos siete días"
      className="w-full h-[210px] overflow-visible"
    >
      {[32, 73, 114, 155].map((y) => (
        <line key={y} x1="30" x2="732" y1={y} y2={y} className="dashboard-chart-grid" />
      ))}
      <polyline points={entryLine} fill="none" className="dashboard-chart-entry" />
      <polyline points={exitLine} fill="none" className="dashboard-chart-exit" />
      {points.map((point) => (
        <g key={point.key}>
          <circle cx={point.x} cy={point.yEntrada} r="3.5" className="dashboard-chart-entry-point">
            <title>{point.label}: {point.entradas.toLocaleString()} unidades de entrada</title>
          </circle>
          <circle cx={point.x} cy={point.ySalida} r="3.5" className="dashboard-chart-exit-point">
            <title>{point.label}: {point.salidas.toLocaleString()} unidades de salida</title>
          </circle>
          <text x={point.x} y="184" textAnchor="middle" className="dashboard-chart-label">{point.label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const summary = await api.dashboard.resumen();
        if (!active) return;
        setData(summary);
        setUpdatedAt(new Date());
        setError('');
      } catch (loadError) {
        if (active) setError(loadError.message);
      }
    };

    load();
    const interval = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [retry]);

  if (!data) {
    if (error) {
      return (
        <section className="space-y-3">
          <h2 className="text-[22px] font-semibold text-fg">No se pudo cargar el dashboard</h2>
          <p role="alert" className="text-[13px] text-danger">{error}</p>
          <button type="button" onClick={() => setRetry((value) => value + 1)} className="text-[13px] font-medium text-accent hover:text-accent-hover">
            Intentar de nuevo
          </button>
        </section>
      );
    }

    return (
      <div className="space-y-6" aria-label="Cargando resumen del almacén">
        <div className="h-14 rounded-xl bg-elevated border border-line animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-28 rounded-xl bg-elevated border border-line animate-pulse" />)}
        </div>
        <div className="h-80 rounded-xl bg-elevated border border-line animate-pulse" />
      </div>
    );
  }

  const movements = data.movimientosRecientes || [];
  const trendDays = getMovementTrend(movements);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-accent mb-1">Centro de control</p>
          <h2 className="text-[22px] font-semibold text-fg tracking-tight">Resumen del almacén</h2>
          <p className="text-[13px] text-fg-muted mt-1">
            Inventario y operación · actualizado {updatedAt?.toLocaleTimeString('es-MX') || '—'} · refresco cada 30 s
          </p>
        </div>
        <Badge tone={error ? 'warning' : 'success'}>
          {error ? 'Datos desactualizados' : '● Sistema operativo'}
        </Badge>
      </div>

      {error && <p role="alert" className="text-[13px] text-danger">No se pudo actualizar el dashboard: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Productos" value={data.totalProductos} icon={Package} tone="accent" to="/productos" />
        <StatCard label="Stock total" value={data.stockTotal.toLocaleString()} unit="uds" icon={TrendingUp} tone="success" to="/productos" />
        <StatCard label="Pedidos pendientes" value={data.pedidosPendientes} icon={ShoppingCart} tone="warning" to="/pedidos" />
        <StatCard label="Stock bajo" value={data.stockBajo} icon={AlertTriangle} tone="danger" to="/inventario-critico" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.8fr)] gap-4">
        <section className="dashboard-panel rounded-2xl border border-line shadow-card min-w-0">
          <div className="px-5 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-line">
            <div>
              <h3 className="text-[14px] font-semibold text-fg">Flujo de movimientos</h3>
              <p className="text-[11px] text-fg-muted mt-0.5">Unidades registradas en los últimos 7 días</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-fg-muted">
              <span className="inline-flex items-center gap-1.5"><i className="dashboard-legend-entry" />Entradas</span>
              <span className="inline-flex items-center gap-1.5"><i className="dashboard-legend-exit" />Salidas</span>
            </div>
          </div>

          <div className="px-3 sm:px-5 pt-3">
            <TrendChart days={trendDays} />
          </div>

          <div className="px-5 sm:px-6 py-3 border-t border-line flex items-center justify-between gap-3">
            <p className="text-[11px] text-fg-muted">
              {movements.length
                ? `${movements.length} movimientos recientes`
                : 'Sin actividad reciente'}
            </p>
            <Link to="/movimientos" className="inline-flex items-center gap-1 text-[12px] text-accent hover:text-accent-hover font-medium">
              Ver movimientos <ChevronRight size={14} />
            </Link>
          </div>

          {movements.length > 0 && (
            <ul className="divide-y divide-line border-t border-line">
              {movements.slice(0, 3).map((movement) => (
                <li key={movement.id} className="flex items-center gap-3 px-5 sm:px-6 py-3 hover:bg-subtle/40 transition">
                  <div className={`size-8 rounded-lg grid place-items-center shrink-0 ${movement.tipo === 'entrada' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {movement.tipo === 'entrada' ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-fg truncate">
                      <span className="font-medium capitalize">{movement.tipo}</span>
                      {movement.producto?.nombre && <> · {movement.producto.nombre}</>}
                    </p>
                    <p className="text-[10px] text-fg-muted mono">{movement.fecha}</p>
                  </div>
                  <span className="text-[12px] text-fg mono">{Number(movement.cantidad).toLocaleString()} uds</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard-panel rounded-2xl border border-line shadow-card">
          <div className="px-5 h-14 flex items-center justify-between border-b border-line">
            <div>
              <h3 className="text-[14px] font-semibold text-fg">Alertas de stock</h3>
              <p className="text-[11px] text-fg-muted">Productos que requieren atención</p>
            </div>
            <Badge tone="danger">{data.stockBajo}</Badge>
          </div>
          <ul className="divide-y divide-line">
            {(data.productosBajos || []).slice(0, 6).map((product) => (
              <li key={product.id} className="px-5 py-3">
                <p className="text-[12px] text-fg truncate">{product.nombre}</p>
                <p className="text-[11px] text-fg-muted mt-0.5">
                  Existencia <span className="mono text-danger font-medium">{product.stock_actual}</span> unidades
                </p>
              </li>
            ))}
            {(!data.productosBajos || data.productosBajos.length === 0) && (
              <li className="px-5 py-12 text-center">
                <div className="mx-auto mb-2 size-9 rounded-full bg-success/10 text-success grid place-items-center">
                  <Package size={17} />
                </div>
                <p className="text-[12px] text-fg-muted">Todo el stock está en orden</p>
              </li>
            )}
          </ul>
          <div className="px-5 py-3 border-t border-line">
            <Link to="/inventario-critico" className="inline-flex items-center gap-1 text-[12px] text-accent hover:text-accent-hover font-medium">
              Revisar inventario <ChevronRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
