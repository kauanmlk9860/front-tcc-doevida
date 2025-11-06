# 🏥 Endpoints do Backend - Sistema de Hospitais

Este documento descreve todos os endpoints necessários no backend para suportar o sistema de dashboard de hospitais.

## 📋 Índice
1. [Autenticação](#autenticação)
2. [Agendamentos do Hospital](#agendamentos-do-hospital)
3. [Estatísticas](#estatísticas)
4. [Perfil do Hospital](#perfil-do-hospital)

---

## 🔐 Autenticação

### POST `/v1/doevida/hospital/login`
Login específico para hospitais.

**Request Body:**
```json
{
  "email": "hospital@exemplo.com",
  "senha": "senha123"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "status_code": 200,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "hospital": {
    "id": 1,
    "nome": "Hospital São Lucas",
    "email": "hospital@exemplo.com",
    "cnpj": "12345678000190",
    "telefone": "11987654321",
    "cep": "01234567",
    "capacidade_maxima": 50,
    "convenios": "SUS, Unimed, Amil",
    "horario_abertura": "07:00:00",
    "horario_fechamento": "19:00:00",
    "foto": "https://...",
    "role": "HOSPITAL"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "status": false,
  "status_code": 401,
  "message": "E-mail ou senha incorretos"
}
```

---

### GET `/v1/doevida/hospital/perfil`
Obter perfil do hospital logado (requer autenticação).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "status_code": 200,
  "hospital": {
    "id": 1,
    "nome": "Hospital São Lucas",
    "email": "hospital@exemplo.com",
    "cnpj": "12345678000190",
    "telefone": "11987654321",
    "cep": "01234567",
    "capacidade_maxima": 50,
    "convenios": "SUS, Unimed, Amil",
    "horario_abertura": "07:00:00",
    "horario_fechamento": "19:00:00",
    "foto": "https://...",
    "role": "HOSPITAL"
  }
}
```

---

## 📅 Agendamentos do Hospital

### GET `/v1/doevida/hospital/agendamentos`
Listar todos os agendamentos do hospital logado (requer autenticação).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (opcionais):**
- `status` - Filtrar por status: "Agendado", "Concluído", "Cancelado"
- `data` - Filtrar por data específica (YYYY-MM-DD)
- `dataInicio` - Data inicial do período (YYYY-MM-DD)
- `dataFim` - Data final do período (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "status": true,
  "status_code": 200,
  "agendamentos": [
    {
      "id": 1,
      "data": "2025-11-10",
      "hora": "09:00:00",
      "status": "Agendado",
      "id_usuario": 5,
      "id_hospital": 1,
      "id_doacao": null,
      "usuario": {
        "id": 5,
        "nome": "João Silva",
        "email": "joao@email.com",
        "telefone": "11987654321",
        "tipo_sanguineo": "O+",
        "cpf": "12345678900"
      }
    }
  ]
}
```

---

### GET `/v1/doevida/hospital/agendamentos/hoje`
Buscar agendamentos do dia atual (requer autenticação).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "status_code": 200,
  "agendamentos": [
    {
      "id": 1,
      "data": "2025-11-06",
      "hora": "09:00:00",
      "status": "Agendado",
      "usuario": {
        "id": 5,
        "nome": "João Silva",
        "email": "joao@email.com",
        "telefone": "11987654321",
        "tipo_sanguineo": "O+"
      }
    }
  ]
}
```

---

### GET `/v1/doevida/hospital/agendamento/:id`
Buscar detalhes de um agendamento específico (requer autenticação).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "status_code": 200,
  "agendamento": {
    "id": 1,
    "data": "2025-11-10",
    "hora": "09:00:00",
    "status": "Agendado",
    "id_usuario": 5,
    "id_hospital": 1,
    "id_doacao": null,
    "usuario": {
      "id": 5,
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "11987654321",
      "tipo_sanguineo": "O+",
      "cpf": "12345678900",
      "data_nascimento": "1990-05-15"
    }
  }
}
```

---

### PUT `/v1/doevida/hospital/agendamento/:id/concluir`
Marcar uma doação como concluída (requer autenticação).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "Concluído",
  "observacoes": "Doação realizada com sucesso"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "status_code": 200,
  "message": "Doação confirmada com sucesso",
  "agendamento": {
    "id": 1,
    "data": "2025-11-10",
    "hora": "09:00:00",
    "status": "Concluído",
    "observacoes": "Doação realizada com sucesso"
  }
}
```

---

### PUT `/v1/doevida/hospital/agendamento/:id/cancelar`
Cancelar um agendamento (requer autenticação).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "Cancelado",
  "motivo": "Paciente não compareceu"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "status_code": 200,
  "message": "Agendamento cancelado com sucesso",
  "agendamento": {
    "id": 1,
    "status": "Cancelado",
    "motivo": "Paciente não compareceu"
  }
}
```

---

### PUT `/v1/doevida/hospital/agendamento/:id`
Atualizar status ou informações de um agendamento (requer autenticação).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "Em espera",
  "observacoes": "Aguardando exames"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "status_code": 200,
  "message": "Agendamento atualizado com sucesso",
  "agendamento": {
    "id": 1,
    "status": "Em espera",
    "observacoes": "Aguardando exames"
  }
}
```

---

## 📊 Estatísticas

### GET `/v1/doevida/hospital/estatisticas`
Obter estatísticas do hospital (requer autenticação).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (opcionais):**
- `periodo` - Período das estatísticas: "dia", "semana", "mes", "ano" (padrão: "mes")

**Response (200 OK):**
```json
{
  "status": true,
  "status_code": 200,
  "estatisticas": {
    "totalAgendamentos": 150,
    "agendamentosConcluidos": 120,
    "agendamentosPendentes": 25,
    "agendamentosCancelados": 5,
    "periodo": "mes",
    "dataInicio": "2025-10-01",
    "dataFim": "2025-10-31"
  }
}
```

---

## 🔒 Notas de Segurança

1. **Autenticação JWT**: Todos os endpoints protegidos requerem token JWT válido
2. **Validação de Role**: O backend deve validar que o token pertence a um HOSPITAL
3. **Isolamento de Dados**: Cada hospital só pode acessar seus próprios agendamentos
4. **Rate Limiting**: Implementar limite de requisições para prevenir abuso

---

## 🎯 Regras de Negócio

### Status de Agendamentos
- **Agendado**: Status inicial quando o usuário agenda
- **Em espera**: Doador chegou mas aguarda atendimento
- **Concluído**: Doação foi realizada com sucesso
- **Cancelado**: Agendamento foi cancelado (por hospital ou usuário)

### Permissões
- Hospital pode **visualizar** todos os agendamentos feitos para ele
- Hospital pode **concluir** agendamentos com status "Agendado" ou "Em espera"
- Hospital pode **cancelar** agendamentos com status "Agendado" ou "Em espera"
- Hospital **não pode** alterar agendamentos de outros hospitais

### Notificações (Futuro)
- Quando hospital concluir doação → notificar usuário
- Quando hospital cancelar → notificar usuário com motivo
- Quando usuário agendar → notificar hospital

---

## 📝 Exemplo de Fluxo Completo

### 1. Hospital faz login
```bash
POST /v1/doevida/hospital/login
{
  "email": "hospital@exemplo.com",
  "senha": "senha123"
}
```

### 2. Hospital visualiza agendamentos de hoje
```bash
GET /v1/doevida/hospital/agendamentos/hoje
Authorization: Bearer {token}
```

### 3. Hospital confirma conclusão de uma doação
```bash
PUT /v1/doevida/hospital/agendamento/1/concluir
Authorization: Bearer {token}
{
  "status": "Concluído",
  "observacoes": "Doação realizada com sucesso"
}
```

### 4. Usuário verifica histórico e vê doação concluída
```bash
GET /v1/doevida/agendamento/me
Authorization: Bearer {token_usuario}
```

---

## ⚠️ Erros Comuns

### 401 Unauthorized
```json
{
  "status": false,
  "status_code": 401,
  "message": "Token inválido ou expirado"
}
```

### 403 Forbidden
```json
{
  "status": false,
  "status_code": 403,
  "message": "Acesso negado. Apenas hospitais podem acessar este recurso"
}
```

### 404 Not Found
```json
{
  "status": false,
  "status_code": 404,
  "message": "Agendamento não encontrado"
}
```

### 400 Bad Request
```json
{
  "status": false,
  "status_code": 400,
  "message": "Dados inválidos",
  "errors": [
    "Status deve ser: Agendado, Em espera, Concluído ou Cancelado"
  ]
}
```

---

## 🚀 Próximos Passos

1. Implementar endpoints no backend
2. Adicionar validação de JWT com role HOSPITAL
3. Criar testes unitários para cada endpoint
4. Implementar sistema de notificações
5. Adicionar logs de auditoria para ações dos hospitais
6. Implementar dashboard de analytics para hospitais

---

**Versão:** 1.0.0  
**Data:** 06/11/2025  
**Autor:** Sistema DoeVida
