import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import Field, { Input } from '../ui/Field';
import Modal from '../ui/Modal';
import { useAuth } from '../context/AuthContext';

function initialValues(fields) {
  return Object.fromEntries(fields.map((field) => [field.name, field.defaultValue || '']));
}

function fieldValue(value, type) {
  if (value === null || value === undefined) return '';
  if (type !== 'datetime-local') return String(value);
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function fieldInput(field, value, onChange) {
  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={onChange}
        required={field.required}
        className="w-full h-9 px-3 rounded-lg bg-base border border-line text-[13px] text-fg focus-ring transition"
      >
        <option value="">Selecciona una opción</option>
        {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={onChange}
        required={field.required}
        rows={3}
        className="w-full px-3 py-2 rounded-lg bg-base border border-line text-[13px] text-fg focus-ring transition"
      />
    );
  }

  return (
    <Input
      type={field.type || 'text'}
      value={value}
      onChange={onChange}
      required={field.required}
      min={field.min}
      step={field.type === 'number' ? '1' : undefined}
    />
  );
}

export default function ResourcePage({ config }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(() => initialValues(config.fields));
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState('');
  const can = (action, fallback = ['admin', 'supervisor']) => (
    (config.access?.[action] || fallback).includes(user?.rol)
  );
  const canRead = can('read', ['admin', 'supervisor', 'operador']);
  const canCreate = can('create');
  const canUpdate = can('update');
  const canDelete = can('delete');
  const visibleFields = config.fields.filter((field) => !field.hiddenRoles?.includes(user?.rol));
  const visibleColumns = config.columns.filter((column) => !column.hiddenRoles?.includes(user?.rol));
  const fieldsForMode = (mode) => visibleFields.filter((field) => (
    (mode === 'create' || !field.createOnly)
    && (mode !== 'edit' || !field.hiddenOnEditRoles?.includes(user?.rol))
  ));

  const load = useCallback(async () => {
    if (!canRead) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const records = await config.api.listar();
      if (!Array.isArray(records)) throw new Error('La respuesta del servidor no tiene el formato esperado.');
      setRows(records);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [canRead, config]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    if (!search) return rows;
    return rows.filter((row) => visibleColumns.some((column) => (
      String(row[column.key] ?? '').toLocaleLowerCase().includes(search)
    )));
  }, [query, rows, visibleColumns]);

  const openCreate = () => {
    if (!canCreate) return;
    setForm(initialValues(config.fields));
    setModal({ mode: 'create' });
  };

  const openEdit = (row) => {
    if (!canUpdate) return;
    setForm(Object.fromEntries(config.fields.map((field) => (
      [field.name, fieldValue(row[field.name], field.type)]
    ))));
    setModal({ mode: 'edit', row });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!modal) return;

    const fields = fieldsForMode(modal.mode);
    const payload = {};
    fields.forEach((field) => {
      const value = form[field.name];
      if (value === '') return;
      if (field.type === 'number') payload[field.name] = Number(value);
      else if (field.type === 'datetime-local') payload[field.name] = new Date(value).toISOString();
      else payload[field.name] = value;
    });

    setSaving(true);
    try {
      if (modal.mode === 'create') await config.api.crear(payload);
      else await config.api.actualizar(modal.row.id, payload);
      setModal(null);
      setNotice(modal.mode === 'create' ? 'Registro creado correctamente.' : 'Registro actualizado correctamente.');
      await load();
    } catch (saveError) {
      setNotice(null);
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!canDelete) return;
    const warning = config.deleteWarning ? ` ${config.deleteWarning}` : '';
    if (!window.confirm(`¿Eliminar el registro #${row.id}?${warning}`)) return;
    try {
      await config.api.eliminar(row.id);
      setNotice(config.deleteSuccessNotice || 'Registro eliminado correctamente.');
      await load();
    } catch (deleteError) {
      setNotice(null);
      setError(deleteError.message);
    }
  };

  const editableFields = modal ? fieldsForMode(modal.mode) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[22px] font-semibold text-fg tracking-tight">{config.title}</h2>
          <p className="text-[13px] text-fg-muted mt-1">
            {canRead && <><span className="mono">{rows.length}</span> registros · </>}
            {config.description}
          </p>
        </div>
        {canCreate && <Button onClick={openCreate}>
          <Plus size={15} /> Nuevo registro
        </Button>}
      </div>

      {canRead && (
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Buscar ${config.title.toLocaleLowerCase()}…`}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-elevated border border-line text-[13px] text-fg focus-ring"
          />
        </div>
      )}

      {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
      {notice && <p role="status" className="text-[13px] text-success">{notice}</p>}

      {canRead && (
        <DataTable
          columns={visibleColumns}
          rows={filtered}
          loading={loading}
          onEdit={canUpdate ? openEdit : undefined}
          onDelete={canDelete ? remove : undefined}
          emptyLabel={`No hay registros de ${config.title.toLocaleLowerCase()} para mostrar`}
        />
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={`${modal?.mode === 'edit' ? 'Editar' : 'Nuevo'} · ${config.title}`}
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
          {editableFields.map((field) => (
            <div key={field.name} className={field.type === 'textarea' ? 'col-span-2' : ''}>
              <Field label={field.label}>
                {fieldInput(field, form[field.name], (event) => (
                  setForm((values) => ({ ...values, [field.name]: event.target.value }))
                ))}
              </Field>
            </div>
          ))}
        </form>
      </Modal>
    </div>
  );
}
