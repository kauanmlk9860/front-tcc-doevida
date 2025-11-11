import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading, isLoggedIn } = useUser();

  if (loading) {
    return <div style={{display: 'grid', placeItems: 'center', minHeight: '50vh'}}>Carregando...</div>;
  }

  // Se não está logado, redireciona para o login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Se há uma role requerida e o usuário não tem permissão
  if (requiredRole) {
    const userRole = user?.role || user?.tipo;
    if (userRole !== requiredRole) {
      // Redireciona para a página inicial ou para uma página de acesso negado
      return <Navigate to="/" replace />;
    }
  }

  // Se chegou até aqui, o usuário está autenticado e tem a role necessária
  return children;
}

export default ProtectedRoute;
