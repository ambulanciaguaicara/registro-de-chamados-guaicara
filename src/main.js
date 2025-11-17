import { auth, login } from "./firebase.js";

const btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const status = document.getElementById("statusMsg");
  status.innerText = "";

  if (!email || !senha) {
    status.innerText = "📌 Preencha e-mail e senha.";
    return;
  }

  try {
    await login(email, senha);
    status.innerText = "✅ Login realizado com sucesso. Redirecionando...";
    setTimeout(() => {
      window.location.href = "index.html"; // painel principal
    }, 1000);
  } catch (err) {
    switch (err.code) {
      case "auth/user-not-found":
        status.innerText = "🚫 Usuário não encontrado.";
        break;
      case "auth/wrong-password":
        status.innerText = "❌ Senha incorreta.";
        break;
      case "auth/too-many-requests":
        status.innerText = "🔒 Muitas tentativas. Tente novamente em alguns minutos.";
        break;
      default:
        status.innerText = "⚠️ Erro: " + err.message;
    }
  }
});

// Se já estiver logado e abrir login.html, manda direto para painel
auth.onAuthStateChanged(user => {
  if (user && window.location.pathname.endsWith("login.html")) {
    window.location.href = "index.html";
  }
});
