// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AppShell from './layout/AppShell';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import ResourcePage from './pages/ResourcePage';
import Login from './pages/Login';
import Registro from './pages/Registro';
import { resourcePages } from './pages/resourcePages';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (no requieren sesión) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas privadas (requieren sesión iniciada) */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<Productos />} />
          <Route path="movimientos" element={<ResourcePage config={resourcePages.movimientos} />} />
          <Route path="pedidos" element={<ResourcePage config={resourcePages.pedidos} />} />
          <Route path="detalles" element={<ResourcePage config={resourcePages.detalles} />} />
          <Route path="proveedores" element={<ResourcePage config={resourcePages.proveedores} />} />
          <Route path="categorias" element={<ResourcePage config={resourcePages.categorias} />} />
          <Route path="almacenes" element={<ResourcePage config={resourcePages.almacenes} />} />
          <Route path="usuarios" element={<ResourcePage config={resourcePages.usuarios} />} />
          <Route
            path="*"
            element={
              <div className="space-y-2">
                <h2 className="text-[22px] font-semibold text-fg">Sección no encontrada</h2>
                <Link to="/" className="text-[13px] text-accent hover:text-accent-hover">Volver al dashboard</Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}