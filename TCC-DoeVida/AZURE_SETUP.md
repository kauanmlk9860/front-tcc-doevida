# Configuração do Azure Storage

## Para Desenvolvimento Local

O projeto está configurado para funcionar em modo desenvolvimento sem necessidade do Azure Storage. As fotos são simuladas localmente.

## Para Produção

### 1. Criar Storage Account no Azure

1. Acesse o [Portal do Azure](https://portal.azure.com)
2. Crie um novo Storage Account
3. Crie um container chamado `imagens-geral` com acesso público para blobs

### 2. Gerar Token SAS

1. No Storage Account, vá em "Shared access signature"
2. Configure as permissões:
   - **Allowed services**: Blob
   - **Allowed resource types**: Container, Object
   - **Allowed permissions**: Read, Add, Create, Write, Delete, List
   - **Start time**: Data atual
   - **Expiry time**: Data futura (ex: 1 ano)
   - **Allowed protocols**: HTTPS only

3. Clique em "Generate SAS and connection string"
4. Copie o **SAS token** (sem o `?` inicial)

### 3. Configurar Variáveis de Ambiente

No arquivo `.env`, configure:

```env
VITE_DEVELOPMENT_MODE=false
VITE_AZURE_STORAGE_URL=https://seustorageaccount.blob.core.windows.net/imagens-geral
VITE_AZURE_SAS_TOKEN=sp=racwdl&st=2024-12-20T00:00:00Z&se=2025-12-31T23:59:59Z&spr=https&sv=2024-11-04&sr=c&sig=SUA_ASSINATURA_AQUI
```

### 4. Testar Upload

1. Reinicie o servidor de desenvolvimento
2. Tente fazer upload de uma foto no cadastro
3. Verifique se a imagem aparece no container do Azure

## Troubleshooting

### Erro 403 (Forbidden)
- Verifique se o token SAS tem as permissões corretas
- Verifique se o token não expirou

### Erro 404 (Not Found)
- Verifique se o container `imagens-geral` existe
- Verifique se a URL do storage account está correta

### Token Expirado
- Gere um novo token SAS com data de expiração futura
- Atualize a variável `VITE_AZURE_SAS_TOKEN` no `.env`