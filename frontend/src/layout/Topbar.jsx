import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Bell, Package, ShoppingCart, ArrowLeftRight, AlertTriangle, X } from 'lucide-react';
import { api } from '../services/api';

function matches(value, query) {
  return String(value ?? '').toLocaleLowerCase().includes(query);
}

export default function Topbar({ title, subtitle }) {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('wm-theme') || 'dark');
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const [notificationsError, setNotificationsError] = useState('');
  const [readNotifications, setReadNotifications] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wm-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setQuery('');
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2 || records) return;
    let active = true;
    setSearching(true);
    setSearchError('');
    Promise.all([api.productos.listar(), api.pedidos.listar(), api.movimientos.listar()])
      .then(([productos, pedidos, movimientos]) => {
        if (active) setRecords({ productos, pedidos, movimientos });
      })
      .catch(() => active && setSearchError('No se pudo realizar la búsqueda.'))
      .finally(() => active && setSearching(false));
    return () => { active = false; };
  }, [query, records]);

  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (term.length < 2 || !records) return [];
    return [
      ...records.productos.filter((item) => matches(item.nombre, term) || matches(item.id, term)).slice(0, 4).map((item) => ({
        id: `producto-${item.id}`, label: item.nombre, detail: `Producto · ${item.stock_actual} uds`, to: '/productos', icon: Package,
      })),
      ...records.pedidos.filter((item) => matches(item.id, term) || matches(item.estado, term) || matches(item.usuario?.nombre, term)).slice(0, 3).map((item) => ({
        id: `pedido-${item.id}`, label: `Pedido #${item.id}`, detail: `Estado: ${item.estado}`, to: '/pedidos', icon: ShoppingCart,
      })),
      ...records.movimientos.filter((item) => matches(item.id, term) || matches(item.tipo, term) || matches(item.producto?.nombre, term)).slice(0, 3).map((item) => ({
        id: `movimiento-${item.id}`, label: item.producto?.nombre || `Movimiento #${item.id}`, detail: `${item.tipo} · ${item.cantidad} uds`, to: '/movimientos', icon: ArrowLeftRight,
      })),
    ].slice(0, 8);
  }, [query, records]);

  const loadNotifications = async () => {
    if (notifications) return;
    setNotificationsError('');
    try {
      const summary = await api.dashboard.resumen();
      setNotifications([
        ...(summary.productosBajos || []).map((product) => ({
          id: `stock-${product.id}`, title: `${product.nombre} tiene stock bajo`, description: `Quedan ${product.stock_actual} unidades.`, to: '/productos', tone: 'danger',
        })),
        ...(summary.pedidosPendientes ? [{
          id: 'pedidos-pendientes', title: `${summary.pedidosPendientes} pedido(s) por procesar`, description: 'Revisa la cola de pedidos pendientes.', to: '/pedidos', tone: 'warning',
        }] : []),
      ]);
    } catch {
      setNotificationsError('No se pudieron cargar las notificaciones.');
    }
  };

  const toggleNotifications = () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    if (nextOpen) {
      setReadNotifications(true);
      loadNotifications();
    }
  };

  const goTo = (to) => {
    setQuery('');
    navigate(to);
  };

  return (
    <header className="h-16 px-8 flex items-center gap-4 bg-base/60 backdrop-blur border-b border-line sticky top-0 z-20">
      <div className="flex-1 min-w-0">
        <h1 className="text-[15px] font-semibold text-fg leading-tight">{title}</h1>
        {subtitle && <p className="text-[12px] text-fg-muted">{subtitle}</p>}
      </div>

      <div className="relative hidden md:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint pointer-events-none" />
        <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && results[0]) goTo(results[0].to); }} placeholder="Buscar…  Ctrl+K" aria-label="Buscar productos, pedidos o movimientos" aria-expanded={query.trim().length >= 2} className="w-64 h-9 pl-9 pr-8 rounded-lg bg-elevated border border-line text-[13px] text-fg placeholder:text-fg-faint focus-ring" />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda" className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-faint hover:text-fg"><X size={14} /></button>}
        {query.trim().length >= 2 && (
          <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-line bg-elevated shadow-modal z-30">
            {searching && <p className="px-4 py-3 text-[12px] text-fg-muted">Buscando…</p>}
            {searchError && <p role="alert" className="px-4 py-3 text-[12px] text-danger">{searchError}</p>}
            {!searching && !searchError && results.length === 0 && <p className="px-4 py-3 text-[12px] text-fg-muted">No hay coincidencias.</p>}
            {results.map(({ id, label, detail, to, icon: Icon }) => <button key={id} type="button" onClick={() => goTo(to)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-subtle transition"><Icon size={15} className="text-accent shrink-0" /><span className="min-w-0"><span className="block text-[12px] text-fg truncate">{label}</span><span className="block text-[11px] text-fg-muted truncate">{detail}</span></span></button>)}
          </div>
        )}
      </div>

      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Cambiar tema" className="size-9 grid place-items-center rounded-lg border border-line bg-elevated text-fg-muted hover:text-fg hover:border-line-strong transition focus-ring">{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</button>

      <div ref={menuRef} className="relative">
        <button type="button" onClick={toggleNotifications} aria-label="Abrir notificaciones" aria-expanded={notificationsOpen} className="relative size-9 grid place-items-center rounded-lg border border-line bg-elevated text-fg-muted hover:text-fg hover:border-line-strong transition focus-ring"><Bell size={15} />{!readNotifications && <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-danger" />}</button>
        {notificationsOpen && (
          <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-line bg-elevated shadow-modal z-30">
            <div className="px-4 py-3 border-b border-line"><p className="text-[13px] font-semibold text-fg">Notificaciones</p></div>
            {notifications === null && !notificationsError && <p className="px-4 py-4 text-[12px] text-fg-muted">Cargando…</p>}
            {notificationsError && <p role="alert" className="px-4 py-4 text-[12px] text-danger">{notificationsError}</p>}
            {notifications?.length === 0 && <p className="px-4 py-4 text-[12px] text-fg-muted">No hay alertas pendientes.</p>}
            {notifications?.map((notification) => <button key={notification.id} type="button" onClick={() => { setNotificationsOpen(false); navigate(notification.to); }} className="w-full flex gap-3 px-4 py-3 text-left hover:bg-subtle transition border-b border-line last:border-0"><AlertTriangle size={16} className={notification.tone === 'danger' ? 'text-danger shrink-0' : 'text-warning shrink-0'} /><span><span className="block text-[12px] text-fg">{notification.title}</span><span className="block mt-0.5 text-[11px] text-fg-muted">{notification.description}</span></span></button>)}
          </div>
        )}
      </div>
    </header>
  );
}
