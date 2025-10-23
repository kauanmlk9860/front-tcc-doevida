// Arquivo de teste para verificar conectividade da API de agendamentos
import { criarAgendamento, listarMeusAgendamentos } from './agendamento.js';

// Função para testar a criação de agendamento
export async function testarCriacaoAgendamento() {
  console.log('🧪 Iniciando teste de criação de agendamento...');
  
  const dadosTeste = {
    id_usuario: 1, // ID de teste
    id_hospital: 1, // ID de teste
    data: '2024-12-01',
    hora: '14:00:00',
    status: 'Agendado'
  };
  
  try {
    const resultado = await criarAgendamento(dadosTeste);
    console.log('📊 Resultado do teste:', resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return { success: false, error: error.message };
  }
}

// Função para testar listagem de agendamentos
export async function testarListagemAgendamentos() {
  console.log('🧪 Iniciando teste de listagem de agendamentos...');
  
  try {
    const resultado = await listarMeusAgendamentos();
    console.log('📊 Resultado da listagem:', resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Erro na listagem:', error);
    return { success: false, error: error.message };
  }
}

// Função para executar todos os testes
export async function executarTodosOsTestes() {
  console.log('🚀 Executando todos os testes da API de agendamentos...');
  
  const resultados = {
    criacao: await testarCriacaoAgendamento(),
    listagem: await testarListagemAgendamentos()
  };
  
  console.log('📋 Resumo dos testes:', resultados);
  return resultados;
}

// Para usar no console do navegador:
// import { executarTodosOsTestes } from './src/api/agendamento/test.js';
// executarTodosOsTestes();
