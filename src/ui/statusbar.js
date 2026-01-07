export function mountStatusBar(el) {
  el.innerHTML = `
    <footer class="status-bar">
      <div id="statusConexao">
        Status: <span class="status-online">Online</span>
      </div>
      <div id="usuarioLogado">Usuário: —</div>
      <div id="ultimaSync">Última sync: —</div>
      <div>Versão: 2.0.0</div>
      <button class="btn-del" id="btnLogout">Sair</button>
    </footer>
  `;

  setupStatusBarEvents(el);
  updateUserInfo();
  updateConnectionStatus();
  setInterval(updateConnectionStatus, 30000); // Atualizar a cada 30s
}

function setupStatusBarEvents(root) {
  root.querySelector("#btnLogout").addEventListener("click", async () => {
    if (confirm("Deseja sair do sistema?")) {
      localStorage.removeItem("currentUser");
      window.location.reload();
    }
  });
}

function updateUserInfo() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userEl = document.querySelector("#usuarioLogado");
  
  if (userEl && currentUser.nome) {
    userEl.textContent = `Usuário: ${currentUser.nome} (${currentUser.funcao || "—"})`;
  }
}

function updateConnectionStatus() {
  const statusEl = document.querySelector("#statusConexao span");
  const syncEl = document.querySelector("#ultimaSync");
  
  if (statusEl) {
    if (navigator.onLine) {
      statusEl.textContent = "Online";
      statusEl.className = "status-online";
    } else {
      statusEl.textContent = "Offline";
      statusEl.className = "status-offline";
    }
  }
  
  if (syncEl) {
    const now = new Date();
    syncEl.textContent = `Última sync: ${now.toLocaleTimeString("pt-BR")}`;
  }
}

// Listener para mudanças de conexão
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
