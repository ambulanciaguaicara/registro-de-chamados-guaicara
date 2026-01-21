import { watchDrivers, createCall, setDriverOnDuty, addDoc, collection, db } from "../firebase.js";
import { getDocs, query, where } from "../firebase.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

let driversAvailable = [];

export async function mountForm(el) {
  // Endereços dinâmicos
  let enderecosAgrupados = [];

  el.innerHTML = `
    <section>
      <h2>📋 Novo Chamado</h2>
      <form id="chamadoForm" class="form-grid">
        <label>
          Data
          <input type="date" id="data" required>
        </label>
        
        <label>
          Horário
          <input type="time" id="horario" required>
        </label>
        
        <label>
          Paciente
          <input type="text" id="paciente" placeholder="Nome do paciente" required>
        </label>
        
        <label>
          Endereço
          <input type="text" id="filtroEndereco" placeholder="Filtrar endereço..." autocomplete="off" style="margin-bottom:4px;">
          <select id="endereco" required>
            <option value="">Selecione o endereço</option>
          </select>
        </label>
        <!-- resto do formulário permanece igual -->
        
        <label>
          Nº
          <input type="text" id="numero" placeholder="Número">
        </label>
        
        <label>
          Destino
          <select id="destino" required>
            <option value="">Selecione o destino</option>
            <option value="CAPS">CAPS</option>
            <option value="HGP">HGP</option>
            <option value="SANTA CASA">SANTA CASA</option>
            <option value="UNIMED">UNIMED</option>
            <option value="FISIOTERAPIA PARTICULAR">FISIOTERAPIA PARTICULAR</option>
            <option value="HAPVIDA">HAPVIDA</option>
            <option value="AME">AME</option>
          </select>
        </label>
        
        <label>
          Motorista
          <select id="motorista" required>
            <option value="">Carregando...</option>
          </select>
          <small id="motoristaStatus" class="text-muted"></small>
        </label>
        
        <label>
          Enfermagem
          <input type="text" id="enfermagem" placeholder="Nome do(a) enfermeiro(a)">
        </label>
        
        <label>
          Prioridade
          <select id="prioridade">
            <option value="">Selecione...</option>
            <option value="Autista">Autista</option>
            <option value="Doenças Crônicas">Doenças Crônicas</option>
            <option value="PCD">PCD</option>
            <option value="Idoso">Idoso</option>
            <option value="Gestante">Gestante</option>
            <option value="Obeso">Obeso</option>
          </select>
        </label>
        
        <label>
          Sinais/Sintomas
          <select id="sinais">
            <option value="">Selecione...</option>
            <option value="Hipertensão">Hipertensão</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Doença Cardíaca">Doença Cardíaca</option>
            <option value="Respiratória">Respiratória</option>
            <option value="Dor">Dor</option>
            <option value="Febre">Febre</option>
            <option value="Vômito">Vômito</option>
            <option value="Nenhum">Nenhum</option>
          </select>
        </label>
        
        <label>
          Finalidade
          <select id="finalidade">
            <option value="">Selecione...</option>
            <option value="Pós consulta">Pós consulta</option>
            <option value="Exame">Exame</option>
            <option value="Curativo">Curativo</option>
            <option value="Alta hospitalar">Alta hospitalar</option>
            <option value="Transferência">Transferência</option>
          </select>
        </label>
        
        <label>
          Óbito
          <select id="obito" required>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </label>
        
        <label>
          Família Presente
          <input type="text" id="familia" placeholder="Nome do familiar">
        </label>
        
        <label class="full-width">
          Observações
          <textarea id="obs" rows="3" placeholder="Observações adicionais"></textarea>
        </label>
        
        <div class="form-actions full-width">
          <button type="button" id="btnAddDestino" class="btn-outline">➕ Novo Destino</button>
          <button type="button" id="btnAddPrioridade" class="btn-outline">➕ Nova Prioridade</button>
          <button type="button" id="btnAddFinalidade" class="btn-outline">➕ Nova Finalidade</button>
          <button type="button" id="btnAddEndereco" class="btn-outline">➕ Novo Endereço</button>
        </div>
        
        <button type="submit" class="btn-add full-width">Adicionar Chamado</button>
      </form>
    </section>
  `;

  await carregarEnderecosCadastrados();
  setupFormEvents(el);
  // Busca endereços cadastrados no Firestore
  async function carregarEnderecosCadastrados() {
    enderecosAgrupados = [];
    // Buscar todos os endereços cadastrados
    const q = query(collection(db, "configuracoes"), where("tipo", "==", "enderecos"));
    const snapshot = await getDocs(q);
    // Agrupar por grupo se houver campo grupo, senão todos em "Outros Endereços"
    const grupos = {};
    snapshot.forEach(doc => {
      const { valor, grupo } = doc.data();
      const nomeGrupo = grupo || "Outros Endereços";
      if (!grupos[nomeGrupo]) grupos[nomeGrupo] = [];
      grupos[nomeGrupo].push(valor);
    });
    for (const grupo in grupos) {
      enderecosAgrupados.push({ grupo, lista: grupos[grupo] });
    }
  }
  
  // Escutar motoristas em tempo real
  watchDrivers((snapshot) => {
    driversAvailable = [];
    snapshot.forEach(doc => {
      const driver = { id: doc.id, ...doc.data() };
      driversAvailable.push(driver);
    });
    updateDriverSelect();
  });
}

