#!/bin/bash

echo "🚀 Configurando projeto..."

# Garantir que cleanup.sh tenha permissão de execução
chmod +x cleanup.sh

# Limpar repositório
echo "🧹 Passo 1: Limpeza"
bash cleanup.sh

# Instalar dependências
echo "📦 Passo 2: Instalando dependências..."
npm install

# Build
echo "🔨 Passo 3: Gerando build..."
npm run build

# Perguntar antes de fazer push
echo ""
echo "📤 Passo 4: Enviar alterações para o repositório?"
read -p "Digite 'sim' para fazer push ou qualquer outra tecla para pular: " resposta
if [ "$resposta" = "sim" ]; then
    git push
    echo "✅ Alterações enviadas com sucesso!"
else
    echo "⚠️  Push pulado. Execute 'git push' manualmente quando quiser enviar as alterações."
fi

echo ""
echo "✅ Setup concluído!"
echo "🎯 Execute 'npm run dev' para rodar o projeto"
