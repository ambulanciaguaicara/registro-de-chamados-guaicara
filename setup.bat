@echo off
echo 🚀 Configurando projeto...

echo 🧹 Passo 1: Limpeza
call cleanup.bat

echo 📦 Passo 2: Instalando dependências...
npm install

echo 🔨 Passo 3: Gerando build...
npm run build

echo.
echo 📤 Passo 4: Enviar alterações para o repositório?
set /p resposta="Digite 'sim' para fazer push ou pressione Enter para pular: "
if "%resposta%"=="sim" (
    git push
    echo ✅ Alterações enviadas com sucesso!
) else (
    echo ⚠️  Push pulado. Execute 'git push' manualmente quando quiser enviar as alterações.
)

echo.
echo ✅ Setup concluído!
echo 🎯 Execute 'npm run dev' para rodar o projeto
pause
