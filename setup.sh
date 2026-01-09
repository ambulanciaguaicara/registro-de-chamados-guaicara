#!/bin/bash

echo "🚀 Configurando projeto..."

# Limpar repositório
echo "🧹 Passo 1: Limpeza"
./cleanup.sh

# Instalar dependências
echo "📦 Passo 2: Instalando dependências..."
npm install

# Build
echo "🔨 Passo 3: Gerando build..."
npm run build

# Push
echo "📤 Passo 4: Enviando alterações..."
git push origin main

echo "✅ Setup concluído!"
echo "🎯 Execute 'npm run dev' para rodar o projeto"
