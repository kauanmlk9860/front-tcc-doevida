import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.js';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar dados do usuário ao inicializar
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const loggedIn = AuthService.isLoggedIn();
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          // Pegar dados do localStorage primeiro
          const userData = AuthService.getUsuario();
          
          // Verificar se é hospital (tem CNPJ ou role HOSPITAL)
          const isHospital = userData?.cnpj || userData?.role === 'HOSPITAL' || userData?.tipo === 'HOSPITAL';
          
          if (isHospital) {
            // Se for hospital, usar apenas dados do localStorage
            // (não chamar API de perfil pois não existe endpoint específico)
            console.log('🏥 Hospital detectado - usando dados do localStorage');
            setUser(userData);
          } else {
            // Se for usuário normal, tentar obter dados atualizados do perfil
            try {
              const profileResult = await AuthService.obterPerfil();
              if (profileResult.success && profileResult.data) {
                setUser(profileResult.data);
              } else {
                // Fallback para dados do localStorage
                setUser(userData);
              }
            } catch (error) {
              console.log('⚠️ Erro ao buscar perfil, usando localStorage');
              setUser(userData);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Em caso de erro, usar dados do localStorage se disponíveis
        if (AuthService.isLoggedIn()) {
          const userData = AuthService.getUsuario();
          setUser(userData);
          setIsLoggedIn(true);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Função para fazer login
  const login = async (email, senha) => {
    try {
      const result = await AuthService.login(email, senha);
      if (result.success) {
        const userData = AuthService.getUsuario();
        setUser(userData);
        setIsLoggedIn(true);
        return result;
      }
      return result;
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro inesperado no login' };
    }
  };

  // Função para fazer logout
  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  // Função para atualizar dados do usuário
  const updateUser = async () => {
    try {
      const profileResult = await AuthService.obterPerfil();
      if (profileResult.success && profileResult.data) {
        setUser(profileResult.data);
        return profileResult;
      }
      return profileResult;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, message: 'Erro ao atualizar perfil' };
    }
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    updateUser,
    setUser, // Para atualizações manuais se necessário
    setIsLoggedIn, // Para controle manual do estado de login
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
