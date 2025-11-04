import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth';

/**
 * Componente para proteger rotas que requerem autenticação
 */
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = AuthService.isLoggedIn();
      setIsAuthenticated(loggedIn);
      
      if (!loggedIn) {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  // Mostra loading enquanto verifica autenticação
  if (isAuthenticated === null) {
    return <div style={{display: 'grid', placeItems: 'center', minHeight: '50vh'}}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
