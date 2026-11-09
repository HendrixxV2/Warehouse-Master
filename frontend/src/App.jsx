import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import AppShell from './layout/AppShell';
import AdminShell from './layout/AdminShell';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Productos from './pages/Productos';
import RoleMatrix from './pages/RoleMatrix';
import ResourcePage from './pages/ResourcePage';
import Login from './pages/Login';
import Registro from './pages/Registro';
import { resourcePages } from './pages/resourcePages';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function OperationalHome() {
  const { user } = useAuth();
  return user?.rol === 'operador'
    ? <Navigate to="/productos" replace />
    : <Dashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login admin />} />
        <Route path="/registro" element={<Registro />} />

        <Route element={<ProtectedRoute allowedRoles={['supervisor', 'operador']}><AppShell /></ProtectedRoute>}>
          <Route index element={<OperationalHome />} />
          <Route path="productos" element={<Productos />} />
          <Route path="movimientos" element={<ResourcePage config={resourcePages.movimientos} />} />
          <Route path="pedidos" element={<ResourcePage config={resourcePages.pedidos} />} />
          <Route path="detalles" element={<ResourcePage config={resourcePages.detalles} />} />
          <Route path="proveedores" element={<ProtectedRoute allowedRoles={['supervisor']}><ResourcePage config={resourcePages.proveedores} /></ProtectedRoute>} />
          <Route path="categorias" element={<ProtectedRoute allowedRoles={['supervisor']}><ResourcePage config={resourcePages.categorias} /></ProtectedRoute>} />
          <Route path="almacenes" element={<ResourcePage config={resourcePages.almacenes} />} />
          <Route path="clientes" element={<ProtectedRoute allowedRoles={['supervisor']}><ResourcePage config={resourcePages.clientes} /></ProtectedRoute>} />
          <Route path="transportistas" element={<ProtectedRoute allowedRoles={['supervisor']}><ResourcePage config={resourcePages.transportistas} /></ProtectedRoute>} />
          <Route path="ordenes-compra" element={<ProtectedRoute allowedRoles={['supervisor']}><ResourcePage config={resourcePages.ordenesCompra} /></ProtectedRoute>} />
          <Route path="recepciones" element={<ResourcePage config={resourcePages.recepciones} />} />
          <Route path="ubicaciones" element={<ResourcePage config={resourcePages.ubicaciones} />} />
          <Route path="lotes" element={<ProtectedRoute allowedRoles={['supervisor']}><ResourcePage config={resourcePages.lotes} /></ProtectedRoute>} />
          <Route path="incidencias" element={<ResourcePage config={resourcePages.incidencias} />} />
          <Route path="turnos" element={<ProtectedRoute allowedRoles={['supervisor']}><ResourcePage config={resourcePages.turnos} /></ProtectedRoute>} />
          <Route path="paquetes" element={<ResourcePage config={resourcePages.paquetes} />} />
          <Route path="etiquetas" element={<ProtectedRoute allowedRoles={['supervisor']}><ResourcePage config={resourcePages.etiquetas} /></ProtectedRoute>} />
          <Route path="inventario-critico" element={<ResourcePage config={resourcePages.inventarioCritico} />} />
          <Route path="pedidos-internos" element={<ProtectedRoute allowedRoles={['supervisor']}><ResourcePage config={resourcePages.pedidosInternos} /></ProtectedRoute>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminShell /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/usuarios" element={<ResourcePage config={resourcePages.usuarios} />} />
          <Route path="/admin/permisos" element={<RoleMatrix />} />
          <Route path="/admin/productos" element={<Productos />} />
          <Route path="/admin/proveedores" element={<ResourcePage config={resourcePages.proveedores} />} />
          <Route path="/admin/categorias" element={<ResourcePage config={resourcePages.categorias} />} />
          <Route path="/admin/almacenes" element={<ResourcePage config={resourcePages.almacenes} />} />
          <Route path="/admin/auditorias" element={<ResourcePage config={resourcePages.auditorias} />} />
          <Route path="/admin/contratos" element={<ResourcePage config={resourcePages.contratos} />} />
          <Route path="/admin/tarifas" element={<ResourcePage config={resourcePages.tarifas} />} />
          <Route path="/admin/costos" element={<ResourcePage config={resourcePages.costos} />} />
        </Route>

        <Route path="*" element={<ProtectedRoute><div className="space-y-2">
          <h2 className="text-[22px] font-semibold text-fg">Sección no encontrada</h2>
          <Link to="/" className="text-[13px] text-accent hover:text-accent-hover">Volver al dashboard</Link>
        </div></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}