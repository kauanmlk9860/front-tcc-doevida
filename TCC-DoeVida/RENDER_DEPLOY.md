# 🚀 Deploy do Frontend DoeVida no Render

## 📋 Pré-requisitos

- Conta no [Render](https://render.com) (gratuita)
- Repositório GitHub com o código do frontend
- Backend já deployado (para configurar a URL da API)

---

## 🔧 Arquivos de Configuração Criados

### 1. `render.yaml` ✅
Arquivo de configuração automática do Render que define:
- Tipo de serviço: `static` (site estático)
- Comando de build: `npm install && npm run build`
- Diretório de publicação: `./dist`
- Headers de segurança
- Rewrite rules para React Router

### 2. `_redirects` ✅
Arquivo que garante que todas as rotas do React Router funcionem corretamente no servidor estático.

### 3. `vite.config.js` ✅
Já configurado corretamente para build de produção.

---

## 🚀 Passo a Passo para Deploy

### **1. Preparar Variáveis de Ambiente**

Antes de fazer o deploy, você precisa da URL do seu backend em produção.

**Exemplo:**
```
VITE_API_URL=https://seu-backend.onrender.com/v1/doevida
VITE_DEVELOPMENT_MODE=false
VITE_AZURE_STORAGE_URL=https://doevidastorage.blob.core.windows.net/imagens-geral
VITE_AZURE_SAS_TOKEN=seu_token_azure_aqui
```

---

### **2. Criar Serviço no Render**

#### Opção A: Deploy Automático (Recomendado)

1. **Acesse:** https://render.com
2. **Faça login** ou crie uma conta
3. **Clique em** "New +" → **"Static Site"**
4. **Conecte seu repositório GitHub**
5. **Configure:**
   - **Name:** `doevida-frontend` (ou outro nome)
   - **Branch:** `main`
   - **Root Directory:** `TCC-DoeVida` (se seu projeto está em subpasta)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

6. **Adicione as variáveis de ambiente:**
   - Vá em **"Environment"**
   - Adicione cada variável:
     ```
     VITE_API_URL = https://seu-backend.onrender.com/v1/doevida
     VITE_DEVELOPMENT_MODE = false
     VITE_AZURE_STORAGE_URL = https://doevidastorage.blob.core.windows.net/imagens-geral
     VITE_AZURE_SAS_TOKEN = seu_token_sas
     ```

7. **Clique em** "Create Static Site"

#### Opção B: Deploy via Blueprint (render.yaml)

Se o arquivo `render.yaml` está no repositório:

1. **Clique em** "New +" → **"Blueprint"**
2. **Conecte o repositório**
3. **Selecione** o arquivo `render.yaml`
4. **Configure as variáveis de ambiente** (mesmas de cima)
5. **Clique em** "Apply"

---

### **3. Configurar CORS no Backend**

⚠️ **IMPORTANTE:** Seu backend precisa aceitar requisições do domínio do Render.

No seu backend Node.js, configure CORS:

```javascript
// backend/server.js ou app.js
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://doevida-frontend.onrender.com', // Substitua pela sua URL
  'https://seu-dominio-custom.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

### **4. Verificar Build Local (Opcional)**

Antes de fazer deploy, teste o build localmente:

```bash
# Na pasta TCC-DoeVida
npm run build

# Testar o build
npm run preview
```

Acesse `http://localhost:4173` e teste se tudo funciona.

---

### **5. Monitorar o Deploy**

Após criar o serviço:

1. **Logs:** Acompanhe o build em tempo real
2. **Aguarde** o deploy finalizar (pode levar 2-5 minutos)
3. **Acesse** a URL gerada: `https://seu-app.onrender.com`

---

## 🔍 Verificações Pós-Deploy

### ✅ Checklist

- [ ] Site abre corretamente
- [ ] Login funciona (conecta com backend)
- [ ] Imagens aparecem (Azure Storage)
- [ ] Rotas funcionam (não dá 404 ao recarregar)
- [ ] Cadastro funciona
- [ ] Dashboard carrega dados

### 🐛 Problemas Comuns

#### **1. Página em branco**
- Verifique os logs do build no Render
- Confirme se `VITE_API_URL` está correto
- Abra DevTools (F12) e veja erros no console

#### **2. Erro 404 nas rotas**
- Confirme que o arquivo `_redirects` está na pasta `dist`
- Adicione na configuração do Vite:

```javascript
// vite.config.js
export default defineConfig({
  // ... outras configs
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      }
    }
  }
})
```

#### **3. Erro de CORS**
- Configure CORS no backend (veja passo 3)
- Verifique se a URL do backend está correta

#### **4. Imagens não carregam**
- Verifique `VITE_AZURE_STORAGE_URL`
- Confirme que o token SAS está válido
- Teste as URLs das imagens diretamente no navegador

#### **5. API não responde**
- Confirme que o backend está rodando
- Teste a URL do backend diretamente:
  ```
  https://seu-backend.onrender.com/v1/doevida/hospital
  ```
- Verifique se o backend tem auto-sleep desabilitado

---

## 🔄 Redeploy e Atualizações

### Deploy Automático
Render faz deploy automaticamente a cada push na branch principal.

### Deploy Manual
1. Vá no dashboard do Render
2. Clique em "Manual Deploy"
3. Selecione a branch
4. Clique em "Deploy"

### Limpar Cache
Se as mudanças não aparecem:
1. Vá em "Settings"
2. Role até "Build & Deploy"
3. Clique em "Clear build cache & deploy"

---

## ⚙️ Otimizações

### 1. Adicionar Domínio Customizado
1. **Settings** → **Custom Domains**
2. **Add Custom Domain**
3. Configure os DNS records no seu provedor:
   ```
   CNAME @ seu-app.onrender.com
   ```

### 2. Configurar Auto-Deploy
- **Settings** → **Build & Deploy**
- Habilite "Auto-Deploy: Yes"

### 3. Branch Previews
- **Settings** → **Pull Request Previews**
- Habilite para testar mudanças antes do merge

---

## 📊 Monitoramento

### Logs
```
Dashboard → Logs → Ver logs em tempo real
```

### Métricas
```
Dashboard → Metrics → Bandwidth, requests, etc.
```

### Alertas
Configure notificações de deploy no Discord/Slack

---

## 💰 Plano Gratuito vs Pago

### Gratuito (Static Sites)
- ✅ 100 GB bandwidth/mês
- ✅ Deploy ilimitados
- ✅ SSL automático
- ✅ Custom domains
- ⚠️ Suspend após 15 min inatividade (apenas serviços web, não static sites)

### Pago (Starter - $7/mês)
- ✅ Sem suspensão
- ✅ Mais recursos
- ✅ Prioridade no suporte

**Para static sites, o plano gratuito é suficiente!**

---

## 🎯 URLs Finais

Após o deploy:

- **Frontend:** `https://seu-app.onrender.com`
- **Backend:** `https://seu-backend.onrender.com`
- **API:** `https://seu-backend.onrender.com/v1/doevida`

---

## 📱 Testar no Celular

```
1. Acesse a URL do Render pelo navegador do celular
2. Adicione à tela inicial para simular um app
3. Teste login, cadastro, agendamentos
```

---

## 🆘 Suporte

Se precisar de ajuda:

1. **Logs do Render:** Primeiro lugar para verificar erros
2. **DevTools do navegador:** F12 → Console → Network
3. **Documentação Render:** https://render.com/docs
4. **Stack Overflow:** Tag `render` + `vite`

---

## ✅ Resumo Rápido

```bash
# 1. Commit e push do código
git add .
git commit -m "Configuração para deploy no Render"
git push origin main

# 2. No Render:
# - New Static Site
# - Conectar GitHub
# - Branch: main
# - Build: npm install && npm run build
# - Publish: dist
# - Adicionar variáveis de ambiente

# 3. Deploy automático começará
# 4. Aguardar 2-5 minutos
# 5. Acessar URL gerada
```

**Tempo estimado total: 10-15 minutos** ⏱️

---

## 🎉 Pronto!

Seu frontend está no ar! 🚀

URLs importantes:
- Dashboard: https://dashboard.render.com
- Documentação: https://render.com/docs/deploy-vite
- Status: https://status.render.com
