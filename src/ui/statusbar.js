import { watchAuth, login, logout as firebaseLogout } from "../firebase.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

export function mountStatusBar(el) {
  el.innerHTML = `
    <div class="statusbar">
      <div class="status-grid">
        <div class="status-item">
          <span>Status:</span>
          <span id="statusConexao" class="status-offline">Offline</span>
        </div>
        <div class="status-item">
          <span>Usuário:</span>
          <span id="usuarioLogado" class="user-email">—</span>
        </div>
        <div class="status-item">
          <span>Versão:</span>
          <strong>1.0.0</strong>
        </div>
        <div class="status-item">
          <button class="btn-del" id="btnLogout" style="padding: 6px 16px; font-size: 12px;">Sair</button>
        </div>
      </div>
    </div>
  `;

  const statusConexao = el.querySelector("#statusConexao");
  const usuarioLogado = el.querySelector("#usuarioLogado");
  const btnLogout = el.querySelector("#btnLogout");

  // Watch auth state
  watchAuth((user) => {
    if (user) {
      statusConexao.textContent = "Online";
      statusConexao.className = "status-online";
      usuarioLogado.textContent = user.email;
      btnLogout.style.display = "inline-flex";
    } else {
      statusConexao.textContent = "Offline";
      statusConexao.className = "status-offline";
      usuarioLogado.textContent = "—";
      btnLogout.style.display = "none";
      showLoginPrompt();
    }
  });

  // Logout
  btnLogout.addEventListener("click", async () => {
    if (!confirm("Deseja sair do sistema?")) return;
    
    try {
      await firebaseLogout();
      notifySuccess("Logout realizado com sucesso");
    } catch (error) {
      console.error(error);
      notifyError("Erro ao fazer logout: " + error.message);
    }
  });
}

function showLoginPrompt() {
  const email = prompt("Email:");
  if (!email) return;
  
  const password = prompt("Senha:");
  if (!password) return;

  login(email, password)
    .then(() => {
      notifySuccess("Login realizado com sucesso!");
    })
    .catch((error) => {
      console.error(error);
      notifyError("Erro ao fazer login: " + error.message);
      setTimeout(showLoginPrompt, 2000);
    });
}
