# 🏥 Sistema de Dashboard para Hospitais - DoeVida

## 📋 Visão Geral

Sistema completo de gerenciamento de doações de sangue para hospitais, com dashboard exclusivo, controle de agendamentos e estatísticas em tempo real.

---

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação Diferenciada
- ✅ Login específico para hospitais (`/hospital-login`)
- ✅ Diferenciação automática de roles (USUARIO vs HOSPITAL)
- ✅ Redirecionamento inteligente após login
- ✅ Token JWT com role HOSPITAL

### 📊 Dashboard do Hospital
- ✅ **Estatísticas em tempo real:**
  - Total de agendamentos
  - Doações concluídas
  - Agendamentos pendentes
  - Agendamentos cancelados

- ✅ **Agendamentos de Hoje:**
  - Cards visuais com informações do doador
  - Tipo sanguíneo destacado
  - Horário do agendamento
  - Telefone para contato
  - Ações rápidas (Concluir/Cancelar)

- ✅ **Gestão Completa de Agendamentos:**
  - Tabela com todos os agendamentos
  - Filtros por status (Todos, Agendados, Concluídos, Cancelados)
  - Busca e ordenação
  - Modal de detalhes completos
  - Ações em massa

### 🎯 Controle de Doações
- ✅ Marcar doação como concluída
- ✅ Cancelar agendamentos com motivo
- ✅ Visualizar histórico completo
- ✅ Informações detalhadas do doador

### 🎨 Interface Premium
- ✅ Design moderno e responsivo
- ✅ Animações suaves
- ✅ Cards interativos
- ✅ Feedback visual em tempo real
- ✅ Estados de loading e erro
- ✅ Modais elegantes

---

## 📁 Estrutura de Arquivos Criados

```
src/
├── api/
│   └── hospital/
│       ├── auth.js                    # API de autenticação do hospital
│       └── agendamentos.js            # API de gestão de agendamentos
│
├── pages/
│   ├── HospitalDashboard/
│   │   ├── index.jsx                  # Dashboard principal
│   │   └── style.css                  # Estilos do dashboard
│   │
│   └── Hospital_Login/
│       └── index.jsx                  # Login atualizado
│
└── components/
    └── jsx/
        └── AnimatedRoutes.jsx         # Rotas atualizadas

BACKEND_HOSPITAL_ENDPOINTS.md         # Documentação dos endpoints
HOSPITAL_DASHBOARD_README.md           # Este arquivo
```

---

## 🚀 Como Usar

### 1. Login do Hospital

```javascript
// Acesse: http://localhost:5173/hospital-login

Email: hospital@exemplo.com
Senha: senha123
```

Após o login, você será automaticamente redirecionado para `/hospital-dashboard`.

### 2. Dashboard Principal

O dashboard exibe:

**Estatísticas (Cards superiores):**
- 📊 Total de Agendamentos
- ✅ Doações Concluídas
- ⏳ Pendentes
- ❌ Cancelados

**Agendamentos de Hoje:**
- Lista de doações agendadas para o dia atual
- Informações do doador (nome, tipo sanguíneo, telefone)
- Botões de ação rápida

**Todos os Agendamentos:**
- Tabela completa com filtros
- Busca por nome, data, status
- Ações individuais

### 3. Gerenciar Agendamentos

#### Concluir uma Doação:
1. Localize o agendamento
2. Clique no botão verde "Concluir"
3. Confirme a ação
4. O status será atualizado para "Concluído"
5. O usuário verá a doação concluída no histórico

#### Cancelar um Agendamento:
1. Localize o agendamento
2. Clique no botão vermelho "Cancelar"
3. Digite o motivo do cancelamento
4. Confirme a ação
5. O usuário será notificado

#### Ver Detalhes:
1. Clique no ícone de olho (👁️) ou no card
2. Modal com informações completas será exibido
3. Ações disponíveis no modal

---

## 🔧 Integração com Backend

### Endpoints Necessários

O backend precisa implementar os seguintes endpoints:

#### 1. Autenticação
```
POST /v1/doevida/hospital/login
GET  /v1/doevida/hospital/perfil
```

#### 2. Agendamentos
```
GET  /v1/doevida/hospital/agendamentos
GET  /v1/doevida/hospital/agendamentos/hoje
GET  /v1/doevida/hospital/agendamento/:id
PUT  /v1/doevida/hospital/agendamento/:id/concluir
PUT  /v1/doevida/hospital/agendamento/:id/cancelar
PUT  /v1/doevida/hospital/agendamento/:id
```

#### 3. Estatísticas
```
GET  /v1/doevida/hospital/estatisticas
```

**📖 Documentação completa:** Veja `BACKEND_HOSPITAL_ENDPOINTS.md`

---

## 🎨 Personalização

### Cores do Dashboard

```css
/* Cores principais */
--hospital-primary: #990410;
--hospital-success: #28a745;
--hospital-warning: #ffc107;
--hospital-danger: #dc3545;
--hospital-info: #17a2b8;
```

