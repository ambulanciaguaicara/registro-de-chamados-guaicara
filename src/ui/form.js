import { watchDrivers, createCall, setDriverOnDuty, addDoc, collection, db } from "../firebase.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

let driversAvailable = [];

export function mountForm(el) {
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
          <select id="endereco" required>
            <option value="">Selecione o endereço</option>
            <optgroup label="Centro">
              <option value="Rua Rio Branco">Rua Rio Branco</option>
              <option value="Rua Rui Barbosa">Rua Rui Barbosa</option>
              <option value="Av. Duque de Caxias">Av. Duque de Caxias</option>
              <option value="Av. Nove de Julho">Av. Nove de Julho</option>
              <option value="Rua Tiradentes">Rua Tiradentes</option>
              <option value="Rua Floriano Peixoto">Rua Floriano Peixoto</option>
              <option value="Rua Osvaldo Cruz">Rua Osvaldo Cruz</option>
            </optgroup>
            <optgroup label="Bairro São João">
              <option value="Rua Pedro Bertolino">Rua Pedro Bertolino</option>
              <option value="Rua Rosa Grande">Rua Rosa Grande</option>
              <option value="Rua Rubens Puorro">Rua Rubens Puorro</option>
              <option value="Rua Sebastião de Souza">Rua Sebastião de Souza</option>
              <option value="Rua João Pacífico da Silva">Rua João Pacífico da Silva</option>
              <option value="Rua José Francisco Moco">Rua José Francisco Moco</option>
              <option value="Rua São João">Rua São João</option>
            </optgroup>
            <optgroup label="Bairro Amizade">
              <option value="Rua Da Amizade">Rua Da Amizade</option>
              <option value="Rua Adão Afonso Costa">Rua Adão Afonso Costa</option>
              <option value="Rua Dirce Camargo Vaz">Rua Dirce Camargo Vaz</option>
              <option value="Rua Vicente de Paula">Rua Vicente de Paula</option>
            </optgroup>
            <optgroup label="Outros Endereços">
              <option value="Av. Paulo Xavier Ribeiro">Av. Paulo Xavier Ribeiro</option>
              <option value="Av. Roberto Lima Alves">Av. Roberto Lima Alves</option>
              <option value="Rua Professora Adelaide Baptista Pereira Cruz">Rua Professora Adelaide Baptista Pereira Cruz</option>
              <option value="Rua Rogê Ferreira">Rua Rogê Ferreira</option>
              <option value="Rua Roman Garcia Echeto">Rua Roman Garcia Echeto</option>
              <option value="Rua Sunao Katsuki">Rua Sunao Katsuki</option>
              <option value="Rua Yoshi Sato">Rua Yoshi Sato</option>
              <option value="Rua Frei Henrique">Rua Frei Henrique</option>
              <option value="Rua José do Patrocínio">Rua José do Patrocínio</option>
              <option value="Rua Ayrton Alves dos Santos">Rua Ayrton Alves dos Santos</option>
              <option value="Rua Antônio Prado">Rua Antônio Prado</option>
              <option value="Rua Benjamin Constant">Rua Benjamin Constant</option>
              <option value="Rua Campos Salles">Rua Campos Salles</option>
              <option value="Rua Cel. Joaquim Anselmo Martins">Rua Cel. Joaquim Anselmo Martins</option>
              <option value="Rua Dom Pedro II">Rua Dom Pedro II</option>
              <option value="Rua Francisco Sanches">Rua Francisco Sanches</option>
              <option value="Rua Manoel Bento">Rua Manoel Bento</option>
              <option value="Rua Marechal Deodoro">Rua Marechal Deodoro</option>
              <option value="Rua Miguel Jorge">Rua Miguel Jorge</option>
              <option value="Rua Nelson Ferreira">Rua Nelson Ferreira</option>
              <option value="Rua Pedro Dutra Sobrinho">Rua Pedro Dutra Sobrinho</option>
              <option value="Rua Sabino">Rua Sabino</option>
            </optgroup>
          </select>
        </label>
        
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

  setupFormEvents(el);
  
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
      criadoPorNome: currentUser.nome || "Sistema",
      criadoEm: new Date().toISOString()
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
