# 🚑 Sistema de Registro de Chamados - Ambulância Municipal Guaíçara/SP

Sistema completo e profissional para gerenciamento de chamados de ambulância.

## 🚀 Funcionalidades

- ✅ Registro completo de chamados
- ✅ Gestão de motoristas em tempo real
- ✅ Chat interno para equipe
- ✅ Sistema de autenticação
- ✅ Notificações visuais
- ✅ Integração Firebase Firestore
- ✅ Interface responsiva tema "Ambulância"

## 🛠️ Tecnologias

- Vite
- Firebase (Firestore + Auth)
- JavaScript ES6+ Modules
- CSS3 (Tema Ambulância)

## 📦 Instalação

```bash
npm install
npm run dev
```

## 🔥 Deploy

```bash
npm run build
vercel --prod
```

## 📁 Estrutura do Projeto

```
src/
├── main.js                    # Bootstrap da aplicação
├── firebase.js                # Configuração Firebase Firestore
├── styles.css                 # Tema visual Ambulância
│
├── ui/                        # Componentes de interface
│   ├── form.js                # Formulário de chamados
│   ├── table.js               # Tabela de chamados
│   ├── chat.js                # Chat em tempo real
│   ├── drivers.js             # Gestão de motoristas
│   └── statusbar.js           # Barra de status + autenticação
│
├── data/                      # Dados e constantes
│   ├── constants.js           # Constantes do sistema
│   └── streets.js             # Lista de ruas
│
└── utils/                     # Utilitários
    ├── formatters.js          # Formatadores de data/hora
    ├── validators.js          # Validadores
    └── notifications.js       # Sistema de notificações
```

## 📄 Licença

MIT © 2026 Prefeitura de Guaíçara/SP
