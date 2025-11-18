// src/main.js

// Controle de login e exibição
auth.onAuthStateChanged(user => {
  const loginBox = document.getElementById("loginBox");
  const sistemaBox = document.getElementById("sistemaBox");
  const usuarioLogado = document.getElementById("usuarioLogado");

  if (user) {
    // Usuário autenticado → mostra sistema
    loginBox.style.display = "none";
    sistemaBox.style.display = "block";
    usuarioLogado.textContent = "Usuário: " + (user.email || "—");
    document.getElementById("statusConexao").innerHTML = "Status: <span class='status-online'>Online</span>";
  } else {
    // Não autenticado → mostra login
    loginBox.style.display = "block";
    sistemaBox.style.display = "none";
    usuarioLogado.textContent = "Usuário: —";
    document.getElementById("statusConexao").innerHTML = "Status: <span class='status-offline'>Offline</span>";
  }
});

// Função de login
document.getElementById("btnLogin").onclick = async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("statusMsg");
  msg.textContent = "";

  try {
    await auth.signInWithEmailAndPassword(email, senha);
  } catch (e) {
    msg.textContent = "Erro de login: " + e.message;
  }
};

// Função de logout
function logout() {
  auth.signOut();
}

// -----------------------------
// Funções de chamados
// -----------------------------
function adicionarChamado() {
  const chamado = {
    data: document.getElementById("data").value,
    horario: document.getElementById("horario").value,
    paciente: document.getElementById("paciente").value,
    endereco: document.getElementById("endereco").value,
    numero: document.getElementById("numero").value,
    destino: document.getElementById("destino").value,
    motorista: document.getElementById("motorista").value,
    prioridade: document.getElementById("prioridade").value,
    sinais: document.getElementById("sinais").value,
    finalidade: document.getElementById("finalidade").value,
    obito: document.getElementById("obito").value,
    obs: document.getElementById("obs").value
  };

  db.ref("chamados").push(chamado);
}

// Atualiza tabela em tempo real
db.ref("chamados").on("value", snapshot => {
  const corpo = document.getElementById("corpoTabela");
  corpo.innerHTML = "";
  snapshot.forEach(child => {
    const c = child.val();
