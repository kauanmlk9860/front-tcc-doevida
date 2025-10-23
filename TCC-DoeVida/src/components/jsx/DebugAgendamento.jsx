import { useState } from 'react';
import { criarAgendamento, listarMeusAgendamentos } from '../../api/agendamento/agendamento.js';
import { useUser } from '../../contexts/UserContext';

export default function DebugAgendamento() {
  const { user, isLoggedIn } = useUser();
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const testarCriacao = async () => {
    if (!isLoggedIn || !user?.id) {
      alert('Você precisa estar logado para testar');
      return;
    }

    setLoading(true);
    setResultado(null);

    const dadosTeste = {
      id_usuario: user.id, // Seu ID: 1
      id_hospital: 2, // Hospital ID: 2
      data: '2024-12-01',
      hora: '14:00:00',
      status: 'Agendado'
    };

    try {
      console.log('🧪 Testando criação de agendamento...');
      const result = await criarAgendamento(dadosTeste);
      setResultado(result);
    } catch (error) {
      setResultado({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testarListagem = async () => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para testar');
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      console.log('🧪 Testando listagem de agendamentos...');
      const result = await listarMeusAgendamentos();
      setResultado(result);
    } catch (error) {
      setResultado({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const verificarToken = () => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    console.log('🔐 Token:', token ? 'Presente' : 'Ausente');
    console.log('👤 Usuário:', usuario ? JSON.parse(usuario) : 'Não encontrado');
    
    setResultado({
      token: !!token,
      tokenValue: token ? token.substring(0, 50) + '...' : null,
      usuario: usuario ? JSON.parse(usuario) : null,
      userContext: user,
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida'
    });
  };

  const testarConexaoAPI = async () => {
    setLoading(true);
    setResultado(null);

    try {
      console.log('🌐 Testando conexão com a API...');
      
      // Teste direto com fetch
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/doevida';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseURL}/agendamento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_usuario: 1,
          id_hospital: 2,
          data: '2024-12-01',
          hora: '14:00:00',
          status: 'Agendado'
        })
      });

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      console.log('📊 Status:', response.status);
      console.log('📋 Response:', responseData);

      setResultado({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        url: `${baseURL}/agendamento`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? 'Bearer ' + token.substring(0, 20) + '...' : 'Não enviado'
        }
      });
    } catch (error) {
      console.error('❌ Erro na conexão:', error);
      setResultado({ 
        success: false, 
        error: error.message,
        type: 'connection_error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '20px', border: '2px solid #990410', margin: '20px', borderRadius: '8px' }}>
        <h3>🔧 Debug Agendamento</h3>
        <p>Você precisa estar logado para usar as ferramentas de debug.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #990410', margin: '20px', borderRadius: '8px' }}>
      <h3>🔧 Debug Agendamento</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Usuário:</strong> {user?.nome || 'N/A'}</p>
        <p><strong>ID:</strong> {user?.id || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={testarCriacao} 
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#990410', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Testando...' : 'Testar Criação'}
        </button>
        
        <button 
          onClick={testarListagem} 
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#990410', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Testando...' : 'Testar Listagem'}
        </button>
        
        <button 
          onClick={verificarToken}
          style={{ padding: '10px', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Verificar Token
        </button>
        
        <button 
          onClick={testarConexaoAPI} 
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Testando...' : 'Teste Direto API'}
        </button>
      </div>

      {resultado && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: resultado.success ? '#d4edda' : '#f8d7da', 
          border: `1px solid ${resultado.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <h4>Resultado:</h4>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Instruções:</strong></p>
        <ul>
          <li>Abra o console do navegador (F12) para ver logs detalhados</li>
          <li>Teste a criação primeiro para verificar se a API está funcionando</li>
          <li>Use "Verificar Token" se houver problemas de autenticação</li>
        </ul>
      </div>
    </div>
  );
}
