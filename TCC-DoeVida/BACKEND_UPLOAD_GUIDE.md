# Guia de Configuração do Upload de Imagens no Backend

Este guia explica como configurar o backend Node.js/Express para receber e salvar as fotos dos hospitais na pasta `uploads`.

## 1. Instalar Dependências

No seu projeto backend, instale o `multer`:

```bash
npm install multer
```

## 2. Criar a Pasta Uploads

Na raiz do seu backend, crie a pasta `uploads`:

```bash
mkdir uploads
```

## 3. Configurar o Multer

Crie um arquivo `src/config/upload.js` (ou similar):

```javascript
// src/config/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar pasta uploads se não existir
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Pasta onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'hospital-' + uniqueSuffix + ext);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo inválido. Apenas imagens são permitidas.'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;
```

## 4. Criar Rota de Upload

No seu arquivo de rotas de hospital (ex: `src/routes/hospitalRoutes.js`):

```javascript
const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const hospitalController = require('../controllers/hospitalController');

// Outras rotas do hospital...

// Rota para upload de foto do hospital
router.post('/upload-foto', upload.single('foto_hospital'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    // URL relativa para acessar a imagem
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.status(200).json({
      status: true,
      message: 'Upload realizado com sucesso',
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      status: false,
      message: 'Erro ao fazer upload da imagem'
    });
  }
});

module.exports = router;
```

## 5. Servir Arquivos Estáticos

No seu arquivo principal do servidor (ex: `server.js` ou `app.js`):

```javascript
const express = require('express');
const path = require('path');
const app = express();

// ... outras configurações

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ... suas rotas
```

## 6. Atualizar a Rota de Cadastro de Hospital

No seu controller de hospital, ao criar o hospital:

```javascript
// src/controllers/hospitalController.js

const criarHospital = async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      cnpj,
      cep,
      telefone,
      capacidade_maxima,
      convenios,
      crm,
      horario_abertura,
      horario_fechamento,
      foto // Receberá a URL: "/uploads/hospital-123456789.jpg"
    } = req.body;

    // ... validações

    // Se a foto foi fornecida, ela já está no formato correto (URL)
    const novoHospital = await Hospital.create({
      nome,
      email,
      senha: senhaHash, // lembre-se de hashear a senha
      cnpj,
      cep,
      telefone,
      capacidade_maxima,
      convenios,
      crm,
      horario_abertura,
      horario_fechamento,
      foto // Salvar a URL no banco
    });

    res.status(201).json({
      status: true,
      status_code: 201,
      message: 'Hospital criado com sucesso',
      hospital: novoHospital
    });
  } catch (error) {
    console.error('Erro ao criar hospital:', error);
    res.status(500).json({
      status: false,
      message: 'Erro ao criar hospital'
    });
  }
};

module.exports = { criarHospital };
```

## 7. Acessar as Imagens

### No Android Studio (Emulador)

Quando você fizer uma requisição GET para obter dados do hospital, a resposta incluirá:

```json
{
  "id": 1,
  "nome": "Hospital São Lucas",
  "foto": "/uploads/hospital-1732975234567-123456789.jpg",
  ...
}
```

Para exibir a imagem no seu app Android, você deve construir a URL completa:

```kotlin
// Kotlin (Android)
val baseUrl = "http://10.0.2.2:8080" // Para emulador Android
val fotoUrl = baseUrl + hospital.foto // http://10.0.2.2:8080/uploads/hospital-...jpg

// Usar com Glide, Picasso ou Coil para carregar a imagem
Glide.with(context)
    .load(fotoUrl)
    .into(imageView)
```

**Importante**: No emulador Android, use `10.0.2.2` ao invés de `localhost` para acessar o servidor rodando na sua máquina.

### No React (Web)

```javascript
const imageUrl = `${import.meta.env.VITE_API_URL.replace('/v1/doevida', '')}${hospital.foto}`;
// Exemplo: http://localhost:8080/uploads/hospital-123.jpg
```

## 8. Estrutura de Pastas Final

```
seu-backend/
├── src/
│   ├── config/
│   │   └── upload.js
│   ├── controllers/
│   │   └── hospitalController.js
│   ├── routes/
│   │   └── hospitalRoutes.js
│   └── ...
├── uploads/                    ← Pasta com as imagens
│   ├── hospital-123456789.jpg
│   ├── hospital-987654321.png
│   └── ...
├── package.json
└── server.js
```

## 9. Tratamento de Erros

Adicione tratamento para erros comuns:

```javascript
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: false,
        message: 'Arquivo muito grande. Tamanho máximo: 5MB'
      });
    }
  }
  
  res.status(500).json({
    status: false,
    message: error.message || 'Erro no servidor'
  });
});
```

## 10. Git Ignore

Adicione ao `.gitignore` do backend:

```
uploads/
```

Isso evita que as imagens sejam commitadas no repositório.

---

## Resumo do Fluxo

1. **Frontend** seleciona a imagem com `PhotoUpload`
2. **Frontend** envia a imagem via `FormData` para `/hospital/upload-foto`
3. **Backend** recebe a imagem e salva em `uploads/`
4. **Backend** retorna a URL: `/uploads/hospital-123.jpg`
5. **Frontend** envia essa URL junto com os dados do hospital para `/hospital` (POST)
6. **Backend** salva o hospital com a URL da foto no banco de dados
7. **Android App** busca os dados do hospital e constrói a URL completa: `http://10.0.2.2:8080/uploads/hospital-123.jpg`

## Testando

Use o Postman ou Insomnia para testar:

```
POST http://localhost:8080/v1/doevida/hospital/upload-foto
Body: form-data
Key: foto_hospital (File)
Value: [selecionar uma imagem]
```

Resposta esperada:
```json
{
  "status": true,
  "message": "Upload realizado com sucesso",
  "url": "/uploads/hospital-1732975234567-123456789.jpg",
  "filename": "hospital-1732975234567-123456789.jpg"
}
```
