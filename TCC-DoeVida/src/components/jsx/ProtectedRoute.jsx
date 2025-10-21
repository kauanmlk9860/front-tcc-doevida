import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.js';

/**
 * Componente para proteger rotas que requerem autenticação
 */
function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  // Se não estiver logado, não renderiza nada (será redirecionado)
  if (!AuthService.isLoggedIn()) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
