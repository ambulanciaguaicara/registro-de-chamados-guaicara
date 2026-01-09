#!/bin/bash

echo "🧹 Iniciando limpeza do repositório..."

# Remover node_modules e dist
echo "📦 Removendo node_modules/ e dist/..."
git rm -rf node_modules/
git rm -rf dist/

# Remover arquivos ngrok
echo "🔧 Removendo arquivos ngrok..."
git rm ngrok-stable-linux-arm.zip
git rm ngrok-stable-linux-arm.zip.1
git rm ngrok-stable-linux-arm.zip.2
git rm ngrok-stable-linux-arm.zip.3
git rm ngrok-stable-linux-arm.zip.4
git rm ngrok-stable-linux-arm.zip.5

# Remover arquivos malformados
echo "🗑️ Removendo arquivos malformados..."
git rm "npm run dev"
git rm "package.jsonnpm install"
git rm "package.jsonnpm installnpm run dev"

# Commit
echo "💾 Criando commit..."
git commit -m "chore: remove unnecessary files (node_modules, ngrok, malformed files)"

echo "✅ Limpeza concluída!"
echo "📤 Execute 'git push origin main' para enviar as alterações"
