import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Button from '../ui/Button';
import Field, { Input } from '../ui/Field';

const ROLES = [
  { value: 'operador', label: 'Operador' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'admin', label: 'Administrador' },
];

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'operador' });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const data = await api.auth.registro({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password,
        rol: form.rol,
      });
      const token = data.token;
      const usuario = data.usuario || {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
      };
      if (token) login(token, usuario);
      navigate('/');
    } catch (err) {
      setError(err.message || 'No se pudo completar el registro.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-elevated border border-line shadow-modal p-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-lg bg-success/10 text-success p-2 mb-3">
              <UserPlus size={18} />
              <h2 className="text-[20px] font-semibold text-fg">Crear cuenta</h2>
            </div>
            <p className="text-[13px] text-fg-muted">
              Regístrate como usuario del almacén. Tu rol inicial lo define el administrador.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-[12px] flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <Field label="Nombre completo">
              <Input
                placeholder="Juan Pérez"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
              <UserPlus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint" />
            </Field>
            <Field label="Correo electrónico">
              <Input
                type="email"
                placeholder="nombre@empresa.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint" />
            </Field>
            <Field label="Contraseña (mín. 8 caracteres)">
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint" />
            </Field>
            <Field label="Rol">
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-base border border-line text-[13px] text-fg focus-ring"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint" />
            </Field>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Creando cuenta…' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="mt-6 text-[12px] text-fg-muted text-center">
            Ya tienes cuenta?{' '}
            <a href="/login" className="text-accent hover:text-accent-hover font-medium">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}