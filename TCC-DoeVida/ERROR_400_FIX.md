# 🔍 Diagnóstico do Erro 400

## ❌ Erro Atual

```
POST http://localhost:8080/v1/doevida/hospital/upload-foto 400 (Bad Request)
```

## 🎯 Causas Possíveis

### 1. Backend não está configurado (MAIS PROVÁVEL ✅)

O erro 400 indica que a rota `/hospital/upload-foto` **não existe** ou **não está configurada corretamente** no seu backend.

**Solução:** Configure o backend seguindo os passos abaixo.

---

## ⚡ Solução Rápida (5 minutos)

### Passo 1: Verificar se a rota existe

No seu backend, procure por uma rota como:

```javascript
router.post('/upload-foto', ...)
```

Se **NÃO EXISTIR**, você precisa criar!

### Passo 2: Criar a configuração do Multer

**Arquivo:** `seu-backend/src/config/upload.js`

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar pasta uploads
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'hospital-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
```

### Passo 3: Criar a rota de upload

**Arquivo:** `seu-backend/src/routes/hospitalRoutes.js` (ou similar)

```javascript
const upload = require('../config/upload');

// Adicione esta rota ANTES das outras rotas de hospital
router.post('/upload-foto', upload.single('foto_hospital'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    console.log('✅ Upload realizado:', imageUrl);
    
    res.status(200).json({
      status: true,
      message: 'Upload realizado com sucesso',
      url: imageUrl
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      status: false,
      message: 'Erro ao fazer upload'
    });
  }
});
```

### Passo 4: Configurar arquivos estáticos

**Arquivo:** `seu-backend/server.js` ou `app.js`

```javascript
const path = require('path');

// ADICIONE ESTA LINHA (antes das rotas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### Passo 5: Instalar dependências

```bash
cd seu-backend
npm install multer
mkdir uploads
```

### Passo 6: Reiniciar o backend

```bash
npm start
# ou
npm run dev
```

---

## 🧪 Testar se Funcionou

### 1. Testar com cURL

```bash
curl -X POST http://localhost:8080/v1/doevida/hospital/upload-foto \
  -F "foto_hospital=@/caminho/para/uma/imagem.jpg"
```

**Resposta esperada:**
```json
{
  "status": true,
  "message": "Upload realizado com sucesso",
  "url": "/uploads/hospital-1732975234567-123.jpg"
}
```

### 2. Testar com Postman

1. Crie uma nova requisição POST
2. URL: `http://localhost:8080/v1/doevida/hospital/upload-foto`
3. Body → form-data
4. Key: `foto_hospital` (tipo: File)
5. Value: Selecione uma imagem
6. Send

---

## 🔄 Solução Temporária (Enquanto configura o backend)

O código foi atualizado para usar **base64 como fallback**. 

**O que isso significa:**
- ✅ O cadastro vai funcionar mesmo sem o backend configurado
- ⚠️ A imagem será salva como texto base64 no banco (não recomendado)
- ⚠️ Imagens muito grandes podem dar erro
- 💡 Configure o backend o quanto antes seguindo os passos acima

**Você verá esta mensagem no console:**
```
⚠️ Upload falhou, usando base64 temporário
💡 Configure o backend seguindo BACKEND_UPLOAD_GUIDE.md
📝 Usando base64 temporário (não recomendado para produção)
```

---

## 📊 Verificar Logs Detalhados

Agora o console mostra mais informações. Quando tentar fazer upload novamente, você verá:

```javascript
📤 Iniciando upload da foto: { name: '...', size: ..., type: '...' }
❌ Erro ao fazer upload da foto do hospital: ...
📋 Detalhes do erro: { status: 400, statusText: '...', data: {...} }
```

**Copie e cole essas informações para análise mais detalhada.**

---

## ❓ Diagnóstico por Código de Erro

| Status | Causa | Solução |
|--------|-------|---------|
| 400 | Rota não configurada | Siga os passos acima |
| 404 | Rota não existe | Verifique se adicionou a rota |
| 500 | Erro no servidor | Verifique logs do backend |
| Sem resposta | Backend não está rodando | Inicie o backend |

---

## 🚨 Checklist Rápido

- [ ] Backend está rodando? (`npm start`)
- [ ] Multer está instalado? (`npm install multer`)
- [ ] Arquivo `upload.js` foi criado?
- [ ] Rota `/upload-foto` foi adicionada?
- [ ] `express.static('/uploads')` foi configurado?
- [ ] Pasta `uploads/` existe?
- [ ] Backend foi reiniciado após as mudanças?

---

## 💡 Dica

Se ainda não quiser configurar o upload agora, o sistema vai funcionar com base64 temporariamente. Mas **configure o mais rápido possível** porque:

- ❌ Base64 aumenta muito o tamanho do banco
- ❌ Pode dar timeout em imagens grandes
- ❌ Não funciona bem com Android
- ✅ Upload com arquivos é a forma correta

---

## 📚 Documentação Completa

- `BACKEND_UPLOAD_GUIDE.md` - Guia completo passo a passo
- `BACKEND_CODE_EXAMPLE.js` - Todo o código pronto
- `QUICK_TEST_GUIDE.md` - Como testar tudo

**Tempo estimado para configurar: 10-15 minutos**
