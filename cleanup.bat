@echo off
echo 🧹 Iniciando limpeza do repositório...

echo 📦 Removendo node_modules/ e dist/...
git rm -rf --ignore-unmatch node_modules/
git rm -rf --ignore-unmatch dist/

echo 🔧 Removendo arquivos ngrok...
git rm --ignore-unmatch ngrok-stable-linux-arm.zip
git rm --ignore-unmatch ngrok-stable-linux-arm.zip.1
git rm --ignore-unmatch ngrok-stable-linux-arm.zip.2
git rm --ignore-unmatch ngrok-stable-linux-arm.zip.3
git rm --ignore-unmatch ngrok-stable-linux-arm.zip.4
git rm --ignore-unmatch ngrok-stable-linux-arm.zip.5

echo 🗑️ Removendo arquivos malformados...
git rm --ignore-unmatch "npm run dev"
git rm --ignore-unmatch "package.jsonnpm install"
git rm --ignore-unmatch "package.jsonnpm installnpm run dev"

echo 💾 Criando commit...
git commit -m "chore: remove unnecessary files (node_modules, ngrok, malformed files)"

echo ✅ Limpeza concluída!
echo 📤 Execute 'git push' para enviar as alterações
pause