### Modificar Estatísticas

Edite `src/pages/HospitalDashboard/index.jsx`:

```javascript
const [estatisticas, setEstatisticas] = useState({
  totalAgendamentos: 0,
  agendamentosConcluidos: 0,
  agendamentosPendentes: 0,
  agendamentosCancelados: 0
})
```

---

## 🔒 Segurança

### Proteção de Rotas

O dashboard só é acessível por usuários com `role: 'HOSPITAL'`:

```javascript
useEffect(() => {
  if (!user || user.role !== 'HOSPITAL') {
    navigate('/hospital-login')
  }
}, [user, navigate])
```

### Validação de Token

Todos os requests incluem o token JWT:

```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

---

## 📱 Responsividade

O dashboard é totalmente responsivo:

- **Desktop (>1200px):** Layout completo com 4 colunas de estatísticas
- **Tablet (768px-1200px):** 2 colunas de estatísticas
- **Mobile (<768px):** 1 coluna, layout vertical otimizado

---

## 🐛 Troubleshooting

### Problema: Hospital não é redirecionado para dashboard

**Solução:**
1. Verifique se o backend retorna `role: 'HOSPITAL'` no login
2. Limpe o localStorage: `localStorage.clear()`
3. Faça login novamente

### Problema: Agendamentos não aparecem

**Solução:**
1. Verifique se o backend está rodando
2. Confira os endpoints no console do navegador (F12)
3. Verifique se o token está sendo enviado corretamente

### Problema: Erro 403 (Forbidden)

**Solução:**
1. O backend não reconhece o hospital como autorizado
2. Verifique se o middleware de autenticação valida o role
3. Confirme que o token JWT contém `role: 'HOSPITAL'`

### Problema: Estatísticas zeradas

**Solução:**
1. Verifique se há agendamentos no banco de dados
2. Confirme que o endpoint `/hospital/estatisticas` está funcionando
3. Verifique o período selecionado (padrão: mês atual)

---

## 🎯 Fluxo Completo

### Do Ponto de Vista do Hospital:

```
1. Hospital acessa /hospital-login
   ↓
2. Faz login com email e senha
   ↓
3. Backend valida e retorna token + dados com role: 'HOSPITAL'
   ↓
4. Frontend salva token e redireciona para /hospital-dashboard
   ↓
5. Dashboard carrega:
   - Estatísticas do mês
   - Agendamentos de hoje
   - Todos os agendamentos
   ↓
6. Hospital visualiza agendamento pendente
   ↓
7. Doador chega para doar
   ↓
8. Hospital clica em "Concluir Doação"
   ↓
9. Backend atualiza status para "Concluído"
   ↓
10. Usuário vê doação concluída no histórico
```

### Do Ponto de Vista do Usuário:

```
1. Usuário agenda doação em /agendamento
   ↓
2. Escolhe hospital, data e horário
   ↓
3. Backend cria agendamento com status "Agendado"
   ↓
4. Hospital vê o agendamento no dashboard
   ↓
5. Usuário vai ao hospital no dia/hora marcados
   ↓
6. Hospital confirma conclusão da doação
   ↓
7. Usuário vê em /historico que a doação foi "Concluída"
```

---

## 📊 Métricas e Analytics

### Dados Coletados:
- Total de agendamentos por período
- Taxa de conclusão de doações
- Taxa de cancelamento
- Horários de pico
- Tipos sanguíneos mais doados

### Períodos Disponíveis:
- Dia atual
- Semana atual
- Mês atual (padrão)
- Ano atual

---

## 🚀 Próximas Melhorias

### Curto Prazo:
- [ ] Sistema de notificações push
- [ ] Exportar relatórios em PDF
- [ ] Gráficos de estatísticas
- [ ] Filtro por data personalizado

### Médio Prazo:
- [ ] Chat entre hospital e doador
- [ ] Agendamento de retorno
- [ ] Sistema de avaliações
- [ ] Integração com WhatsApp

### Longo Prazo:
- [ ] App mobile para hospitais
- [ ] BI e analytics avançados
- [ ] Integração com sistemas hospitalares
- [ ] API pública para parceiros

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação de endpoints
2. Confira o console do navegador (F12)
3. Verifique os logs do backend
4. Abra uma issue no repositório

---

## 📝 Changelog

### v1.0.0 (06/11/2025)
- ✅ Sistema completo de dashboard para hospitais
- ✅ Login diferenciado com role HOSPITAL
- ✅ Gestão de agendamentos
- ✅ Estatísticas em tempo real
- ✅ Interface responsiva e moderna
- ✅ Documentação completa de endpoints

---

## 👥 Contribuindo

Para contribuir com melhorias:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto faz parte do TCC DoeVida e é desenvolvido para fins acadêmicos.

---

**Desenvolvido com ❤️ para salvar vidas**

🩸 **DoeVida** - Conectando doadores e hospitais
