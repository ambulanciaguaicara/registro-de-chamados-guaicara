# 🚑 Registro de Chamados – Ambulância Municipal – Guaíçara/SP

Sistema web para registro e gerenciamento de chamados da ambulância municipal, desenvolvido em **Vite + JavaScript** com integração ao **Firebase**.

---

## 📋 Funcionalidades

- Cadastro de chamados com os seguintes campos:
  - **Data e Hora**
  - **Paciente**
  - **Endereço** (lista completa de ruas e avenidas de Guaíçara)
  - **Número do endereço**
  - **Destino** (CAPS, HGP, Santa Casa, Unimed, Fisioterapia, Hapvida, AME)
  - **Motorista**
  - **Chegada do Motorista** (horário de chegada)
  - **Prioridade** (Autista, Doenças Crônicas, PCD, Idoso, Gestante, Obeso)
  - **Sinais/Sintomas** (Hipertensão, Diabetes, Doença Cardíaca, Respiratória, Dor, Febre, Vômito, Nenhum)
  - **Finalidade** (Pós consulta, Exame, Curativo, Alta hospitalar, Transferência)
  - **Óbito** (Sim/Não)
  - **Observações**
  - **Tipo de Chamado** (Normal, Urgência, Emergência)

- **Tabela dinâmica** com todos os chamados registrados.
- **Ações disponíveis:**
  - Adicionar chamado
  - Excluir chamados selecionados
  - Replicar chamado selecionado
- **Chat interno** para comunicação rápida entre equipe.
- **Rodapé com status:**
  - Conexão (online/offline)
  - Usuário logado
  - Última sincronização
  - Versão do sistema

---

## 🌐 Endereços disponíveis

Lista completa de endereços cadastrados no sistema:

- Rua Rio Branco  
- Rua Rui Barbosa  
- Av. Paulo Xavier Ribeiro  
- Rua Pedro Bertolino  
- Rua Professora Adelaide Baptista Pereira Cruz  
- Av. Roberto Lima Alves  
- Rua Rogê Ferreira  
- Rua Roman Garcia Echeto  
- Rua Rosa Grande  
- Rua Rubens Puorro  
- Rua Sabino  
- Rua Sebastião de Souza  
- Rua Pedro Dutra Sobrinho  
- Rua Osvaldo Cruz  
- Rua Dirce Camargo Vaz  
- Rua João Pacífico da Silva  
- Rua Ayrton Alves dos Santos  
- Rua José Francisco Moco  
- Av. Duque de Caxias  
- Av. Nove de Julho  
- Rua Adão Afonso Costa  
- Rua Yoshi Sato  
- Rua Sunao Katsuki  
- Rua Frei Henrique  
- Rua José do Patrocínio  
- Rua Tiradentes  
- Rua Da Amizade  

---

## 🚀 Como rodar localmente

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
