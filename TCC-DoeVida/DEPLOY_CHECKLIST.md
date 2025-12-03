# ✅ Checklist de Deploy no Render

## 📋 Antes do Deploy

- [ ] Backend já está deployado e funcionando
- [ ] Tenho a URL do backend em produção
- [ ] Token do Azure Storage válido (se usar)
- [ ] Código commitado e pushed no GitHub
- [ ] Arquivos de configuração criados:
  - [ ] `render.yaml`
  - [ ] `public/_redirects`
  - [ ] `.env.example`

## 🚀 Durante o Deploy

### 1. Criar Static Site no Render
- [ ] Acessar https://render.com
- [ ] Clicar em "New +" → "Static Site"
- [ ] Conectar repositório GitHub
- [ ] Selecionar branch `main`

### 2. Configurações
- [ ] **Name:** doevida-frontend
- [ ] **Root Directory:** TCC-DoeVida (se em subpasta)
- [ ] **Build Command:** `npm install && npm run build`
- [ ] **Publish Directory:** `dist`

### 3. Variáveis de Ambiente
Adicionar no Render (Environment tab):

```
VITE_API_URL = https://seu-backend.onrender.com/v1/doevida
VITE_DEVELOPMENT_MODE = false
VITE_AZURE_STORAGE_URL = https://doevidastorage.blob.core.windows.net/imagens-geral
VITE_AZURE_SAS_TOKEN = seu_token_aqui
```

- [ ] VITE_API_URL configurado
- [ ] VITE_DEVELOPMENT_MODE = false
- [ ] VITE_AZURE_STORAGE_URL configurado (se usar)
- [ ] VITE_AZURE_SAS_TOKEN configurado (se usar)

### 4. Iniciar Deploy
- [ ] Clicar em "Create Static Site"
- [ ] Aguardar build (2-5 minutos)
- [ ] Verificar logs de build

## 🔧 Backend - Configurar CORS

No seu backend, adicione o domínio do Render:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://doevida-frontend.onrender.com', // Sua URL do Render
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

- [ ] CORS configurado no backend
- [ ] Backend reiniciado após configuração

## ✅ Após o Deploy

### Testes Básicos
- [ ] Site abre (não aparece página em branco)
- [ ] Logo e imagens aparecem
- [ ] Página de login abre
- [ ] Cadastro funciona
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Rotas funcionam (não dá 404 ao recarregar)

### Testes de Funcionalidade
- [ ] Cadastro de hospital funciona
- [ ] Foto do hospital é salva
- [ ] Login de hospital funciona
- [ ] Dashboard mostra agendamentos corretos
- [ ] Filtro de agendamentos funciona
- [ ] Perfil do hospital carrega foto

### DevTools Check
- [ ] Abrir F12 → Console
- [ ] Sem erros 404
- [ ] Sem erros de CORS
- [ ] API respondendo corretamente
- [ ] Imagens carregando

## 🐛 Troubleshooting

### Página em Branco
- [ ] Verificar logs do build no Render
- [ ] Abrir DevTools e ver console
- [ ] Confirmar VITE_API_URL

### Erro 404 nas Rotas
- [ ] Confirmar arquivo `_redirects` está em `public/`
- [ ] Fazer redeploy

### CORS Error
- [ ] Verificar configuração CORS no backend
- [ ] Confirmar URL do frontend no allowedOrigins

### API não responde
- [ ] Testar URL do backend diretamente
- [ ] Verificar se backend está rodando
- [ ] Confirmar VITE_API_URL está correta

### Imagens não carregam
- [ ] Verificar token do Azure
- [ ] Testar URL das imagens diretamente
- [ ] Ver erros no Network tab (F12)

## 📊 URLs Finais

Anote suas URLs após o deploy:

```
Frontend: https://______________________.onrender.com
Backend:  https://______________________.onrender.com
API:      https://______________________.onrender.com/v1/doevida
```

## 🎉 Deploy Completo!

Quando todos os itens estiverem marcados, seu deploy está completo e funcionando! 🚀

**Próximos passos:**
- [ ] Configurar domínio customizado (opcional)
- [ ] Adicionar ao README do projeto
- [ ] Testar no celular
- [ ] Compartilhar com a equipe
