@echo off
echo 🚀 Configurando projeto...

echo 🧹 Passo 1: Limpeza
call cleanup.bat

echo 📦 Passo 2: Instalando dependências...
npm install

echo 🔨 Passo 3: Gerando build...
npm run build

echo 📤 Passo 4: Enviando alterações...
git push origin main

echo ✅ Setup concluído!
echo 🎯 Execute 'npm run dev' para rodar o projeto
pause
