import { watchDrivers, addDriver, updateDriverStatus, deleteDriver } from "../firebase.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

let drivers = [];

export function mountDrivers(el) {
  el.innerHTML = `
    <section class="drivers-section">
      <h3>🚗 Motoristas</h3>
      <button id="btnAddDriver" class="btn-add">➕ Adicionar Motorista</button>
      
      <div class="drivers-list">
        <table class="drivers-table">
          <thead>
            <tr>
              <th>Motorista</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="driversBody">
            <tr>
              <td colspan="2" style="text-align: center;">Carregando...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;

  setupDriversEvents(el);
  
  // Escutar motoristas em tempo real
  watchDrivers((snapshot) => {
    drivers = [];
    snapshot.forEach(doc => {
      drivers.push({ id: doc.id, ...doc.data() });
    });
    renderDrivers();
  });
}

function setupDriversEvents(root) {
  root.querySelector("#btnAddDriver").addEventListener("click", async () => {
    const nome = prompt("Digite o nome do motorista:");
    if (!nome || !nome.trim()) return;
    
    try {
      await addDriver(nome.trim());
      notifySuccess("Motorista adicionado!");
    } catch (error) {
      notifyError(error.message);
    }
  });
}

function renderDrivers() {
  const tbody = document.querySelector("#driversBody");
  
  if (!tbody) return;
  
  if (drivers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="2" style="text-align: center;">Nenhum motorista cadastrado</td></tr>';
    return;
  }
  
  tbody.innerHTML = drivers.map(driver => `
    <tr>
      <td>${driver.nome}</td>
      <td>
        <select class="driver-status-select" data-id="${driver.id}">
          <option value="Disponível na unidade" ${driver.status === "Disponível na unidade" ? "selected" : ""}>Disponível na unidade</option>
          <option value="Em atendimento" ${driver.status === "Em atendimento" ? "selected" : ""}>Em atendimento</option>
          <option value="Horário de almoço" ${driver.status === "Horário de almoço" ? "selected" : ""}>Horário de almoço</option>
          <option value="Viagem" ${driver.status === "Viagem" ? "selected" : ""}>Viagem</option>
          <option value="Folga" ${driver.status === "Folga" ? "selected" : ""}>Folga</option>
          <option value="Sem Ambulância" ${driver.status === "Sem Ambulância" ? "selected" : ""}>Sem Ambulância</option>
        </select>
      </td>
      <td>
        <button class="btn-delete-driver" data-id="${driver.id}" title="Excluir motorista">🗑️</button>
      </td>
    </tr>
  `).join("");
  
  // Adicionar event listeners aos selects
  tbody.querySelectorAll(".driver-status-select").forEach(select => {
    select.addEventListener("change", async (e) => {
      const driverId = e.target.dataset.id;
      const newStatus = e.target.value;
      try {
        await updateDriverStatus(driverId, newStatus);
        notifySuccess("Status atualizado!");
      } catch (error) {
        notifyError(error.message);
      }
    });
  });

  // Adicionar event listeners aos botões de exclusão
  tbody.querySelectorAll(".btn-delete-driver").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const driverId = e.target.dataset.id;
      if (confirm("Tem certeza que deseja excluir este motorista?")) {
        try {
          await deleteDriver(driverId);
          notifySuccess("Motorista excluído!");
        } catch (error) {
          notifyError(error.message);
        }
      }
    });
  });
}
