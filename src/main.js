import { watchAuth } from "./firebase.js";
import { mountAuth } from "./ui/auth.js";
import { mountForm } from "./ui/form.js";
import { mountTable } from "./ui/table.js";
import { mountDrivers } from "./ui/drivers.js";
import { mountChat } from "./ui/chat.js";
import { mountStatusBar } from "./ui/statusbar.js";
import { mountProntuarios } from "./ui/prontuarios.js";
import { mountReports } from "./ui/reports.js";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");
  
  if (!app) {
    console.error("Elemento #app não encontrado");
    return;
  }
  
  // Verificar autenticação
  watchAuth((user) => {
    if (!user) {
      // Mostrar tela de login
      app.innerHTML = '<div id="authContainer"></div>';
      mountAuth(document.querySelector("#authContainer"));
    } else {
      // Verificar se está aprovado
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      
      if (!currentUser.nome) {
        // Usuário logado mas dados não carregados, aguardar
        return;
      }

      // Mostrar sistema completo
      app.innerHTML = `
        <header class="main-header">
          <h1>🚑 Registro de Chamados – Ambulância Municipal – Guaíçara/SP</h1>
          <span>Usuário: ${currentUser.nome} (${currentUser.funcao})</span>
        </header>
        
        <div class="layout">
          <aside class="sidebar">
            <div id="driversSection"></div>
            <div id="chatSection"></div>
          </aside>
          
          <main class="main-content">
            <div id="formSection"></div>
            <div id="tableSection"></div>
            <div id="prontuariosSection"></div>
            <div id="reportsSection"></div>
          </main>
        </div>
        
        <div id="statusSection"></div>
      `;

      // Montar todas as seções
      const driversEl = document.querySelector("#driversSection");
      const chatEl = document.querySelector("#chatSection");
      const formEl = document.querySelector("#formSection");
      const tableEl = document.querySelector("#tableSection");
      const prontuariosEl = document.querySelector("#prontuariosSection");
      const reportsEl = document.querySelector("#reportsSection");
      const statusEl = document.querySelector("#statusSection");
      
      if (driversEl) mountDrivers(driversEl);
      if (chatEl) mountChat(chatEl);
      if (formEl) mountForm(formEl);
      if (tableEl) mountTable(tableEl);
      if (prontuariosEl) mountProntuarios(prontuariosEl);
      if (reportsEl) mountReports(reportsEl);
      if (statusEl) mountStatusBar(statusEl);
    }
  });
});
