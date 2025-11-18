// src/main.js

// Array para armazenar os chamados
let chamados = [];
let tipoSelecionado = "normal";

// Função para definir tipo de chamado
function tipoChamado(tipo) {
  tipoSelecionado = tipo;
  alert("Tipo de chamado selecionado: " + tipo.toUpperCase());
}

// Função para adicionar chamado
function adicionarChamado() {
  const data = document.getElementById("data").value;
  const hora = document.getElementById("horario").value;
  const paciente = document.getElementById("paciente").value;
  const endereco = document.getElementById("endereco").value;
  const numero = document.getElementById("numero").value;
  const destino = document.getElementById("destino").value;
  const motorista = document.getElementById("motorista").value;
  const chegadaMotorista = document.getElementById("chegadaMotorista").value;
  const prioridade = document.getElementById("prioridade").value;
  const sinais = document.getElementById("sinais").value;
  const finalidade = document.getElementById("finalidade").value;
  const obito = document.getElementById("obito").value;
  const obs = document.getElementById("obs").value;

  if (!data || !hora || !paciente || !endereco || !destino || !motorista) {
    alert("⚠ Preencha todos os campos obrigatórios!");
    return;
  }

  const chamado = {
    id: Date.now(),
    data,
    hora,
    paciente,
    endereco,
    numero,
    destino,
    motorista,
    chegadaMotorista,
    prioridade,
    sinais,
    finalidade,
    obito,
    obs,
    tipo: tipoSelecionado
  };

  chamados.push(chamado);
  renderChamados();
  limparFormulario();
}

// Função para renderizar tabela
function renderChamados() {
  const corpoTabela = document.getElementById("corpoTabela");
  corpoTabela.innerHTML = "";

  chamados.forEach(c => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input type="checkbox" data-id="${c.id}"></td>
      <td>${c.data}</td>
      <td>${c.hora}</td>
      <td>${c.paciente}</td>
      <td>${c.endereco}</td>
      <td>${c.numero}</td>
      <td>${c.destino}</td>
      <td>${c.motorista}</td>
      <td>${c.chegadaMotorista || "—"}</td>
      <td>${c.prioridade || "—"}</td>
      <td>${c.sinais || "—"}</td>
      <td>${c.finalidade || "—"}</td>
      <td>${c.obito}</td>
      <td>${c.obs || "—"}</td>
    `;

    corpoTabela.appendChild(tr);
  });
}

// Função para limpar formulário
function limparFormulario() {
  document.getElementById("data").value = "";
  document.getElementById("horario").value = "";
  document.getElementById("paciente").value = "";
  document.getElementById("endereco").value = "";
  document.getElementById("numero").value = "";
  document.getElementById("destino").value = "";
  document.getElementById("motorista").value = "";
  document.getElementById("chegadaMotorista").value = "";
  document.getElementById("prioridade").value = "";
  document.getElementById("sinais").value = "";
  document.getElementById("finalidade").value = "";
  document.getElementById("obito").value = "Não";
  document.getElementById("obs").value = "";
}

// Função para excluir chamados selecionados
function excluirSelecionados() {
  const checkboxes = document.querySelectorAll("#corpoTabela input[type='checkbox']:checked");
  const ids = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
  chamados = chamados.filter(c => !ids.includes(c.id));
  renderChamados();
}

// Função para replicar chamado selecionado
function replicarChamado() {
  const checkbox = document.querySelector("#corpoTabela input[type='checkbox']:checked");
  if (!checkbox) {
    alert("Selecione um chamado para replicar!");
    return;
  }
  const id = parseInt(checkbox.dataset.id);
  const chamado = chamados.find(c => c.id === id);
  if (chamado) {
    const novoChamado = { ...chamado, id: Date.now() };
    chamados.push(novoChamado);
    renderChamados();
  }
}

// Funções auxiliares para adicionar múltiplos valores
function adicionarDestino() {
  alert("Destino adicional registrado: " + document.getElementById("destino").value);
}
function adicionarPrioridade() {
  alert("Prioridade adicional registrada: " + document.getElementById("prioridade").value);
}
function adicionarSinal() {
  alert("Sinal/Sintoma adicional registrado: " + document.getElementById("sinais").value);
}
function adicionarFinalidade() {
  alert("Finalidade adicional registrada: " + document.getElementById("finalidade").value);
}

// Chat interno
function enviarMsg() {
  const msg = document.getElementById("chatMsg").value;
  if (!msg) return;
  const chatArea = document.getElementById("chatArea");
  const p = document.createElement("p");
  p.textContent = "👤 " + msg;
  chatArea.appendChild(p);
  document.getElementById("chatMsg").value = "";
}

// Logout (simples)
function logout() {
  alert("Usuário desconectado.");
  document.getElementById("usuarioLogado").textContent = "Usuário: —";
}
