import { watchAuth, login, logout as firebaseLogout } from "../firebase.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

let currentUser = null;

export function mountStatusBar(el) {
  el.innerHTML = `
    <div class="statusbar">
      <div id="authSection">
        <!-- Auth UI will be rendered here -->
      </div>
      <div class="status-grid" style="margin-top: 12px;">
        <div class="status-item">
          <span>Status:</span>
          <span id="connectionStatus" class="status-offline">Offline</span>
        </div>
        <div class="status-item">
          <span>Usuário:</span>
          <span id="userEmail">—</span>
        </div>
        <div class="status-item">
          <span>Versão:</span>
          <span style="font-family: 'Roboto Mono', monospace;">1.0.0</span>
        </div>
      </div>
    </div>
  `;

  const authSection = el.querySelector("#authSection");
  const connectionStatus = el.querySelector("#connectionStatus");
  const userEmail = el.querySelector("#userEmail");

  // Render login form
  function renderLoginForm() {
    authSection.innerHTML = `
      <form id="loginForm" style="display: flex; gap: 8px; align-items: end; flex-wrap: wrap;">
        <label style="flex: 1; min-width: 200px;">
          Email
          <input type="email" id="loginEmail" required placeholder="seu@email.com" 
                 style="width: 100%; padding: 8px; font-size: 13px;">
        </label>
        <label style="flex: 1; min-width: 200px;">
          Senha
          <input type="password" id="loginPassword" required placeholder="••••••" 
                 style="width: 100%; padding: 8px; font-size: 13px;">
        </label>
        <button type="submit" class="btn-add" style="padding: 8px 16px; font-size: 13px;">
          🔐 Entrar
        </button>
      </form>
    `;

    const loginForm = authSection.querySelector("#loginForm");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const email = loginForm.querySelector("#loginEmail").value.trim();
      const password = loginForm.querySelector("#loginPassword").value;

      try {
        await login(email, password);
        notifySuccess(`Bem-vindo, ${email}!`);
      } catch (error) {
        console.error(error);
        notifyError("Erro ao fazer login: " + error.message);
      }
    });
  }

  // Render logout button
  function renderLogoutButton(user) {
    authSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="user-email">${user.email}</span>
        <button id="logoutBtn" class="btn-del" style="padding: 8px 16px; font-size: 13px;">
          🚪 Sair
        </button>
      </div>
    `;

    authSection.querySelector("#logoutBtn").addEventListener("click", async () => {
      try {
        await firebaseLogout();
        notifySuccess("Logout realizado com sucesso!");
      } catch (error) {
        console.error(error);
        notifyError("Erro ao fazer logout: " + error.message);
      }
    });
  }

  // Watch auth state
  watchAuth((user) => {
    currentUser = user;
    
    if (user) {
      connectionStatus.textContent = "Online";
      connectionStatus.className = "status-online";
      userEmail.textContent = user.email;
      renderLogoutButton(user);
    } else {
      connectionStatus.textContent = "Offline";
      connectionStatus.className = "status-offline";
      userEmail.textContent = "—";
      renderLoginForm();
    }
  });

  // Initial render
  renderLoginForm();
}

export function getCurrentUser() {
  return currentUser;
}
