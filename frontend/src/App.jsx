// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './layout/AppShell';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
// importa el resto de páginas…

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<Productos />} />
          {/* <Route path="movimientos" element={<Movimientos />} /> */}
          {/* … */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}