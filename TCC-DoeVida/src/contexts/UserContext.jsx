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
        console.log('🔍 Estado de autenticação:', loggedIn ? 'Logado' : 'Não logado');
        
        if (loggedIn) {
          // Pegar dados do localStorage primeiro
          const userData = AuthService.getUsuario();
          console.log('📋 Dados do usuário do localStorage:', userData);
          
          // Verificar se é hospital (tem CNPJ ou role HOSPITAL)
          const isHospital = userData?.cnpj || userData?.role === 'HOSPITAL' || userData?.tipo === 'HOSPITAL';
          
          if (isHospital) {
            // Se for hospital, usar apenas dados do localStorage
            console.log('🏥 Hospital detectado - usando dados do localStorage');
            setUser(userData);
            setIsLoggedIn(true);
          } else {
            // Se for usuário normal, tentar obter dados atualizados do perfil
            try {
              console.log('🔄 Buscando dados atualizados do perfil...');
              const profileResult = await AuthService.obterPerfil();
              console.log('✅ Resposta da API de perfil:', profileResult);
              
              if (profileResult.success && profileResult.data) {
                console.log('✅ Dados do perfil atualizados com sucesso');
                setUser(profileResult.data);
                setIsLoggedIn(true);
              } else {
                // Fallback para dados do localStorage
                console.warn('⚠️ Dados de perfil inválidos, usando localStorage');
                setUser(userData);
                setIsLoggedIn(true);
              }
            } catch (error) {
              console.error('❌ Erro ao buscar perfil:', error);
              console.log('⚠️ Usando dados do localStorage devido ao erro');
              setUser(userData);
              setIsLoggedIn(true);
            }
          }
        } else {
          console.log('🔒 Usuário não está logado');
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do usuário:', error);
        // Em caso de erro, tentar usar dados do localStorage se disponíveis
        if (AuthService.isLoggedIn()) {
          console.log('⚠️ Usando fallback para dados do localStorage');
          const userData = AuthService.getUsuario();
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } finally {
        console.log('🏁 Finalizando carregamento do usuário');
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
