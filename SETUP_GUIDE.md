# 📖 Guia de Configuração - Sistema de Registro de Chamados

## 🎯 Objetivo

Este guia explica como configurar o projeto do zero, removendo arquivos desnecessários e preparando o ambiente para desenvolvimento.

## ⚠️ Problemas Identificados

O repositório contém arquivos que NÃO deveriam estar versionados:

- `node_modules/` (78MB) - Dependências devem ser instaladas localmente
- Arquivos `ngrok-*.zip` (78MB) - Arquivos desnecessários
- Arquivos malformados com nomes inválidos

## ✅ Solução Automatizada

### Opção 1: Script Automático (Recomendado)

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```batch
setup.bat
```

Este script irá:
1. ✅ Remover todos os arquivos desnecessários
2. ✅ Instalar dependências corretas
3. ✅ Gerar build de produção
4. ✅ Perguntar se deseja fazer push das alterações

### Opção 2: Manual

```bash
# 1. Remover arquivos
git rm -rf node_modules/ dist/
git rm ngrok-stable-linux-arm.zip*
git rm "npm run dev" "package.jsonnpm install" "package.jsonnpm installnpm run dev"

# 2. Commit
git commit -m "chore: remove unnecessary files"

# 3. Push
git push origin main

# 4. Instalar dependências
npm install

# 5. Rodar
npm run dev
```

## 🔥 Firebase - Primeira Configuração

1. **Acessar Console:**
   https://console.firebase.google.com/project/registro-ambulancia192

2. **Criar Firestore Database:**
   - Firestore Database → Criar banco de dados
   - Modo: Teste (por enquanto)
   - Localização: southamerica-east1 (São Paulo)

3. **As coleções serão criadas automaticamente:**
   - `usuarios` - ao criar primeiro usuário
   - `chamados` - ao registrar primeiro chamado
   - `motoristas` - ao adicionar primeiro motorista
   - `mensagens` - ao enviar primeira mensagem

## 📱 Rodar no Tablet

```bash
# Rodar com acesso via rede local
npm run dev -- --host
```

Acesse no tablet usando o IP mostrado no terminal:
- Ex: `http://192.168.1.100:5173`

## 🎯 Verificação Final

Execute cada passo e verifique:

- [ ] Arquivos desnecessários removidos do Git
- [ ] `npm install` executado com sucesso
- [ ] `npm run dev` rodando sem erros
- [ ] Tela de login aparecendo
- [ ] Firebase acessível
- [ ] Tablet consegue acessar via rede local

## 🆘 Troubleshooting

### Erro: "git rm: pathspec 'npm run dev' did not match any files"

Significa que o arquivo já foi removido. Prossiga para o próximo passo.

### Erro: "Module not found"

Execute `npm install` novamente.

### Firebase não conecta

Verifique se o arquivo `.env` existe e contém as credenciais corretas.

## 📞 Próximos Passos

1. **Criar primeiro admin:**
   - Cadastrar via interface
   - Aprovar no Firebase Console

2. **Testar funcionalidades:**
   - Criar chamado
   - Adicionar motorista
   - Buscar prontuário
   - Gerar relatório

3. **Deploy na Vercel:**
   - Automático ao fazer push
   - URL: https://registro-de-chamados-guaicara.vercel.app
