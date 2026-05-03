import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, isAuthenticated, isTokenExpired } = useAuth();
  const token = localStorage.getItem('token');

  // Attendre que l'état de chargement soit terminé
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500" />
      </div>
    );
  }

  // Vérifier si le token est expiré
  if (token && isTokenExpired && isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/signin" replace />;
  }

  // Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  // Vérifier si le rôle est autorisé
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Rediriger selon le rôle
    if (user?.role === 'admin') {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/client" replace />;
    }
  }

  return children;
}