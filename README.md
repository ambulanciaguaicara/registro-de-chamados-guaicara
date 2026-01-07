# 🚑 Registro de Chamados – Ambulância Municipal – Guaíçara/SP

Sistema web completo e profissional para registro e gerenciamento de chamados da ambulância municipal, desenvolvido em **Vite + JavaScript** com integração ao **Firebase (Firestore + Authentication)**.

---

## 🆕 Novas Funcionalidades (v2.0.0)

### 🔐 Sistema de Autenticação
- **Login seguro** com email e senha
- **Cadastro de novos usuários** com aprovação de administrador
- **Recuperação de senha** via telefone (SMS)
- **Controle de permissões** por função (atendente, motorista, administrador)
- **Múltiplas unidades** (Cohab, Dom Bosco, Centro)

### 📋 Formulário de Chamados Aprimorado
- Campo **Enfermagem** para registrar profissional de enfermagem
- **Integração em tempo real** com motoristas disponíveis
- **Botões dinâmicos** para adicionar novos destinos, prioridades, finalidades e endereços
- **Validação** de campos obrigatórios
- **Vínculo automático** do chamado ao usuário criador

### 📊 Tabela de Chamados Inteligente
- **Busca em tempo real** por paciente, endereço, destino ou observações
- **Edição controlada**: apenas o criador pode editar/excluir seus chamados
- **Exclusão em lote** de chamados selecionados
- **Sincronização automática** com Firebase Firestore

### 🚗 Gerenciamento de Motoristas
- **Adição dinâmica** de motoristas
- **Atualização de status** em tempo real
  - Disponível na unidade
  - Em atendimento
  - Horário de almoço
  - Viagem
  - Folga
  - Sem Ambulância
- **Histórico de status** salvo no Firestore

### 📁 Prontuários de Pacientes
- **Busca por nome** do paciente
- **Histórico completo** de atendimentos
- **Tabela detalhada** com:
  - Data/Hora
  - Endereço
  - Destino
  - Prioridade
  - Sinais/Sintomas
  - Motorista
  - Enfermagem
  - Atendente responsável

### 📈 Relatórios e Gráficos
- **Filtro por mês/ano** para análise temporal
- **Gráficos interativos** com Chart.js:
  - Chamados por Prioridade
  - Chamados por Destino
  - Chamados por Finalidade
  - Chamados por Período do Dia (Manhã, Tarde, Noite)
- **Exportação para PDF** de alta qualidade
- **Função de impressão** otimizada

### 💬 Chat Interno
- **Comunicação em tempo real** entre equipe
- **Mensagens persistentes** no Firestore
- **Identificação automática** do remetente

### 📊 Barra de Status
- **Status de conexão** (Online/Offline)
- **Usuário logado** com função
- **Última sincronização** com servidor
- **Versão do sistema**
- **Botão de logout**

---

## 📋 Funcionalidades Originais

- Cadastro de chamados com os seguintes campos:
  - **Data e Hora**
  - **Paciente**
  - **Endereço** (lista completa de ruas e avenidas de Guaíçara)
  - **Número do endereço**
  - **Destino** (CAPS, HGP, Santa Casa, Unimed, Fisioterapia, Hapvida, AME)
  - **Motorista** (integrado com sistema de status)
  - **Enfermagem** (novo)
  - **Prioridade** (Autista, Doenças Crônicas, PCD, Idoso, Gestante, Obeso)
  - **Sinais/Sintomas** (Hipertensão, Diabetes, Doença Cardíaca, Respiratória, Dor, Febre, Vômito, Nenhum)
  - **Finalidade** (Pós consulta, Exame, Curativo, Alta hospitalar, Transferência)
  - **Óbito** (Sim/Não)
  - **Família Presente**
  - **Observações**

---

## 🌐 Endereços Disponíveis

### Centro
- Rua Rio Branco
- Rua Rui Barbosa
- Av. Duque de Caxias
- Av. Nove de Julho
- Rua Tiradentes
- Rua Floriano Peixoto
- Rua Osvaldo Cruz

### Bairro São João
- Rua Pedro Bertolino
- Rua Rosa Grande
- Rua Rubens Puorro
- Rua Sebastião de Souza
- Rua João Pacífico da Silva
- Rua José Francisco Moco
- Rua São João

### Bairro Amizade
- Rua Da Amizade
- Rua Adão Afonso Costa
- Rua Dirce Camargo Vaz
- Rua Vicente de Paula

### Outros Endereços
- Av. Paulo Xavier Ribeiro
- Av. Roberto Lima Alves
- Rua Professora Adelaide Baptista Pereira Cruz
- Rua Rogê Ferreira
- Rua Roman Garcia Echeto
- E muitos outros...

---

## 🚀 Como rodar localmente

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

---

## 🛠️ Tecnologias Utilizadas

- **Vite** - Build tool e dev server
- **JavaScript (ES6+)** - Linguagem principal
- **Firebase Firestore** - Banco de dados em tempo real
- **Firebase Authentication** - Sistema de autenticação
- **Chart.js** - Gráficos interativos
- **jsPDF** - Geração de PDFs
- **html2canvas** - Captura de telas para PDF

---

## 📝 Estrutura do Projeto

```
src/
├── ui/
│   ├── auth.js          # Sistema de autenticação
│   ├── form.js          # Formulário de chamados
│   ├── table.js         # Tabela de chamados
│   ├── drivers.js       # Gerenciamento de motoristas
│   ├── prontuarios.js   # Prontuários de pacientes
│   ├── reports.js       # Relatórios e gráficos
│   ├── chat.js          # Chat interno
│   └── statusbar.js     # Barra de status
├── utils/
│   ├── notifications.js # Sistema de notificações
│   └── formatters.js    # Funções de formatação
├── firebase.js          # Configuração Firebase
├── main.js              # Arquivo principal
└── style.css            # Estilos globais
```

---

## 🔒 Segurança

- ✅ Autenticação obrigatória para acesso ao sistema
- ✅ Aprovação de administrador para novos usuários
- ✅ Controle de permissões por função
- ✅ Apenas criador pode editar/excluir seus chamados
- ✅ Uso de jsPDF v4.0.0 (sem vulnerabilidades conhecidas)
- ✅ Dados criptografados no Firebase

---

## 📱 PWA (Progressive Web App)

O sistema pode ser instalado como aplicativo no dispositivo:
- Funciona offline (dados em cache)
- Notificações push (futuro)
- Ícone na tela inicial

---

## 👥 Funções de Usuário

### Atendente
- Criar chamados
- Editar/excluir próprios chamados
- Visualizar prontuários
- Usar chat interno

### Motorista
- Visualizar chamados
- Atualizar próprio status
- Usar chat interno

### Administrador
- Todas as permissões de atendente e motorista
- Aprovar novos usuários
- Gerenciar motoristas
- Gerar relatórios completos
- Exportar dados

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de TI da Prefeitura de Guaíçara/SP.

---

## 📄 Licença

© 2026 Prefeitura Municipal de Guaíçara/SP - Todos os direitos reservados.

---

**Versão:** 2.0.0  
**Última atualização:** Janeiro de 2026
