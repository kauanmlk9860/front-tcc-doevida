# Requisitos do Backend para o Frontend Funcionar

## ⚠️ PROBLEMA ATUAL: Token inválido ou expirado

O agendamento está falhando com erro **403 Forbidden** porque o token de autenticação não é aceito pelo backend.

## 🔧 SOLUÇÃO: Configure o endpoint /login no backend

### Endpoint necessário:

```
POST http://localhost:8080/v1/doevida/login
```

### Payload esperado:
```json
{
  "email": "usuario@email.com",
  "senha": "senha123"
}
```

### Resposta esperada (sucesso):
```json
{
  "status": true,
  "status_code": 200,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Nome do Usuário",
    "email": "usuario@email.com",
    "tipo_sanguineo": "O+",
    // ... outros campos do usuário
  }
}
```

### Resposta esperada (erro):
```json
{
  "status": false,
  "status_code": 401,
  "message": "E-mail ou senha incorretos"
}
```

## 🔐 Requisitos do Token JWT

O token deve ser um **JWT válido** com:

1. **Header**: Algoritmo de assinatura (ex: HS256)
2. **Payload**: Dados do usuário (id, email, exp)
3. **Signature**: Assinatura para validação

### Exemplo de payload do token:
```json
{
  "id": 1,
  "email": "usuario@email.com",
  "exp": 1699999999,  // Timestamp de expiração
  "iat": 1699900000   // Timestamp de criação
}
```

## 📋 Endpoints que requerem autenticação

Todos os endpoints abaixo precisam validar o token enviado no header:

```
Authorization: Bearer <token>
```

### Endpoints protegidos:
- `POST /agendamento` - Criar agendamento
- `GET /agendamento/me` - Listar meus agendamentos
- `PUT /agendamento/:id` - Atualizar agendamento
- `DELETE /agendamento/:id` - Cancelar agendamento
- `GET /usuario/perfil` - Obter perfil do usuário
- `PUT /usuario/:id` - Atualizar usuário

## ✅ Checklist para o Backend

- [ ] Endpoint `POST /login` implementado
- [ ] Geração de token JWT válido
- [ ] Validação de token em endpoints protegidos
- [ ] Retorno correto de erros (401, 403, etc.)
- [ ] CORS configurado para aceitar requisições do frontend
- [ ] Endpoint `/agendamento` aceita tokens válidos

## 🧪 Como testar

### 1. Testar login:
```bash
curl -X POST http://localhost:8080/v1/doevida/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","senha":"senha123"}'
```

### 2. Testar agendamento com token:
```bash
curl -X POST http://localhost:8080/v1/doevida/agendamento \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "id_usuario": 1,
    "id_hospital": 1,
    "data": "2025-11-28",
    "hora": "19:00:00",
    "status": "Agendado"
  }'
```

## 📞 Mensagens de erro atuais

### Erro 404 no /login:
```
⚠️ ERRO: Endpoint /login não encontrado!
⚠️ O backend precisa ter um endpoint POST /login funcionando
⚠️ Endpoint esperado: http://localhost:8080/v1/doevida/login
```

### Erro 403 no /agendamento:
```json
{
  "status": false,
  "status_code": 403,
  "message": "Token inválido ou expirado"
}
```

## 🎯 Próximos passos

1. **Implemente o endpoint `/login`** no backend
2. **Configure a geração de JWT** com biblioteca apropriada (ex: jsonwebtoken)
3. **Valide o token** em todos os endpoints protegidos
4. **Teste o fluxo completo**: Login → Agendamento
5. **Verifique os logs** no console do frontend para confirmar

---

**Nota**: O frontend está configurado corretamente e enviando as requisições no formato esperado. O problema está apenas na ausência ou configuração incorreta do endpoint de login no backend.
