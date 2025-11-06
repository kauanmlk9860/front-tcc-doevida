# 🔧 Solução Temporária - Login do Hospital

## ⚠️ Problema Identificado

O backend **NÃO possui endpoint de login** (`POST /login`), causando erro 401 (Unauthorized).

---

## ✅ Solução Implementada

Como não existe endpoint de autenticação, implementei uma **solução temporária** que funciona com os endpoints existentes:

### **Como Funciona:**

1. **Buscar todos os hospitais:** `GET /v1/doevida/hospital`
2. **Procurar pelo email** no array retornado
3. **Validar senha** localmente (comparação simples)
4. **Gerar token temporário** usando `btoa()`
5. **Salvar dados** e redirecionar para dashboard

---

## 🔑 Fluxo de Login Atual

```javascript
// 1. Usuário digita email e senha
email: "hospital@exemplo.com"
senha: "senha123"

// 2. Sistema busca TODOS os hospitais
GET /v1/doevida/hospital

// 3. Procura hospital pelo email
const hospital = hospitais.find(h => h.email === email)

// 4. Valida senha (comparação direta)
if (hospital.senha === senha) {
  // Login OK
}

// 5. Gera token temporário
const token = btoa(JSON.stringify({
  id: hospital.id,
  email: hospital.email,
  role: 'HOSPITAL',
  exp: Date.now() + 24h
}))

// 6. Salva e redireciona
localStorage.setItem('token', token)
localStorage.setItem('usuario', JSON.stringify(hospital))
navigate('/hospital-dashboard')
```

---

## ⚠️ IMPORTANTE - Segurança

### **Esta solução é TEMPORÁRIA e NÃO é segura para produção!**

**Problemas:**
- ❌ Senha é comparada no frontend (visível no código)
- ❌ Senha trafega em texto puro
- ❌ Token não é validado pelo backend
- ❌ Qualquer pessoa pode ver a senha no banco de dados
- ❌ Não há criptografia

### **O que o Backend PRECISA implementar:**

```javascript
// Endpoint de Login
POST /v1/doevida/login
{
  "email": "hospital@exemplo.com",
  "senha": "senha123"
}

// Resposta
{
  "status": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Hospital São Lucas",
    "email": "hospital@exemplo.com",
    "cnpj": "12345678000190",
    // ... outros campos (SEM A SENHA!)
  }
}
```

**Requisitos do Backend:**
1. ✅ Endpoint `POST /login`
2. ✅ Validação de senha com hash (bcrypt, argon2, etc.)
3. ✅ Geração de JWT com expiração
4. ✅ Middleware de autenticação para rotas protegidas
5. ✅ **NUNCA** retornar a senha na resposta

---

## 🚀 Como Usar (Temporariamente)

### 1. **Cadastrar Hospital:**
```
http://localhost:5173/hospital-cadastro

Preencha:
- Nome: Hospital São Lucas
- Email: hospital@exemplo.com
- Senha: senha123
- CNPJ: 12.345.678/0001-90
- ... outros campos
```

### 2. **Fazer Login:**
```
http://localhost:5173/hospital-login

Digite:
- Email: hospital@exemplo.com
- Senha: senha123 (a MESMA que cadastrou)
```

### 3. **Sistema vai:**
- Buscar todos hospitais
- Encontrar pelo email
- Comparar senha
- Gerar token temporário
- Redirecionar para dashboard

---

## 📊 Endpoints Utilizados

| Ação | Endpoint | Método |
|---|---|---|
| Login | `/hospital` | GET (busca todos) |
| Perfil | `/hospital/:id` | GET |
| Agendamentos | `/agendamento` | GET |
| Concluir | `/agendamento/:id` | PUT |
| Cancelar | `/agendamento/:id` | DELETE |

---

## 🔐 Recomendações para Produção

### **Backend deve implementar:**

```javascript
// 1. Endpoint de Login
app.post('/v1/doevida/login', async (req, res) => {
  const { email, senha } = req.body;
  
  // Buscar usuário/hospital no banco
  const usuario = await buscarPorEmail(email);
  
  if (!usuario) {
    return res.status(404).json({
      status: false,
      message: 'Usuário não encontrado'
    });
  }
  
  // Validar senha com bcrypt
  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  
  if (!senhaValida) {
    return res.status(401).json({
      status: false,
      message: 'Senha incorreta'
    });
  }
  
  // Gerar JWT
  const token = jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email,
      role: usuario.cnpj ? 'HOSPITAL' : 'USUARIO'
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
  
  // Retornar SEM a senha
  const { senha_hash, senha, ...usuarioSemSenha } = usuario;
  
  res.json({
    status: true,
    token,
    usuario: usuarioSemSenha
  });
});

// 2. Middleware de Autenticação
function autenticar(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'Token não fornecido'
    });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'Token inválido'
    });
  }
}

// 3. Rotas Protegidas
app.get('/v1/doevida/perfil', autenticar, async (req, res) => {
  const usuario = await buscarPorId(req.usuario.id);
  res.json({ status: true, usuario });
});
```

---

## 📝 Checklist de Segurança

### **Antes de ir para produção:**

- [ ] Implementar endpoint `POST /login` no backend
- [ ] Usar bcrypt/argon2 para hash de senhas
- [ ] Gerar JWT no backend
- [ ] Criar middleware de autenticação
- [ ] Proteger rotas sensíveis
- [ ] NUNCA retornar senha nas respostas
- [ ] Implementar rate limiting
- [ ] Adicionar HTTPS
- [ ] Validar inputs no backend
- [ ] Implementar refresh tokens
- [ ] Adicionar logs de auditoria

---

## ⚡ Solução Rápida

Se você quiser fazer funcionar **AGORA** sem mudar o backend:

### **A solução atual já funciona!** ✅

Basta:
1. Cadastrar hospital com senha
2. Fazer login com mesmo email/senha
3. Sistema valida localmente
4. Dashboard funciona normalmente

**MAS LEMBRE-SE:** Isso é **APENAS para desenvolvimento/testes**!

---

## 🎯 Próximos Passos

1. **Curto Prazo (Desenvolvimento):**
   - ✅ Usar solução atual para testar funcionalidades
   - ✅ Desenvolver dashboard completo
   - ✅ Testar fluxos de trabalho

2. **Médio Prazo (Antes de Produção):**
   - ⚠️ Backend implementar endpoint de login
   - ⚠️ Implementar autenticação JWT adequada
   - ⚠️ Adicionar middleware de segurança

3. **Longo Prazo (Produção):**
   - 🔒 Auditoria de segurança completa
   - 🔒 Testes de penetração
   - 🔒 Certificado SSL/HTTPS
   - 🔒 Monitoramento de segurança

---

## 💡 Dica

Para testar agora:

```bash
# 1. Inicie o backend
cd backend
npm start

# 2. Inicie o frontend
cd frontend
npm run dev

# 3. Cadastre um hospital
http://localhost:5173/hospital-cadastro

# 4. Faça login
http://localhost:5173/hospital-login

# 5. Acesse o dashboard
http://localhost:5173/hospital-dashboard
```

**Funciona perfeitamente para desenvolvimento!** 🚀

Mas **não esqueça** de implementar autenticação adequada antes de produção! 🔐
