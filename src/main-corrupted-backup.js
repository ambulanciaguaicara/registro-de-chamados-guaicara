// src/main.js

// Estado principal
let chamados = [];
let tipoSelecionado = "normal";
let filtroTexto = "";
const prontuarios = new Map(); // Map<paciente, Array<chamados>>
let motoristas = [];
function adicionarMotorista () {
  const nome = prompt("João"</option>,"Francisco"</option>,
  "Garcia"</option>, "Rodrigo"</option>, "Gustavo"</option>,"Denilson"</option>, "Fernando"</option>}
  )";
  if (!nome) return;

// Tipo de chamado
function tipoChamado(tipo) {
  tipoSelecionado = tipo;
  alert("Tipo de chamado: " + tipo.toUpperCase());
}

// Adicionar chamado
function adicionarChamado() {
  const atendente = document.getElementById("atendente").value.trim();
  const chamado = { 
  const data = document.getElementById("data").value;
  const hora = document.getElementById("horario").value;
  const paciente = document.getElementById("paciente").value.trim();
  const endereco = document.getElementById("endereco").value;
  const numero = document.getElementById("numero").value.trim();
  const destino = document.getElementById("destino").value;
  const motorista = document.getElementById("motorista").value.trim();
  const statusMotorista = document.getElementById("statusMotorista").value;
  const prioridade = document.getElementById("prioridade").value;
  const sinais = document.getElementById("sinais").value;
  const finalidade = document.getElementById("finalidade").value;
  const obito = document.getElementById("obito").value;
  const familia = document.getElementById("familia").value.trim();
  const obs = document.getElementById("obs").value.trim();
};

  if (!atendente) {
    alert("Informe o nome do atendente.");
    return;
  }
  if (!data || !hora || !paciente || !endereco || !destino || !motorista) {
    alert("⚠ Campos obrigatórios: Data, Hora, Paciente, Endereço, Destino, Motorista e Atendente.");
    return;
  }

  // Unir se for mesma pessoa no mesmo dia
  const existente = chamados.find(c => c.paciente.toLowerCase() === paciente.toLowerCase() && c.data === data);
  if (existente) {
    existente.obs = (existente.obs ? existente.obs + " | " : "") + `Réplica unida às ${hora}`;
    existente._unido = true;
    renderChamados();
    atualizarProntuario(existente);
    alert("Chamado unido ao registro do mesmo paciente no mesmo dia.");
    limparFormulario();
    return;
  }

  const chamado = {
    id: Date.now(),
    tipo: tipoSelecionado,
    atendente,
    data,
    hora,
    paciente,
    endereco,
    numero,
    destino,
    motorista,
    statusMotorista,
    prioridade,
    sinais,
    finalidade,
    obito,
    familia,
    obs,
    _replica: false // controle visual
  };

  chamados.push(chamado);
  atualizarProntuario(chamado);
  renderChamados(); // função que mostra os chamados na tela
  limparFormulario();
});

// Renderização de chamados com busca
function renderChamados() {
  const corpo = document.getElementById("corpoTabela");
  corpo.innerHTML = "";

  const listaFiltrada = chamados.filter(c => {
    if (!filtroTexto) return true;
    const t = filtroTexto.toLowerCase();
    return (
      c.paciente.toLowerCase().includes(t) ||
      c.endereco.toLowerCase().includes(t) ||
      (c.destino || "").toLowerCase().includes(t) ||
      (c.obs || "").toLowerCase().includes(t) ||
      (c.familia || "").toLowerCase().includes(t) ||
      (c.motorista || "").toLowerCase().includes(t)
    );
  });

  listaFiltrada.forEach(c => {
    const tr = document.createElement("tr");
    if (c._replica) tr.classList.add("linha-replica");
    if (c._unido) tr.classList.add("linha-unida");

    tr.innerHTML = `
      <td><input type="checkbox" data-id="${c.id}"></td>
      <td>${c.data}</td>
      <td>${c.hora}</td>
      <td>${c.paciente}</td>
      <td>${c.endereco}</td>
      <td>${c.numero || "—"}</td>
      <td>${c.destino}</td>
      <td>${c.motorista}</td>
      <td>${c.statusMotorista}</td>
      <td>${c.prioridade || "—"}</td>
      <td>${c.sinais || "—"}</td>
      <td>${c.finalidade || "—"}</td>
      <td>${c.obito}</td>
      <td>${c.familia || "—"}</td>
      <td>${c.obs || "—"}</td>
      <td>${c.atendente}</td>
    `;

    // Permitir editar somente pelo atendente criador
    tr.addEventListener("dblclick", () => {
      const atual = document.getElementById("atendente").value.trim();
      if (atual.toLowerCase() !== c.atendente.toLowerCase()) {
        alert("Somente o atendente que criou o chamado pode editar.");
        return;
      }
      editarChamado(c.id);
    });

    corpo.appendChild(tr);
  });

  atualizarProntuariosLista();
}

