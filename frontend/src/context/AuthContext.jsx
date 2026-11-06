import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const TOKEN_KEY = 'wm_token';
const USER_KEY = 'wm_user';

const AuthContext = createContext(null);

function obtenerExpiracion(token) {
  try {
    const segmento = token.split('.')[1];
    if (!segmento) return null;

    const base64 = segmento.replace(/-/g, '+').replace(/_/g, '/');
    const binario = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
    const bytes = Uint8Array.from(binario, (caracter) => caracter.charCodeAt(0));
    const { exp } = JSON.parse(new TextDecoder().decode(bytes));
    if (!Number.isFinite(exp)) return null;
    return exp * 1000;
  } catch {
    return null;
  }
}

function leerSesionPersistida() {
  const token = localStorage.getItem(TOKEN_KEY);

  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    const expiracion = token && obtenerExpiracion(token);

    if (token && user && expiracion && expiracion > Date.now()) {
      return { token, user };
    }
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { token: null, user: null };
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [{ token, user }, setSession] = useState(leerSesionPersistida);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
    setLoading(false);
  }, [token, user]);

  const login = (tok, usr) => {
    localStorage.setItem(TOKEN_KEY, tok);
    localStorage.setItem(USER_KEY, JSON.stringify(usr));
    setSession({ token: tok, user: usr });
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setSession({ token: null, user: null });
  }, []);

  useEffect(() => {
    if (!token) return undefined;

    const expiracion = obtenerExpiracion(token);
    if (!expiracion || expiracion <= Date.now()) {
      logout();
      return undefined;
    }

    const timeout = window.setTimeout(logout, expiracion - Date.now());
    return () => window.clearTimeout(timeout);
  }, [token, logout]);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider.');
  }
  return ctx;
}