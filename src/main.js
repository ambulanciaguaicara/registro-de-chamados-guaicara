// src/main.js

// Referências do Firebase
const auth = firebase.auth();
const db = firebase.database();

// Proteção: redireciona para login se não estiver logado
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "./login.html";
  } else {
    document.getElementById("usuarioLogado").textContent = "Usuário: " + user.email;
    sincronizarChamados();
    sincronizarChat();
  }
});

// Adiciona novo chamado
function adicionarChamado() {
  const chamado = {
    data: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
    paciente: document.getElementById("paciente").value,
    endereco: document.getElementById("endereco").value,
    numero: document.getElementById("numero").value,
    destino: document.getElementById("destino").value,
    prioridade: document.getElementById("prioridade").value,
    sinais: document.getElementById("sinais").value,
    finalidade: document.getElementById("finalidade").value,
    obito: document.getElementById("obito").checked,
    observacoes: document.getElementById("observacoes").value
  };

  db.ref("chamados").push(chamado);
  alert("Chamado registrado com sucesso!");
}

// Sincroniza chamados em tempo real
function sincronizarChamados() {
  db.ref("chamados").on("value", (snapshot) => {
    const corpoTabela = document.getElementById("corpoTabela");
    corpoTabela.innerHTML = "";

    snapshot.forEach((child) => {
      const dados = child.val();
      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td><input type="checkbox" data-id="${child.key}"/></td>
        <td>${dados.data}</td>
        <td>${dados.hora}</td>
        <td>${dados.paciente}</td>
        <td>${dados.endereco}</td>
        <td>${dados.numero}</td>
        <td>${dados.destino}</td>
        <td>${dados.prioridade}</td>
        <td>${dados.sinais}</td>
        <td>${dados.finalidade}</td>
        <td>${dados.obito ? "Sim" : "Não"}</td>
        <td>${dados.observacoes}</td>
      `;

      corpoTabela.appendChild(linha);
    });

    document.getElementById("ultimaSync").textContent = "Última sync: " + new Date().toLocaleTimeString();
    document.getElementById("statusConexao").innerHTML = 'Status: <span class="status-online">Online</span>';
  });
}

// Exclui chamados selecionados
function excluirSelecionados() {
  const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
  checkboxes.forEach((cb) => {
    const id = cb.getAttribute("data-id");
    db.ref("chamados/" + id).remove();
  });
  alert("Chamados excluídos.");
}

// Replica chamado selecionado
function replicarChamado() {
  const cb = document.querySelector("input[type='checkbox']:checked");
  if (!cb) {
    alert("Selecione um chamado para replicar.");
    return;
  }

  const id = cb.getAttribute("data-id");
  db.ref("chamados/" + id).once("value").then((snapshot) => {
    const dados = snapshot.val();
    db.ref("chamados").push(dados);
    alert("Chamado replicado.");
  });
}

// Envia mensagem no chat
function enviarMsg() {
  const msg = document.getElementById("chatMsg").value.trim();
  if (!msg) return;

  const user = auth.currentUser;
  db.ref("chat").push({
    usuario: user.email,
    mensagem: msg,
    hora: new Date().toLocaleTimeString()
  });

  document.getElementById("chatMsg").value = "";
}

// Sincroniza chat em tempo real
function sincronizarChat() {
  db.ref("chat").on("value", (snapshot) => {
    const chatArea = document.getElementById("chatArea");
    chatArea.innerHTML = "";

    snapshot.forEach((child) => {
      const dados = child.val();
      const linha = document.createElement("div");
      linha.textContent = `[${dados.hora}] ${dados.usuario}: ${dados.mensagem}`;
      chatArea.appendChild(linha);
    });
  });
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "./login.html";
  });
}
