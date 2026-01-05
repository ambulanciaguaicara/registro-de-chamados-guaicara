// src/main.js
// Sistema de Registro de Chamados - Ambulância Municipal de Guaicara/SP
// Versão recuperada: Dezembro/2025

// ============================================================================
// ESTADO PRINCIPAL
// ============================================================================

/** Estado e variáveis globais */
let chamados = [];
let tipoSelecionado = "normal";
let filtroTexto = "";
const prontuarios = new Map(); // Map<paciente, Array<chamados>>
let motoristas = [
  { nome: "João", status: "Disponível na unidade" },
  { nome: "Francisco", status: "Disponível na unidade" },
  { nome: "Garcia", status: "Disponível na unidade" },
  { nome: "Rodrigo", status: "Disponível na unidade" },
  { nome: "Gustavo", status: "Disponível na unidade" },
  { nome: "Denilson", status: "Disponível na unidade" },
  { nome: "Fernando", status: "Disponível na unidade" }
];

// ============================================================================
// FUNÇÕES DE PERSISTÊNCIA (LOCALSTORAGE)
// ============================================================================

/**
 * Salva todos os dados no localStorage
 * @returns {void}
 */
function salvarDados() {
  try {
    localStorage.setItem('chamados', JSON.stringify(chamados));
    localStorage.setItem('motoristas', JSON.stringify(motoristas));
    localStorage.setItem('prontuarios', JSON.stringify(Array.from(prontuarios.entries())));
  } catch (e) {
    console.error("Erro ao salvar dados:", e);
    alert("⚠️ Erro ao salvar dados. Suas alterações podem não ter sido salvas.");
  }
}

/**
 * Carrega todos os dados do localStorage
 * @returns {void}
 */
function carregarDados() {
  try {
    const chamadosSalvos = localStorage.getItem('chamados');
    const motoristasSalvos = localStorage.getItem('motoristas');
    const prontuariosSalvos = localStorage.getItem('prontuarios');
    
    if (chamadosSalvos) chamados = JSON.parse(chamadosSalvos);
    if (motoristasSalvos) motoristas = JSON.parse(motoristasSalvos);
    if (prontuariosSalvos) {
      const entries = JSON.parse(prontuariosSalvos);
      prontuarios.clear();
      entries.forEach(([key, value]) => prontuarios.set(key, value));
    }
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
    alert("⚠️ Erro ao carregar dados salvos. Iniciando com dados vazios.");
  }
}

// ============================================================================
// FUNÇÕES CORE
// ============================================================================

/**
 * Seleciona o tipo de chamado
 * @param {string} tipo - Tipo do chamado (normal, urgencia, emergencia)
 * @returns {void}
 */
function tipoChamado(tipo) {
  tipoSelecionado = tipo;
  alert("Tipo de chamado: " + tipo.toUpperCase());
}

/**
 * Adiciona um novo chamado ao sistema com validação
 * @returns {void}
 */
function adicionarChamado() {
  const atendente = document.getElementById("atendente").value.trim();
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

  // Validações
  if (!atendente) {
    alert("Informe o nome do atendente.");
    return;
  }
  if (!data || !hora || !paciente || !endereco || !destino || !motorista) {
    alert("⚠ Campos obrigatórios: Data, Hora, Paciente, Endereço, Destino, Motorista e Atendente.");
    return;
  }

  // Unir se for mesma pessoa no mesmo dia
  const existente = chamados.find(c => 
    c.paciente.toLowerCase() === paciente.toLowerCase() && c.data === data
  );
  
  if (existente) {
    existente.obs = (existente.obs ? existente.obs + " | " : "") + `Réplica unida às ${hora}`;
    existente._unido = true;
    renderChamados();
    atualizarProntuario(existente);
    salvarDados();
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
    _replica: false
  };

  chamados.push(chamado);
  atualizarProntuario(chamado);
  renderChamados();
  limparFormulario();
  salvarDados();
  alert("Chamado adicionado com sucesso!");
}

/**
 * Renderiza a lista de chamados com busca
 * @returns {void}
 */
