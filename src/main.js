window.addEventListener("load", () => {
  const btnLogin = document.getElementById("btnLogin");
  const msg = document.getElementById("statusMsg");

  if (!btnLogin) {
    console.error("Botão de login não encontrado");
    return;
  }

  btnLogin.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    msg.textContent = "";

    if (!email || !senha) {
      msg.textContent = "Preencha e-mail e senha.";
      return;
    }

    try {
      await auth.signInWithEmailAndPassword(email, senha);
      msg.textContent = "Login realizado com sucesso!";
    } catch (e) {
      msg.textContent = "Erro de login: " + (e.message || "Falha desconhecida");
      console.error("Erro de login:", e);
    }
  });

  auth.onAuthStateChanged(user => {
    const loginBox = document.getElementById("loginBox");
    const sistemaBox = document.getElementById("sistemaBox");
    const usuarioLogado = document.getElementById("usuarioLogado");

    if (user) {
      loginBox.style.display = "none";
      sistemaBox.style.display = "block";
      usuarioLogado.textContent = "Usuário: " + (user.email || "—");
      document.getElementById("statusConexao").innerHTML = "Status: <span class='status-online'>Online</span>";
    } else {
      loginBox.style.display = "block";
      sistemaBox.style.display = "none";
      usuarioLogado.textContent = "Usuário: —";
      document.getElementById("statusConexao").innerHTML = "Status: <span class='status-offline'>Offline</span>";
    }
  });
});
