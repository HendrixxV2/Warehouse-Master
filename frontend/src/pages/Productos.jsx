import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Package, Filter } from 'lucide-react';
import DataTable from '../ui/DataTable';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Field, { Input } from '../ui/Field';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const INITIAL = {
  nombre: '', precio: '', stock_actual: '',
  id_proveedor: '', id_categoria: '', id_almacen: '',
};

export default function Productos() {
  const { user } = useAuth();
  const canManage = user?.rol === 'admin';
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState('');
  const [modal, setModal]       = useState(null); // { mode: 'create'|'edit', row? }
  const [form, setForm]         = useState(INITIAL);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);

  const load = async () => {
    setLoading(true);
    try { setRows(await api.productos.listar()); }
    catch (e) { setToast({ tone: 'danger', msg: e.message }); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => r.nombre?.toLowerCase().includes(q));
  }, [rows, query]);

  const openCreate = () => { setForm(INITIAL); setModal({ mode: 'create' }); };
  const openEdit   = (row) => {
    setForm({
      nombre: row.nombre, precio: row.precio, stock_actual: row.stock_actual,
      id_proveedor: row.id_proveedor, id_categoria: row.id_categoria, id_almacen: row.id_almacen,
    });
    setModal({ mode: 'edit', row });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      nombre: form.nombre.trim(),
      precio: Number(form.precio),
      stock_actual: Number(form.stock_actual),
      id_proveedor: Number(form.id_proveedor),
      id_categoria: Number(form.id_categoria),
      id_almacen: Number(form.id_almacen),
    };
    try {
      if (modal.mode === 'create') await api.productos.crear(payload);
      else await api.productos.actualizar(modal.row.id, payload);
      setToast({ tone: 'success', msg: modal.mode === 'create' ? 'Producto creado' : 'Producto actualizado' });
      setModal(null); load();
    } catch (err) {
      setToast({ tone: 'danger', msg: err.message });
    } finally { setSaving(false); }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Eliminar “${row.nombre}”?`)) return;
    try { await api.productos.eliminar(row.id); setToast({ tone: 'success', msg: 'Producto eliminado' }); load(); }
    catch (err) { setToast({ tone: 'danger', msg: err.message }); }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const columns = [
    { key: 'id',           label: 'ID',        mono: true, render: (v) => <span className="text-fg-muted">#{v}</span> },
    { key: 'nombre',       label: 'Producto' },
    ...(canManage ? [{ key: 'precio', label: 'Precio', align: 'right', mono: true, render: (v) => `$${Number(v).toFixed(2)}` }] : []),
    { key: 'stock_actual', label: 'Stock',     align: 'right', mono: true,
      render: (v) => (
        <Badge tone={v < 10 ? 'danger' : v < 30 ? 'warning' : 'success'}>{v} uds</Badge>
      ) },
    { key: 'id_almacen',   label: 'Almacén',   align: 'right', mono: true },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[22px] font-semibold text-fg tracking-tight">Productos</h2>
          <p className="text-[13px] text-fg-muted mt-1">
            <span className="mono">{rows.length}</span> registros · control de catálogo
          </p>
        </div>
        {canManage && <Button onClick={openCreate}>
          <Plus size={15} /> Nuevo producto
        </Button>}
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre…"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-elevated border border-line text-[13px] focus-ring"
          />
        </div>
        <Button variant="secondary" size="md">
          <Filter size={14} /> Filtros
        </Button>
      </div>

      {/* Tabla */}
      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        onEdit={canManage ? openEdit : undefined}
        onDelete={canManage ? remove : undefined}
        emptyLabel="No hay productos que coincidan con la búsqueda"
      />

      {/* Modal */}
      {canManage && <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'edit' ? 'Editar producto' : 'Nuevo producto'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
            <Button onClick={submit} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </>
        }
      >
        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Nombre">
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </Field>
          </div>
          <Field label="Precio">
            <Input type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
          </Field>
          <Field label="Stock inicial">
            <Input type="number" value={form.stock_actual} onChange={(e) => setForm({ ...form, stock_actual: e.target.value })} required />
          </Field>
          <Field label="ID Proveedor">
            <Input type="number" value={form.id_proveedor} onChange={(e) => setForm({ ...form, id_proveedor: e.target.value })} required />
          </Field>
          <Field label="ID Categoría">
            <Input type="number" value={form.id_categoria} onChange={(e) => setForm({ ...form, id_categoria: e.target.value })} required />
          </Field>
          <Field label="ID Almacén">
            <Input type="number" value={form.id_almacen} onChange={(e) => setForm({ ...form, id_almacen: e.target.value })} required />
          </Field>
        </form>
      </Modal>}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl border shadow-modal text-[13px] font-medium z-50
          ${toast.tone === 'success' ? 'bg-success/10 border-success/30 text-success'
            : 'bg-danger/10 border-danger/30 text-danger'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}