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
          <Route path="clientes" element={<ResourcePage config={resourcePages.clientes} />} />
          <Route path="transportistas" element={<ResourcePage config={resourcePages.transportistas} />} />
          <Route path="ordenes-compra" element={<ResourcePage config={resourcePages.ordenesCompra} />} />
          <Route path="recepciones" element={<ResourcePage config={resourcePages.recepciones} />} />
          <Route path="ubicaciones" element={<ResourcePage config={resourcePages.ubicaciones} />} />
          <Route path="lotes" element={<ResourcePage config={resourcePages.lotes} />} />
          <Route path="auditorias" element={<ResourcePage config={resourcePages.auditorias} />} />
          <Route path="incidencias" element={<ResourcePage config={resourcePages.incidencias} />} />
          <Route path="turnos" element={<ResourcePage config={resourcePages.turnos} />} />
          <Route path="paquetes" element={<ResourcePage config={resourcePages.paquetes} />} />
          <Route path="etiquetas" element={<ResourcePage config={resourcePages.etiquetas} />} />
          <Route path="tarifas" element={<ResourcePage config={resourcePages.tarifas} />} />
          <Route path="contratos" element={<ResourcePage config={resourcePages.contratos} />} />
          <Route path="inventario-critico" element={<ResourcePage config={resourcePages.inventarioCritico} />} />
          <Route path="pedidos-internos" element={<ResourcePage config={resourcePages.pedidosInternos} />} />
          <Route path="costos" element={<ResourcePage config={resourcePages.costos} />} />
          <Route path="permisos" element={<ResourcePage config={resourcePages.permisos} />} />
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