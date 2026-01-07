import { mountForm } from "./ui/form.js";
import { mountTable } from "./ui/table.js";
import { mountDrivers } from "./ui/drivers.js";
import { mountChat } from "./ui/chat.js";
import { mountStatusBar } from "./ui/statusbar.js";
import "./styles.css";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");
  
  app.innerHTML = `
    <header>
      <h1>Registro de Chamados – Ambulância Municipal – Guaíçara/SP</h1>
    </header>
    
    <div class="layout">
      <aside class="sidebar">
        <div id="driversSection"></div>
        <div id="chatSection"></div>
      </aside>
      
      <main class="main-content">
        <div id="formSection"></div>
        <div id="tableSection"></div>
      </main>
    </div>
    
    <div id="statusSection"></div>
  `;

  mountDrivers(document.querySelector("#driversSection"));
  mountChat(document.querySelector("#chatSection"));
  mountForm(document.querySelector("#formSection"));
  mountTable(document.querySelector("#tableSection"));
  mountStatusBar(document.querySelector("#statusSection"));
});
