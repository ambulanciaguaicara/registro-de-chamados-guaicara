import { mountForm } from "./ui/form.js";
import { mountTable } from "./ui/table.js";
import { mountDrivers } from "./ui/drivers.js";
import { mountChat } from "./ui/chat.js";
import { mountStatusBar } from "./ui/statusbar.js";
import { mountGraph } from "./ui/graph.js";
import { mountDriverHistory } from "./ui/driverHistory.js";
import { mountProntuario } from "./ui/prontuario.js";
import { mountBuscaPacientes } from "./ui/buscaPacientes.js";
import "./styles.css";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");

  // Tela de login visual
  function renderLoginForm(errorMsg = "") {
    app.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #f5f5f5;">
        <form id="loginForm" style="background: #fff; padding: 32px 28px; border-radius: 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.10); min-width: 320px; max-width: 90vw;">
          <h2 style="color: #CC0000; text-align: center; margin-bottom: 24px;">Acesso ao Sistema</h2>
          <div style="margin-bottom: 16px;">
            <label for="loginEmail" style="font-weight: 600;">E-mail</label>
            <input type="email" id="loginEmail" required placeholder="Digite seu e-mail" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; margin-top: 4px;">
          </div>
          <div style="margin-bottom: 20px;">
            <label for="loginPassword" style="font-weight: 600;">Senha</label>
            <input type="password" id="loginPassword" required placeholder="Digite sua senha" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; margin-top: 4px;">
          </div>
          <button type="submit" style="width: 100%; background: linear-gradient(135deg, #CC0000, #990000); color: #fff; font-weight: 700; border: none; border-radius: 8px; padding: 12px; font-size: 16px; cursor: pointer;">Entrar</button>
          <div style="color: #b71c1c; margin-top: 16px; min-height: 24px; text-align: center; font-size: 14px;">${errorMsg}</div>
          <div style="margin-top: 18px; text-align: center;">
            <a href="#" id="linkCadastro" style="color: #0047AB; text-decoration: underline; font-size: 15px;">Criar novo usuário</a>
          </div>
        </form>
      </div>
    `;

    const form = document.getElementById("loginForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.loginEmail.value.trim();
      const password = form.loginPassword.value;
      try {
        const { login, auth } = await import("./firebase.js");
        const userCredential = await login(email, password);
        const user = userCredential.user;
        // Permitir login do admin mesmo sem verificação
        if (
          user.email === "ambulanciadeguaicara@gmail.com" ||
          user.emailVerified
        ) {
          renderApp();
        } else {
          // Deslogar se não for admin e não estiver verificado
          await auth.signOut();
          renderLoginForm("Verifique seu e-mail antes de acessar o sistema.");
        }
      } catch (err) {
        renderLoginForm("E-mail ou senha inválidos.");
      }
    });

    // Link para cadastro
    document.getElementById("linkCadastro").onclick = (e) => {
      e.preventDefault();
      renderCadastroForm();
    };
  }

  function renderCadastroForm(errorMsg = "") {
    app.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #f5f5f5;">
        <form id="cadastroForm" style="background: #fff; padding: 32px 28px; border-radius: 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.10); min-width: 320px; max-width: 90vw;">
          <h2 style="color: #0047AB; text-align: center; margin-bottom: 24px;">Cadastro de Usuário</h2>
          <div style="margin-bottom: 16px;">
            <label for="cadastroEmail" style="font-weight: 600;">E-mail</label>
            <input type="email" id="cadastroEmail" required placeholder="Digite seu e-mail" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; margin-top: 4px;">
          </div>
          <div style="margin-bottom: 20px;">
            <label for="cadastroPassword" style="font-weight: 600;">Senha</label>
            <input type="password" id="cadastroPassword" required placeholder="Crie uma senha" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; margin-top: 4px;">
          </div>
          <button type="submit" style="width: 100%; background: linear-gradient(135deg, #0047AB, #1976d2); color: #fff; font-weight: 700; border: none; border-radius: 8px; padding: 12px; font-size: 16px; cursor: pointer;">Cadastrar</button>
          <div style="color: #b71c1c; margin-top: 16px; min-height: 24px; text-align: center; font-size: 14px;">${errorMsg}</div>
          <div style="margin-top: 18px; text-align: center;">
            <a href="#" id="linkVoltarLogin" style="color: #CC0000; text-decoration: underline; font-size: 15px;">Voltar ao login</a>
          </div>
        </form>
      </div>
    `;
    document.getElementById("cadastroForm").onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById("cadastroEmail").value.trim();
      const password = document.getElementById("cadastroPassword").value;
      try {
        const { auth } = await import("./firebase.js");
        await auth.createUserWithEmailAndPassword(email, password);
        renderLoginForm("Cadastro realizado! Aguarde aprovação do administrador.");
      } catch (err) {
        renderCadastroForm("Erro ao cadastrar: " + (err.message || err));
      }
    };
    document.getElementById("linkVoltarLogin").onclick = (e) => {
      e.preventDefault();
      renderLoginForm();
    };
  }

  async function renderApp() {
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
          <div id="graphSection"></div>
          <div id="driverHistorySection"></div>
          <div id="buscaPacientesSection"></div>
          <div id="prontuarioSection"></div>
          <div id="adminAprovacaoSection"></div>
        </main>
      </div>
      <div id="statusSection"></div>
    `;
    mountDrivers(document.querySelector("#driversSection"));
    mountChat(document.querySelector("#chatSection"));
    mountForm(document.querySelector("#formSection"));
    mountTable(document.querySelector("#tableSection"));
    // Carregar Chart.js e jsPDF se não estiverem presentes
    function loadScript(src) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src='${src}']`)) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/chart.js'),
      loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js')
    ]).then(() => {
      mountGraph(document.querySelector('#graphSection'));
      mountDriverHistory(document.querySelector('#driverHistorySection'));
      // Busca de pacientes integrada ao prontuário
      mountBuscaPacientes(document.querySelector('#buscaPacientesSection'), (paciente) => {
        const input = document.querySelector('#inputPacienteProntuario');
        if (input) {
          input.value = paciente;
          input.dispatchEvent(new Event('input'));
        }
      });
      mountProntuario(document.querySelector('#prontuarioSection'));
    });
    mountStatusBar(document.querySelector("#statusSection"));

    // Se admin, mostrar painel de aprovação
    const { auth } = await import("./firebase.js");
    if (auth.currentUser?.email === "ambulanciadeguaicara@gmail.com") {
      renderAprovacaoUsuarios();
    }
  }

  async function renderAprovacaoUsuarios() {
    const { getAuth } = await import("firebase/auth");
    const { auth } = await import("./firebase.js");
    // Firebase não permite listar usuários pelo client, mas pode ser feito via função cloud ou admin SDK
    // Aqui, exibiremos uma mensagem orientando o admin a aprovar pelo painel Firebase
    const el = document.getElementById("adminAprovacaoSection");
    el.innerHTML = `
      <section style="margin-top: 32px;">
        <h2 style="color: #CC0000;">Aprovação de Usuários</h2>
        <p>Para aprovar novos usuários, acesse o <a href='https://console.firebase.google.com/' target='_blank' style='color:#0047AB;'>Painel do Firebase Authentication</a> e marque como verificado.</p>
        <p><strong>Por questões de segurança, a aprovação automática só pode ser feita pelo painel do Firebase.</strong></p>
      </section>
    `;
  }

  // Verifica se já está autenticado
  import("./firebase.js").then(({ watchAuth }) => {
    watchAuth((user) => {
      if (user) {
        renderApp();
      } else {
        renderLoginForm();
      }
    });
  });
});