function renderChamados() {
  const corpo = document.getElementById("corpoTabela");
  if (!corpo) return;
  
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

/**
 * Edita um chamado existente (apenas criador)
 * @param {number} id - ID do chamado a ser editado
 * @returns {void}
 */
function editarChamado(id) {
  const c = chamados.find(x => x.id === id);
  if (!c) return;
  
  // Armazena o chamado original para possível restauração
  window._chamadoEditando = { ...c };
  
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

  // Remove temporariamente - será re-adicionado ao salvar
  chamados = chamados.filter(x => x.id !== id);
  alert("Edite os campos e clique em 'Adicionar Chamado' para salvar as mudanças.");
}

/**
 * Aplica filtro de busca nos chamados
 * @returns {void}
 */
function aplicarBusca() {
  filtroTexto = document.getElementById("buscaInput").value.trim();
  renderChamados();
}

/**
 * Exclui os chamados selecionados
 * @returns {void}
 */
function excluirSelecionados() {
  const sel = Array.from(document.querySelectorAll("#corpoTabela input[type='checkbox']:checked"))
    .map(cb => parseInt(cb.dataset.id));
  
  if (sel.length === 0) {
    alert("Nenhum chamado selecionado.");
    return;
  }
  
  if (!confirm(`Deseja realmente excluir ${sel.length} chamado(s)?`)) {
    return;
  }
  
  chamados = chamados.filter(c => !sel.includes(c.id));
  renderChamados();
  salvarDados();
  alert(`${sel.length} chamado(s) excluído(s) com sucesso.`);
}

/**
 * Replica um chamado existente
 * @returns {void}
 */
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
  const existente = chamados.find(c => 
    c.paciente.toLowerCase() === base.paciente.toLowerCase() && 
    c.data === base.data && 
    c.id !== base.id
  );
  
  if (existente) {
    existente.obs = (existente.obs ? existente.obs + " | " : "") + "Réplicas unidas";
    existente._unido = true;
    renderChamados();
    atualizarProntuario(existente);
    salvarDados();
    alert("Chamado replicado e unido ao existente.");
    return;
  }

  chamados.push(copia);
  atualizarProntuario(copia);
  renderChamados();
  salvarDados();
  alert("Chamado replicado com sucesso!");
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Adiciona log de destino adicional
 * @returns {void}
 */
function adicionarDestino() {
  const v = document.getElementById("destino").value;
  if (!v) return alert("Selecione um destino.");
  alert("Destino adicional registrado: " + v);
}

/**
 * Adiciona log de prioridade adicional
 * @returns {void}
 */
function adicionarPrioridade() {
  const v = document.getElementById("prioridade").value;
  if (!v) return alert("Selecione uma prioridade.");
  alert("Prioridade adicional registrada: " + v);
}

/**
 * Adiciona log de sinal/sintoma adicional
 * @returns {void}
 */
function adicionarSinal() {
  const v = document.getElementById("sinais").value;
  if (!v) return alert("Selecione um sinal/sintoma.");
  alert("Sinal/Sintoma adicional registrado: " + v);
}

/**
 * Adiciona log de finalidade adicional
 * @returns {void}
 */
function adicionarFinalidade() {
  const v = document.getElementById("finalidade").value;
  if (!v) return alert("Selecione uma finalidade.");
  alert("Finalidade adicional registrada: " + v);
}

/**
 * Envia mensagem no chat interno
 * @returns {void}
 */
function enviarMsg() {
  const msg = document.getElementById("chatMsg").value.trim();
  if (!msg) return;
  
  const chatArea = document.getElementById("chatArea");
  if (!chatArea) return;
  
  const p = document.createElement("p");
  p.textContent = "👤 " + msg;
  chatArea.appendChild(p);
  document.getElementById("chatMsg").value = "";
}

/**
 * Desconecta o usuário
 * @returns {void}
 */
function logout() {
  if (confirm("Deseja realmente sair?")) {
    alert("Usuário desconectado.");
    const elem = document.getElementById("usuarioLogado");
    if (elem) elem.textContent = "Usuário: —";
  }
}

/**
 * Limpa todos os campos do formulário
 * @returns {void}
 */
function limparFormulario() {
  ["data", "horario", "paciente", "endereco", "numero", "destino", "motorista", 
   "prioridade", "sinais", "finalidade", "familia", "obs"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (el.tagName === "SELECT") {
        el.value = "";
      } else {
        el.value = "";
      }
    }
  });
  
  const statusMotorista = document.getElementById("statusMotorista");
  if (statusMotorista) statusMotorista.value = "Disponível na unidade";
  
  const obito = document.getElementById("obito");
  if (obito) obito.value = "Não";
}