// Editar chamado (somente criador)
function editarChamado(id) {
  const c = chamados.find(x => x.id === id);
  if (!c) return;
  // Preenche o formulário para edição
  document.getElementById("data").value = c.data;
  document.getElementById("horario").value = c.hora;
  document.getElementById("paciente").value = c.paciente;
  document.getElementById("endereco").value = c.endereco;
  document.getElementById("numero").value = c.numero || "";
  document.getElementById("destino").value = c.destino;
  document.getElementById("motorista").value = c.motorista;
  document.getElementById("statusMotorista").value = c.statusMotorista;
  document.getElementById("prioridade").value = c.prioridade || "";
  document.getElementById("sinais").value = c.sinais || "";
  document.getElementById("finalidade").value = c.finalidade || "";
  document.getElementById("obito").value = c.obito;
  document.getElementById("familia").value = c.familia || "";
  document.getElementById("obs").value = c.obs || "";
  tipoSelecionado = c.tipo;

  // Ao salvar, substitui o registro
  const originalId = c.id;
  chamados = chamados.filter(x => x.id !== originalId);
  alert("Edite os campos e clique em 'Adicionar Chamado' para salvar as mudanças.");
}

// Busca
function aplicarBusca() {
  filtroTexto = document.getElementById("buscaInput").value.trim();
  renderChamados();
}

// Excluir selecionados
function excluirSelecionados() {
  const sel = Array.from(document.querySelectorAll("#corpoTabela input[type='checkbox']:checked"))
                   .map(cb => parseInt(cb.dataset.id));
  chamados = chamados.filter(c => !sel.includes(c.id));
  renderChamados();
}

// Replicar (azul) e unir se mesma pessoa/dia
function replicarChamado() {
  const cb = document.querySelector("#corpoTabela input[type='checkbox']:checked");
  if (!cb) {
    alert("Selecione um chamado para replicar.");
    return;
  }
  const id = parseInt(cb.dataset.id);
  const base = chamados.find(c => c.id === id);
  if (!base) return;

  const copia = { ...base, id: Date.now(), _replica: true };
  // Se existir outro do mesmo paciente na mesma data, une
  const existente = chamados.find(c => c.paciente.toLowerCase() === base.paciente.toLowerCase() && c.data === base.data && c.id !== base.id);
  if (existente) {
    existente.obs = (existente.obs ? existente.obs + " | " : "") + "Réplicas unidas";
    existente._unido = true;
    renderChamados();
    atualizarProntuario(existente);
    return;
  }

  chamados.push(copia);
  atualizarProntuario(copia);
  renderChamados();
}

// Auxiliares "adicionar" (mantidos como logs simples)
function adicionarDestino() {
  const v = document.getElementById("destino").value;
  if (!v) return alert("Selecione um destino.");
  alert("Destino adicional registrado: " + v);
}
function adicionarPrioridade() {
  const v = document.getElementById("prioridade").value;
  if (!v) return alert("Selecione uma prioridade.");
  alert("Prioridade adicional registrada: " + v);
}
function adicionarSinal() {
  const v = document.getElementById("sinais").value;
  if (!v) return alert("Selecione um sinal/sintoma.");
  alert("Sinal/Sintoma adicional registrado: " + v);
}
function adicionarFinalidade() {
  const v = document.getElementById("finalidade").value;
  if (!v) return alert("Selecione uma finalidade.");
  alert("Finalidade adicional registrada: " + v);
}

// Chat interno
function enviarMsg() {
  const msg = document.getElementById("chatMsg").value.trim();
  if (!msg) return;
  const p = document.createElement("p");
  p.textContent = "👤 " + msg;
  document.getElementById("chatArea").appendChild(p);
  document.getElementById("chatMsg").value = "";
}

// Logout (simples local)
function logout() {
  alert("Usuário desconectado.");
  document.getElementById("usuarioLogado").textContent = "Usuário: —";
}

// Limpar formulário
function limparFormulario() {
  ["data","horario","paciente","endereco","numero","destino","motorista","prioridade",
   "sinais","finalidade","familia","obs"].forEach(id => {
    const el = document.getElementById(id);
    if (el.tagName === "SELECT") el.value = "";
    else el.value = "";
  });
  document.getElementById("statusMotorista").value = "Disponível na unidade";
  document.getElementById("obito").value = "Não";
}

// PRONTUÁRIOS (armazenamento por paciente na lateral)
function atualizarProntuario(chamado) {
  const chave = chamado.paciente.trim();
  if (!prontuarios.has(chave)) prontuarios.set(chave, []);
  prontuarios.get(chave).push(chamado);
  atualizarProntuariosLista();
}

function atualizarProntuariosLista() {
  const box = document.getElementById("prontuariosLista");
  box.innerHTML = "";
  const pacientes = Array.from(prontuarios.keys()).sort((a,b) => a.localeCompare(b));

  pacientes.forEach(nome => {
    const item = document.createElement("div");
    item.className = "prontuario-item";
    item.innerHTML = `
      <button class="prontuario-btn" onclick="abrirProntuario('${nome}')">${nome}</button>
      <span class="prontuario-count">${prontuarios.get(nome).length} registros</span>
    `;
    box.appendChild(item);
  });
}

