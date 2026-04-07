import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from './LoadingSpinner';

export default function AdminRoute({ children }) {
  const { isAuthenticated, token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wait for user to load (token exists but user not fetched yet)
  if (!user) {
    return <LoadingSpinner />;
  }

  if (!user?.roles?.includes('ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return children;
}
