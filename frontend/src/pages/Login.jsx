import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Button from '../ui/Button';
import Field, { Input } from '../ui/Field';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const data = await api.auth.login({
        email: form.email.trim(),
        password: form.password,
      });
      const token = data.token;
      const usuario = data.usuario || {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
      };
      login(token, usuario);
      navigate('/');
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-elevated border border-line shadow-modal p-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-lg bg-accent/10 text-accent p-2 mb-3">
              <LogIn size={18} />
              <h2 className="text-[20px] font-semibold text-fg">Iniciar sesión</h2>
            </div>
            <p className="text-[13px] text-fg-muted">
              Accede al sistema de gestión de almacenes con tu cuenta de empresa.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-[12px] flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
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
            <Field label="Contraseña">
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint" />
            </Field>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Entrando…' : 'Iniciar sesión'}
            </Button>
          </form>

          <p className="mt-6 text-[12px] text-fg-muted text-center">
            ¿No tienes cuenta?{' '}
            <a href="/registro" className="text-accent hover:text-accent-hover font-medium">
              Regístrate
            </a>
          </p>
          <p className="text-[11px] text-fg-tertiary text-center">
            Demo: operador.demo@warehouse.local / WarehouseDemo123
          </p>
        </div>
      </div>
    </div>
  );
}