# 🔧 Troubleshooting - Agendamento não está salvando

## ✅ Correções Implementadas

### 1. **Logs de Debug Adicionados**
- ✅ Logs detalhados na API de agendamento
- ✅ Logs no interceptor HTTP para verificar token
- ✅ Logs na tela de agendamento
- ✅ Componente de debug para testes

### 2. **Tratamento de Erros Melhorado**
- ✅ Verificação de status de resposta mais robusta
- ✅ Logs específicos para diferentes tipos de erro
- ✅ Tratamento de erro 401 (não autorizado)

### 3. **Verificação de Dados**
- ✅ Validação do ID do usuário
- ✅ Logs dos dados enviados para a API
- ✅ Verificação de token válido

### 4. **Endpoints Corrigidos**
- ✅ Endpoints de disponibilidade e busca por data corrigidos
- ✅ Remoção da verificação de disponibilidade que pode causar problemas

## 🧪 Como Testar

### 1. **Usar o Componente de Debug**
1. Acesse a tela de agendamento
2. Use o componente de debug no topo da página
3. Clique em "Verificar Token" para ver se está autenticado
4. Clique em "Testar Criação" para testar a API

### 2. **Verificar Console do Navegador**
1. Abra o console (F12)
2. Procure por logs com emojis:
   - 🔄 = Iniciando processo
   - ✅ = Sucesso
   - ❌ = Erro
   - 📋 = Dados
   - 🔐 = Token/Autenticação

### 3. **Verificar Network Tab**
1. Abra DevTools > Network
2. Tente criar um agendamento
3. Procure pela requisição POST para `/agendamento`
4. Verifique:
   - Status code (deve ser 200/201)
   - Headers (deve ter Authorization)
   - Response body

## 🔍 Possíveis Problemas

### 1. **Token de Autenticação**
**Sintomas:** Erro 401, "Não autorizado"
**Verificar:**
```javascript
// No console do navegador:
localStorage.getItem('token')
localStorage.getItem('usuario')
```

### 2. **ID do Usuário**
**Sintomas:** "Usuário não identificado"
**Verificar:** Se `user.id` existe no contexto

### 3. **Servidor Backend**
**Sintomas:** Erro de conexão, timeout
**Verificar:** Se o servidor está rodando na porta correta

### 4. **CORS**
**Sintomas:** Erro de CORS no console
**Verificar:** Configuração de CORS no backend

## 📋 Dados Esperados pela API

```javascript
// Payload correto:
{
  id_usuario: number,     // ID do usuário logado
  id_hospital: number,    // ID do hospital selecionado
  data: "YYYY-MM-DD",     // Data no formato ISO
  hora: "HH:MM:SS",       // Horário com segundos
  status: "Agendado"      // Status inicial
}
```

## 🚨 Checklist de Verificação

- [ ] Usuário está logado?
- [ ] Token está presente no localStorage?
- [ ] Token é válido (não expirado)?
- [ ] ID do usuário existe?
- [ ] ID do hospital é válido?
- [ ] Servidor backend está rodando?
- [ ] Endpoint `/v1/doevida/agendamento` está funcionando?
- [ ] Headers de autenticação estão sendo enviados?

## 🔧 Comandos Úteis

### Verificar no Console:
```javascript
// Verificar autenticação
localStorage.getItem('token')
localStorage.getItem('usuario')

// Testar API manualmente
import { criarAgendamento } from './src/api/agendamento/agendamento.js'
criarAgendamento({
  id_usuario: 1,
  id_hospital: 1,
  data: '2024-12-01',
  hora: '14:00:00',
  status: 'Agendado'
})
```

## 📞 Próximos Passos

1. **Execute os testes** usando o componente de debug
2. **Verifique os logs** no console
3. **Analise a requisição** no Network tab
4. **Reporte os resultados** com prints dos logs/erros

## 🗑️ Limpeza Após Resolver

Após identificar e resolver o problema:

1. Remover o componente `<DebugAgendamento />` da tela
2. Remover logs de debug desnecessários
3. Deletar arquivos de teste (`test.js`, `DebugAgendamento.jsx`)
4. Limpar logs do interceptor HTTP