// ============================================================================
// SISTEMA DE PRONTUÁRIOS
// ============================================================================

/**
 * Atualiza o prontuário do paciente
 * @param {Object} chamado - Chamado a ser adicionado ao prontuário
 * @returns {void}
 */
function atualizarProntuario(chamado) {
  const chave = chamado.paciente.trim();
  if (!prontuarios.has(chave)) {
    prontuarios.set(chave, []);
  }
  prontuarios.get(chave).push(chamado);
  atualizarProntuariosLista();
}

/**
 * Atualiza a lista de prontuários na lateral
 * @returns {void}
 */
function atualizarProntuariosLista() {
  const box = document.getElementById("prontuariosLista");
  if (!box) return;
  
  box.innerHTML = "";
  const pacientes = Array.from(prontuarios.keys()).sort((a, b) => a.localeCompare(b));

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

/**
 * Abre e exibe o prontuário de um paciente
 * @param {string} nome - Nome do paciente
 * @returns {void}
 */
function abrirProntuario(nome) {
  const registros = prontuarios.get(nome) || [];
  const linhas = registros.map(r => 
    `- ${r.data} ${r.hora} | ${r.destino} | ${r.endereco} ${r.numero || ""} | Óbito: ${r.obito}`
  ).join("\n");
  alert(`Prontuário de ${nome}:\n${linhas || "Sem registros."}`);
}

// ============================================================================
// SISTEMA DE MOTORISTAS
// ============================================================================

/**
 * Renderiza a tabela de motoristas
 * @returns {void}
 */
function renderMotoristas() {
  const tabela = document.getElementById("tabelaMotoristas");
  if (!tabela) return;
  
  tabela.innerHTML = "";
  const statusOpts = [
    "Disponível na unidade",
    "Em atendimento",
    "Horário de almoço",
    "Viagem",
    "Folga",
    "Sem Ambulância"
  ];

  motoristas.forEach((motorista, i) => {
    const linha = document.createElement("tr");
    
    const tdNome = document.createElement("td");
    tdNome.textContent = motorista.nome;
    
    const tdStatus = document.createElement("td");
    const select = document.createElement("select");
    statusOpts.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      if (opt === motorista.status) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener("change", (e) => {
      editarStatusMotorista(i, e.target.value);
    });
    tdStatus.appendChild(select);
    
    linha.appendChild(tdNome);
    linha.appendChild(tdStatus);
    tabela.appendChild(linha);
  });
}

/**
 * Edita o nome de um motorista
 * @param {number} i - Índice do motorista
 * @param {string} val - Novo nome
 * @returns {void}
 */
function editarNomeMotorista(i, val) {
  if (val && val.trim()) {
    motoristas[i].nome = val.trim();
    renderMotoristas();
    salvarDados();
  }
}

/**
 * Edita o status de um motorista
 * @param {number} i - Índice do motorista
 * @param {string} val - Novo status
 * @returns {void}
 */
function editarStatusMotorista(i, val) {
  motoristas[i].status = val;
  salvarDados();
}

/**
 * Adiciona um novo motorista
 * @returns {void}
 */
function adicionarMotorista() {
  const nome = prompt("Digite o nome do motorista:");
  if (!nome || nome.trim() === "") return;
  
  // Verificar duplicatas
  const existe = motoristas.find(m => m.nome.toLowerCase() === nome.trim().toLowerCase());
  if (existe) {
    alert("Este motorista já existe na lista.");
    return;
  }
  
  motoristas.push({ 
    nome: nome.trim(), 
    status: "Disponível na unidade" 
  });
  
  renderMotoristas();
  salvarDados();
  alert(`Motorista "${nome.trim()}" adicionado com sucesso!`);
}

// ============================================================================
// FUNÇÕES DE ENDEREÇO
// ============================================================================

/**
 * Adiciona um novo endereço à lista
 * @returns {void}
 */
function adicionarEndereco() {
  const novoEndereco = prompt("Digite o novo endereço:");
  if (!novoEndereco || novoEndereco.trim() === "") return;
  
  const select = document.getElementById("endereco");
  if (!select) return;
  
  const option = document.createElement("option");
  option.value = novoEndereco.trim();
  option.textContent = novoEndereco.trim();
  select.appendChild(option);
  select.value = novoEndereco.trim();
  
  alert(`Endereço "${novoEndereco.trim()}" adicionado com sucesso!`);
}

// ============================================================================
// RELATÓRIOS
// ============================================================================

/**
 * Gera relatório mensal com gráfico
 * @returns {void}
 */
function gerarRelatorioMensal() {
  const ctx = document.getElementById("graficoMensal");
  if (!ctx) {
    alert("Canvas do gráfico não encontrado.");
    return;
  }
  
  const tipos = { normal: 0, urgencia: 0, emergencia: 0 };
  const prioridades = { 
    "Autista": 0, 
    "Doenças Crônicas/Complicações": 0, 
    "PCD": 0, 
    "Idoso": 0, 
    "Gestante": 0, 
    "Obeso": 0 
  };
  const locais = {};

  chamados.forEach(c => {
    if (tipos[c.tipo] !== undefined) tipos[c.tipo]++;
    if (prioridades[c.prioridade] !== undefined) prioridades[c.prioridade]++;
    locais[c.destino] = (locais[c.destino] || 0) + 1;
  });

  const dataChart = {
    labels: ["Normal", "Urgência", "Emergência"],
    datasets: [
      { 
        label: "Tipos de Chamados", 
        data: [tipos.normal, tipos.urgencia, tipos.emergencia], 
        backgroundColor: "#0077cc" 
      }
    ]
  };

  const texto = `Prioridades:\n${Object.entries(prioridades).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nDestinos:\n${Object.entries(locais).map(([k, v]) => `${k}: ${v}`).join("\n")}`;
  console.log(texto);

  // Destroy existing chart if any
  if (window.chartInstance && typeof window.chartInstance.destroy === 'function') {
    window.chartInstance.destroy();
  }

  window.chartInstance = new Chart(ctx, {
    type: "bar",
    data: dataChart,
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: { y: { beginAtZero: true } }
    }
  });
  
  alert("Relatório mensal gerado! Verifique o console para detalhes.");
}

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

/**
 * Inicializa o sistema quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
  carregarDados();
  renderChamados();
  renderMotoristas();
  
  // Bind relatório mensal button
  const btnRelatorio = document.getElementById("btnRelatorioMensal");
  if (btnRelatorio) {
    btnRelatorio.addEventListener("click", gerarRelatorioMensal);
  }
});

// ============================================================================
// EXPORTAÇÕES WINDOW (para uso no HTML)
// ============================================================================

window.tipoChamado = tipoChamado;
window.adicionarChamado = adicionarChamado;
window.excluirSelecionados = excluirSelecionados;
window.replicarChamado = replicarChamado;
window.adicionarDestino = adicionarDestino;
window.adicionarPrioridade = adicionarPrioridade;
window.adicionarSinal = adicionarSinal;
window.adicionarFinalidade = adicionarFinalidade;
window.enviarMsg = enviarMsg;
window.logout = logout;
window.aplicarBusca = aplicarBusca;
window.abrirProntuario = abrirProntuario;
window.adicionarMotorista = adicionarMotorista;
window.adicionarEndereco = adicionarEndereco;
window.editarNomeMotorista = editarNomeMotorista;
window.editarStatusMotorista = editarStatusMotorista;
window.limparFormulario = limparFormulario;
