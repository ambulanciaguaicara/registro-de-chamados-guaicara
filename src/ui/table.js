import { watchCalls, deleteCall, updateCall } from "../firebase.js";
import { formatDateTime } from "../utils/formatters.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

let allCalls = [];

export function mountTable(el) {
  el.innerHTML = `
    <section>
      <h2>📊 Chamados Registrados</h2>
      
      <div class="table-controls">
        <input type="text" id="searchChamados" placeholder="Buscar chamados..." />
        <button id="btnExcluirSelecionados" class="btn-del">🗑️ Excluir Selecionados</button>
      </div>
      
      <div class="table-wrapper">
        <table class="chamados-table">
          <thead>
            <tr>
              <th><input type="checkbox" id="selectAll"></th>
              <th>Data</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Endereço</th>
              <th>Nº</th>
              <th>Destino</th>
              <th>Motorista</th>
              <th>Enfermagem</th>
              <th>Prioridade</th>
              <th>Sinais</th>
              <th>Finalidade</th>
              <th>Óbito</th>
              <th>Família</th>
              <th>Obs</th>
              <th>Atendente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="chamadosBody">
            <tr>
              <td colspan="17" style="text-align: center;">Carregando chamados...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;

  setupTableEvents(el);
  
  // Escutar chamados em tempo real
  watchCalls((snapshot) => {
    allCalls = [];
    snapshot.forEach(doc => {
      allCalls.push({ id: doc.id, ...doc.data() });
    });
    renderCalls();
  });
}

function setupTableEvents(root) {
  const searchInput = root.querySelector("#searchChamados");
  const selectAll = root.querySelector("#selectAll");
  const btnExcluir = root.querySelector("#btnExcluirSelecionados");
  
  // Busca
  searchInput.addEventListener("input", () => {
    renderCalls(searchInput.value);
  });
  
  // Selecionar todos
  selectAll.addEventListener("change", (e) => {
    const checkboxes = root.querySelectorAll("#chamadosBody input[type='checkbox']");
    checkboxes.forEach(cb => cb.checked = e.target.checked);
  });
  
  // Excluir selecionados
  btnExcluir.addEventListener("click", async () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const checkboxes = Array.from(root.querySelectorAll("#chamadosBody input[type='checkbox']:checked"));
    
    if (checkboxes.length === 0) {
      return notifyError("Selecione pelo menos um chamado para excluir");
    }
    
    if (!confirm(`Deseja excluir ${checkboxes.length} chamado(s)?`)) {
      return;
    }
    
    for (const cb of checkboxes) {
      const callId = cb.dataset.id;
      const call = allCalls.find(c => c.id === callId);
      // Permitir exclusão se for o criador OU se for administrador
      const isAdmin = currentUser.funcao === "administrador";
      if (call && call.criadoPor !== currentUser.uid && !isAdmin) {
        notifyError(`Você não pode excluir o chamado de ${call.paciente} (criado por ${call.criadoPorNome})`);
        continue;
      }
      try {
        await deleteCall(callId);
      } catch (error) {
        notifyError(`Erro ao excluir chamado: ${error.message}`);
      }
    }
    
    notifySuccess("Chamados excluídos com sucesso!");
  });
}

function renderCalls(searchTerm = "") {
  const tbody = document.querySelector("#chamadosBody");
  
  if (!tbody) return;
  
  let filteredCalls = allCalls;
  
  // Filtrar por termo de busca
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredCalls = allCalls.filter(call => 
      (call.paciente || "").toLowerCase().includes(term) ||
      (call.endereco || "").toLowerCase().includes(term) ||
      (call.destino || "").toLowerCase().includes(term) ||
      (call.motorista || "").toLowerCase().includes(term) ||
      (call.obs || "").toLowerCase().includes(term)
    );
  }
  
  if (filteredCalls.length === 0) {
    tbody.innerHTML = '<tr><td colspan="17" style="text-align: center;">Nenhum chamado encontrado</td></tr>';
    return;
  }
  
  tbody.innerHTML = filteredCalls.map(call => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const canEdit = call.criadoPor === currentUser.uid;
    
    return `
      <tr class="${canEdit ? 'editable' : ''}">
        <td><input type="checkbox" data-id="${call.id}"></td>
        <td>${call.data || "—"}</td>
        <td>${call.hora || "—"}</td>
        <td>${call.paciente || "—"}</td>
        <td>${call.endereco || "—"}</td>
        <td>${call.numero || "—"}</td>
        <td>${call.destino || "—"}</td>
        <td>${call.motorista || "—"}</td>
        <td>${call.enfermagem || "—"}</td>
        <td>${call.prioridade || "—"}</td>
        <td>${call.sinais || "—"}</td>
        <td>${call.finalidade || "—"}</td>
        <td>${call.obito || "—"}</td>
        <td>${call.familia || "—"}</td>
        <td>${call.obs || "—"}</td>
        <td>${call.criadoPorNome || "—"}</td>
        <td>
          ${canEdit ? `<button class="btn-edit" onclick="editCall('${call.id}')">✏️</button>` : '—'}
        </td>
      </tr>
    `;
  }).join('');
}

// Exportar função para edição (chamada via onclick)
// Nota: A edição preenche o formulário e cria um novo registro ao salvar,
// preservando o histórico original para fins de auditoria
window.editCall = function(callId) {
  const call = allCalls.find(c => c.id === callId);
  if (!call) return;
  
  // Preencher formulário
  document.querySelector("#data").value = call.data || "";
  document.querySelector("#horario").value = call.hora || "";
  document.querySelector("#paciente").value = call.paciente || "";
  document.querySelector("#endereco").value = call.endereco || "";
  document.querySelector("#numero").value = call.numero || "";
  document.querySelector("#destino").value = call.destino || "";
  document.querySelector("#motorista").value = call.motorista || "";
  document.querySelector("#enfermagem").value = call.enfermagem || "";
  document.querySelector("#prioridade").value = call.prioridade || "";
  document.querySelector("#sinais").value = call.sinais || "";
  document.querySelector("#finalidade").value = call.finalidade || "";
  document.querySelector("#obito").value = call.obito || "";
  document.querySelector("#familia").value = call.familia || "";
  document.querySelector("#obs").value = call.obs || "";
  
  // Rolar para o formulário
  document.querySelector("#chamadoForm").scrollIntoView({ behavior: "smooth" });
  
  alert("Edite os campos e clique em 'Adicionar Chamado' para salvar. Nota: isso criará um novo registro para manter o histórico.");
};
