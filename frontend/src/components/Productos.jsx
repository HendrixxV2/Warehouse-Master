// frontend/src/components/Productos.jsx
import { useEffect, useState } from 'react';

const API = 'http://localhost:4000/api/productos';
const FORM_INICIAL = {
  nombre: '', precio: '', stock_actual: '',
  id_proveedor: '', id_categoria: '', id_almacen: '',
};

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm]           = useState(FORM_INICIAL);
  const [editId, setEditId]       = useState(null);
  const [error, setError]         = useState(null);

  const cargar = async () => {
    const res  = await fetch(API);
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => { cargar(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      nombre:       form.nombre.trim(),
      precio:       Number(form.precio),
      stock_actual: Number(form.stock_actual),
      id_proveedor: Number(form.id_proveedor),
      id_categoria: Number(form.id_categoria),
      id_almacen:   Number(form.id_almacen),
    };

    const method = editId ? 'PUT' : 'POST';
    const url    = editId ? `${API}/${editId}` : API;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.errores ? err.errores.join(' | ') : err.error);
      return;
    }

    setForm(FORM_INICIAL);
    setEditId(null);
    cargar();
  };

  const editar = (p) => {
    setEditId(p.id);
    setForm({
      nombre: p.nombre, precio: p.precio, stock_actual: p.stock_actual,
      id_proveedor: p.id_proveedor, id_categoria: p.id_categoria, id_almacen: p.id_almacen,
    });
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    cargar();
  };

  return (
    <section style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h2>📦 Gestión de Productos</h2>

      <form onSubmit={guardar} style={{ display: 'grid', gap: 8, maxWidth: 420, marginBottom: 24 }}>
        <input name="nombre"       placeholder="Nombre"       value={form.nombre}       onChange={handleChange} required />
        <input name="precio"       placeholder="Precio"       value={form.precio}       onChange={handleChange} type="number" step="0.01" required />
        <input name="stock_actual" placeholder="Stock"        value={form.stock_actual} onChange={handleChange} type="number" required />
        <input name="id_proveedor" placeholder="ID Proveedor" value={form.id_proveedor} onChange={handleChange} type="number" required />
        <input name="id_categoria" placeholder="ID Categoría" value={form.id_categoria} onChange={handleChange} type="number" required />
        <input name="id_almacen"   placeholder="ID Almacén"   value={form.id_almacen}   onChange={handleChange} type="number" required />
        <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm(FORM_INICIAL); }}>Cancelar</button>}
      </form>

      {error && <p style={{ color: 'crimson' }}>⚠️ {error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th>
            <th>Proveedor</th><th>Categoría</th><th>Almacén</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.nombre}</td><td>${p.precio}</td><td>{p.stock_actual}</td>
              <td>{p.id_proveedor}</td><td>{p.id_categoria}</td><td>{p.id_almacen}</td>
              <td>
                <button onClick={() => editar(p)}>✏️</button>{' '}
                <button onClick={() => eliminar(p.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}