import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to={allowedRoles?.includes('admin') ? '/admin/login' : '/login'} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to={user?.rol === 'admin' ? '/admin' : '/'} replace />;
  }
  return children;
}