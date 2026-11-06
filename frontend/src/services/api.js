const BASE = import.meta.env?.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'wm_token';

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function cerrarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('wm_user');
  window.location.reload();
}

async function request(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { ...headers, ...(opts.headers || {}) },
  });

  if (res.status === 401) {
    cerrarSesion();
    throw new Error('Sesión expirada. Inicia sesión de nuevo.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.errores?.join(' | ') || err.error || `HTTP ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}

const makeCrud = (path) => ({
  listar: (q = '') => request(`${path}${q}`),
  obtener: (id) => request(`${path}/${id}`),
  crear: (d) => request(path, { method: 'POST', body: JSON.stringify(d) }),
  actualizar: (id, d) => request(`${path}/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  eliminar: (id) => request(`${path}/${id}`, { method: 'DELETE' }),
});

export const api = {
  auth: {
    registro: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    me: () => request('/auth/me'),
  },
  productos: makeCrud('/productos'),
  movimientos: makeCrud('/movimientos'),
  pedidos: makeCrud('/pedidos'),
  detalles: makeCrud('/detalles'),
  proveedores: makeCrud('/proveedores'),
  categorias: makeCrud('/categorias'),
  almacenes: makeCrud('/almacenes'),
  usuarios: makeCrud('/usuarios'),
  clientes: makeCrud('/clientes'),
  transportistas: makeCrud('/transportistas'),
  ordenesCompra: makeCrud('/ordenes-compra'),
  recepciones: makeCrud('/recepciones'),
  ubicaciones: makeCrud('/ubicaciones'),
  lotes: makeCrud('/lotes'),
  auditorias: makeCrud('/auditorias'),
  incidencias: makeCrud('/incidencias'),
  turnos: makeCrud('/turnos'),
  paquetes: makeCrud('/paquetes'),
  etiquetas: makeCrud('/etiquetas'),
  tarifas: makeCrud('/tarifas'),
  contratos: makeCrud('/contratos'),
  inventarioCritico: makeCrud('/inventario-critico'),
  pedidosInternos: makeCrud('/pedidos-internos'),
  costos: makeCrud('/costos'),
  permisos: makeCrud('/permisos'),
  dashboard: {
    resumen: () => request('/dashboard/resumen'),
  },
};