function abrirProntuario(nome) {
  const registros = prontuarios.get(nome) || [];
  const linhas = registros.map(r => `- ${r.data} ${r.hora} | ${r.destino} | ${r.endereco} ${r.numero || ""} | Óbito: ${r.obito}`).join("\n");
  alert(`Prontuário de ${nome}:\n${linhas || "Sem registros."}`);
}

// MOTORISTAS (lateral editável)
function adicionarMotoristas() {
  const tabela = document.getElementById("tabelaMotoristas");
  tabela.innerHTML = "";
  const statusOpts = ["Disponível na unidade","Em atendimento","Horário de almoço","Viagem","Folga","Sem Ambulância"];

  motoristas.forEach((motorista) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${motorista.nome }</td>
      <td>${motorista.status}</td>
      `;
      tabela.appendChild(linha);
  });
}
exibirMotoristas();
        <select onchange="alterarStatus('${Motorista.nome}', this.value)">
          <option${motorista.status === "Disponível na unidade" ? "selected" : ""}>Disponível na unidade</option>
          <option${motorista.status === "Em atendimento" ? "selected" : ""}>Em atendimento</option>
          <optiin${motorista.status === "Horário de almoço" ? "selected" : ""}>Horário de almoço</option>
          <option${motorista.status === "Folga" ? "selected" : ""}>Folga</option>
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function adicionarMotorista () {
  const nome = prompt ("Digite o nome o motorista"); 
if (!nome) return;

motoristas.push({ nome, status:"</option>"})yuthgfhfhchhdhfh
exibirMotoristas();
<button class="btn-add" onclick ="adicionarMotorista()">Adicionar motorista</button>
}

// RELATÓRIO MENSAL (gráfico de barras)
const document "getElementById("btnRelatorioMensal").addEventListener("click, gerarRelatorioMensal);
function gerarRelatorioMensal () {
  const ctx = document.getElementById("graficoMensal");
  const tipos = { normal:0, urgencia:0, emergencia:0 };
  const prioridades = { Autista:0, "Doenças Crônicas/Complicações":0, PCD:0, Idoso:0, Gestante:0, Obeso:0 };
  const locais = {}; // contagem por destino

  chamados.forEach(c => {
    if (tipos[c.tipo] !== undefined) tipos[c.tipo]++;
    if (prioridades[c.prioridade] !== undefined) prioridades[c.prioridade]++;
    locais[c.destino] = (locais[c.destino] || 0) + 1;
  });

  const dataChart = {
    labels: ["Normal","Urgência","Emergência"],
    datasets: [
      { label: "Tipos de Chamados", data: [tipos.normal, tipos.urgencia, tipos.emergencia], backgroundColor: "#0077cc" },
      { label: "Prioridades (soma)", data: Object.values(prioridades), backgroundColor: "#ff9800" },
      { label: "Locais (destinos)", data: Object.values(locais), backgroundColor: "#4caf50" }
    ]
  };

  // Para alinhar labels das prioridades e destinos, mostramos em alert auxiliar
  const texto = `Prioridades:\n${Object.entries(prioridades).map(([k,v]) => `${k}: ${v}`).join("\n")}\n\nDestinos:\n${Object.entries(locais).map(([k,v]) => `${k}: ${v}`).join("\n")}`;
  console.log(texto);

  new Chart(ctx, {
    type: "bar",
    data: dataChart,
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Inicialização
renderChamados () 
renderMotoristas ()

// Expor funções no escopo global para os onclick do HTML
window const TipoChamado = function tipoChamado ()
window const adicionarChamado = function adicionarChamado ()
window const excluirSelecionados = function excluirSelecionados ()
window const replicarChamado = fuction replicarChamado  ()
window const adicionarDestino =  function adicionarDestino ()
window const adicionarPrioridade = function adicionarPrioridade ()
window const adicionarSinal = function adicionarSinal ()
window const adicionarFinalidade = function adicionarFinalidade ()
window const enviarMsg = function enviarMsg ()
window const logout = function logout ()
window const aplicarBusca = function aplicarBusca ()
window const abrirProntuario =  function abrirProntuario ()
window const adicionarMotorista =  function adicionarMotorista ()
window const adicionarStatusMotorista = function adicionarStatusMotorista ()
window const adicionarEndereco = function adicionarNovoEndereço () {
  const novoEndereco = prompt("Digite o novo endereço:");
  if (novoEndereco) {
    const select = document.getElementById("endereco");
    const option = document.createElement("option");
    option.value = novoEndereco;
    option.textContent = novoEndereco;
    select.appendChild(option);
    select.value = novoEndereco;
    <button class="btn-add" onclick="adicionarnovoEndereço()">Adicionar endereço</button>
  }
}