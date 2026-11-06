import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Bot, LoaderCircle, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { api } from '../services/api';

const ROUTES = [
  { terms: ['producto', 'catalogo', 'catálogo'], to: '/productos', label: 'Productos' },
  { terms: ['movimiento', 'entrada', 'salida'], to: '/movimientos', label: 'Movimientos' },
  { terms: ['pedido', 'orden'], to: '/pedidos', label: 'Pedidos' },
  { terms: ['almacen', 'almacén', 'bodega'], to: '/almacenes', label: 'Almacenes' },
  { terms: ['proveedor'], to: '/proveedores', label: 'Proveedores' },
  { terms: ['cliente'], to: '/clientes', label: 'Clientes' },
  { terms: ['ubicacion', 'ubicación'], to: '/ubicaciones', label: 'Ubicaciones' },
  { terms: ['inventario critico', 'inventario crítico', 'stock bajo'], to: '/inventario-critico', label: 'Inventario crítico' },
  { terms: ['reporte', 'resumen', 'dashboard'], to: '/', label: 'Dashboard' },
];

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function findRoute(message) {
  const text = normalize(message);
  return ROUTES.find(({ terms }) => terms.some((term) => text.includes(normalize(term))));
}

function AssistantMessage({ message, onNavigate }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <span className="mt-0.5 size-6 shrink-0 rounded-lg bg-accent-muted text-accent grid place-items-center"><Sparkles size={13} /></span>}
      <div className={`max-w-[82%] rounded-2xl px-3 py-2.5 text-[12px] leading-relaxed ${isUser ? 'bg-accent text-white rounded-tr-sm' : 'bg-subtle text-fg rounded-tl-sm'}`}>
        <p>{message.text}</p>
        {message.action && (
          <button type="button" onClick={() => onNavigate(message.action.to)} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent-hover transition">
            {message.action.label}<ArrowUpRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function TaskAssistant() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: 'Hola, soy el asistente de Warehouse Master. Pídeme revisar el stock bajo, buscar un producto, consultar pedidos pendientes o abrir una sección.',
  }]);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, loading]);

  const addAssistantMessage = (message) => setMessages((current) => [...current, { role: 'assistant', ...message }]);

  const submit = async (event) => {
    event.preventDefault();
    const request = input.trim();
    if (!request || loading) return;

    setMessages((current) => [...current, { role: 'user', text: request }]);
    setInput('');
    setLoading(true);

    try {
      const text = normalize(request);
      const isStockRequest = /stock|inventario|existencia/.test(text) && /bajo|critico|critico|revis|alert/.test(text);
      const isPendingOrdersRequest = /pedido|orden/.test(text) && /pendiente|pendientes|procesar|cola/.test(text);
      const isProductSearch = /buscar|encuentra|localiza|ver/.test(text) && /producto|articulo|articulo/.test(text);

      if (isStockRequest || isPendingOrdersRequest) {
        const summary = await api.dashboard.resumen();
        if (isStockRequest) {
          const lowProducts = (summary.productosBajos || []).slice(0, 3);
          const details = lowProducts.length
            ? ` Productos con alerta: ${lowProducts.map((item) => `${item.nombre} (${item.stock_actual} uds)`).join(', ')}.`
            : ' No hay productos listados con alerta en este momento.';
          addAssistantMessage({
            text: `Hay ${summary.stockBajo ?? lowProducts.length} producto(s) con stock bajo.${details}`,
            action: { to: '/inventario-critico', label: 'Ver inventario crítico' },
          });
        } else {
          addAssistantMessage({
            text: `Tienes ${summary.pedidosPendientes ?? 0} pedido(s) pendiente(s) por procesar.`,
            action: { to: '/pedidos', label: 'Abrir pedidos' },
          });
        }
      } else if (isProductSearch) {
        const products = await api.productos.listar();
        const query = text
          .replace(/buscar|encuentra|localiza|ver|producto|articulo|el|la|los|las|de|por|nombre|un|una/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const matches = query ? products.filter((product) => normalize(product.nombre || '').includes(query)).slice(0, 3) : products.slice(0, 3);
        addAssistantMessage({
          text: matches.length
            ? `Encontré: ${matches.map((product) => `${product.nombre} (${product.stock_actual} uds)`).join(', ')}.`
            : 'No encontré productos que coincidan. Puedes probar con una parte del nombre.',
          action: { to: '/productos', label: 'Ver catálogo' },
        });
      } else {
        const route = findRoute(request);
        if (route) {
          addAssistantMessage({ text: `Puedo ayudarte con ${route.label}. Te llevaré a esa sección para continuar la tarea.`, action: route });
        } else {
          addAssistantMessage({
            text: 'Puedo consultar stock bajo y pedidos pendientes, buscar productos y abrir secciones. Por ejemplo: “¿Qué productos tienen stock bajo?” o “Busca producto tornillo”.',
          });
        }
      }
    } catch {
      addAssistantMessage({ text: 'No pude consultar los datos ahora mismo. Comprueba la conexión con la API e inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const goTo = (to) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <section aria-label="Asistente de tareas" className="mb-3 flex h-[460px] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-line bg-elevated shadow-modal">
          <header className="flex items-center gap-3 border-b border-line px-4 py-3">
            <span className="size-8 rounded-xl bg-accent-muted text-accent grid place-items-center"><Bot size={17} /></span>
            <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-fg">Asistente de tareas</p><p className="text-[11px] text-fg-muted">Consultas en lenguaje natural</p></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar asistente" className="size-7 grid place-items-center rounded-lg text-fg-faint hover:bg-subtle hover:text-fg transition"><X size={16} /></button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => <AssistantMessage key={`${message.role}-${index}`} message={message} onNavigate={goTo} />)}
            {loading && <div className="flex items-center gap-2 text-[11px] text-fg-muted"><LoaderCircle size={14} className="animate-spin text-accent" />Consultando datos…</div>}
            <div ref={endRef} />
          </div>

          <form onSubmit={submit} className="border-t border-line p-3">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-base px-3 py-1.5 focus-within:border-accent">
              <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Escribe una solicitud…" aria-label="Solicitud para el asistente" className="h-8 min-w-0 flex-1 bg-transparent text-[12px] text-fg outline-none placeholder:text-fg-faint" />
              <button type="submit" disabled={!input.trim() || loading} aria-label="Enviar solicitud" className="size-8 shrink-0 rounded-lg bg-accent text-white grid place-items-center hover:bg-accent-hover transition disabled:opacity-50"><Send size={14} /></button>
            </div>
          </form>
        </section>
      )}
      <button type="button" onClick={() => setOpen((current) => !current)} aria-label={open ? 'Cerrar asistente de tareas' : 'Abrir asistente de tareas'} aria-expanded={open} className="size-12 rounded-full bg-accent text-white grid place-items-center shadow-modal hover:bg-accent-hover transition focus-ring">
        {open ? <X size={20} /> : <MessageCircle size={21} />}
      </button>
    </div>
  );
}
