#!/bin/bash

# Script de Build para Render
# Este arquivo é executado automaticamente durante o deploy

echo "🚀 Iniciando build do DoeVida Frontend..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build do projeto
echo "🔨 Compilando projeto..."
npm run build

# Verificar se o build foi bem-sucedido
if [ -d "dist" ]; then
  echo "✅ Build concluído com sucesso!"
  echo "📁 Conteúdo da pasta dist:"
  ls -la dist/
  
  # Verificar se o arquivo _redirects está presente
  if [ -f "dist/_redirects" ]; then
    echo "✅ Arquivo _redirects encontrado"
  else
    echo "⚠️ Arquivo _redirects NÃO encontrado - Rotas podem não funcionar!"
  fi
else
  echo "❌ Erro: pasta dist não foi criada!"
  exit 1
fi

echo "🎉 Deploy pronto para publicação!"