function updateDriverSelect() {
  const select = document.querySelector("#motorista");
  const statusSpan = document.querySelector("#motoristaStatus");
  
  if (!select) return;

  select.innerHTML = '<option value="">Selecione o motorista...</option>';
  
  driversAvailable.forEach(driver => {
    const option = document.createElement("option");
    option.value = driver.nome;
    option.textContent = driver.nome;
    option.dataset.status = driver.status;
    
    // Desabilitar se não estiver disponível
    if (driver.status !== "Disponível na unidade") {
      option.disabled = true;
      option.textContent += ` (${driver.status})`;
    }
    
    select.appendChild(option);
  });

  // Mostrar status quando selecionar
  select.addEventListener("change", (e) => {
    const selectedOption = e.target.selectedOptions[0];
    if (selectedOption && selectedOption.dataset.status) {
      statusSpan.textContent = `Status: ${selectedOption.dataset.status}`;
      statusSpan.className = selectedOption.dataset.status === "Disponível na unidade" 
        ? "text-success" 
        : "text-warning";
    }
  });
}

function setupFormEvents(root) {
    // Filtro de endereços
    const filtroInput = root.querySelector("#filtroEndereco");
    const selectEndereco = root.querySelector("#endereco");

    function preencherSelectEnderecos(filtro = "") {
      selectEndereco.innerHTML = '<option value="">Selecione o endereço</option>';
      enderecosAgrupados.forEach(grupo => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = grupo.grupo;
        grupo.lista.forEach(end => {
          if (end.toLowerCase().includes(filtro.toLowerCase())) {
            const option = document.createElement("option");
            option.value = end;
            option.textContent = end;
            optgroup.appendChild(option);
          }
        });
        if (optgroup.children.length > 0) {
          selectEndereco.appendChild(optgroup);
        }
      });
    }

    preencherSelectEnderecos();
    filtroInput.addEventListener("input", (e) => {
      preencherSelectEnderecos(e.target.value);
    });
    selectEndereco.addEventListener("focus", () => {
      filtroInput.focus();
    });
  // Adicionar novo destino
  root.querySelector("#btnAddDestino").addEventListener("click", () => {
    const novoDestino = prompt("Digite o novo destino:");
    if (novoDestino && novoDestino.trim()) {
      addOption("destino", novoDestino.trim());
      saveNewOption("destinos", novoDestino.trim());
    }
  });

  // Adicionar nova prioridade
  root.querySelector("#btnAddPrioridade").addEventListener("click", () => {
    const novaPrioridade = prompt("Digite a nova prioridade:");
    if (novaPrioridade && novaPrioridade.trim()) {
      addOption("prioridade", novaPrioridade.trim());
      saveNewOption("prioridades", novaPrioridade.trim());
    }
  });

  // Adicionar nova finalidade
  root.querySelector("#btnAddFinalidade").addEventListener("click", () => {
    const novaFinalidade = prompt("Digite a nova finalidade:");
    if (novaFinalidade && novaFinalidade.trim()) {
      addOption("finalidade", novaFinalidade.trim());
      saveNewOption("finalidades", novaFinalidade.trim());
    }
  });

  // Adicionar novo endereço
  root.querySelector("#btnAddEndereco").addEventListener("click", () => {
    const novoEndereco = prompt("Digite o novo endereço:");
    if (novoEndereco && novoEndereco.trim()) {
      addOption("endereco", novoEndereco.trim());
      saveNewOption("enderecos", novoEndereco.trim());
    }
  });

  // Submit do formulário
  root.querySelector("#chamadoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    
    const form = e.target;
    const data = {
      data: form.querySelector("#data").value,
      hora: form.querySelector("#horario").value,
      dataHora: `${form.querySelector("#data").value} ${form.querySelector("#horario").value}`,
      paciente: form.querySelector("#paciente").value,
      endereco: form.querySelector("#endereco").value,
      numero: form.querySelector("#numero").value,
      destino: form.querySelector("#destino").value,
      motorista: form.querySelector("#motorista").value,
      enfermagem: form.querySelector("#enfermagem").value,
      prioridade: form.querySelector("#prioridade").value,
      sinais: form.querySelector("#sinais").value,
      finalidade: form.querySelector("#finalidade").value,
      obito: form.querySelector("#obito").value,
      familia: form.querySelector("#familia").value,
      obs: form.querySelector("#obs").value,
      criadoPor: currentUser.uid || "sistema",
      criadoPorNome: currentUser.nome || "Sistema"
    };

    try {
      await createCall(data);
      await setDriverOnDuty(data.motorista, data.paciente);
      form.reset();
      notifySuccess(`Chamado registrado por ${currentUser.nome || "Sistema"}!`);
    } catch (error) {
      notifyError(error.message);
    }
  });
}

function addOption(selectId, value) {
  const select = document.querySelector(`#${selectId}`);
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  select.appendChild(option);
  select.value = value;
}

async function saveNewOption(collectionName, value) {
  try {
    await addDoc(collection(db, "configuracoes"), {
      tipo: collectionName,
      valor: value,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao salvar opção:", error);
  }
}
