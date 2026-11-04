const BASE = import.meta.env?.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.errores?.join(' | ') || err.error || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

const makeCrud = (path) => ({
  listar:     (q = '') => request(`${path}${q}`),
  obtener:    (id)     => request(`${path}/${id}`),
  crear:      (d)      => request(path,        { method: 'POST',   body: JSON.stringify(d) }),
  actualizar: (id, d)  => request(`${path}/${id}`, { method: 'PUT',    body: JSON.stringify(d) }),
  eliminar:   (id)     => request(`${path}/${id}`, { method: 'DELETE' }),
});

export const api = {
  productos:   makeCrud('/productos'),
  movimientos: makeCrud('/movimientos'),
  pedidos:     makeCrud('/pedidos'),
  detalles:    makeCrud('/detalles'),
  proveedores: makeCrud('/proveedores'),
  categorias:  makeCrud('/categorias'),
  almacenes:   makeCrud('/almacenes'),
  usuarios:    makeCrud('/usuarios'),
  dashboard: {
    resumen: () => request('/dashboard/resumen'),
  },
};