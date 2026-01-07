import { watchDrivers, addDriver, deleteDriver, setDriverStatus } from "../firebase.js";
import { STATUS_MOTORISTA } from "../data/constants.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

export function mountDrivers(el) {
  el.innerHTML = `
    <div class="drivers-panel">
      <div class="drivers-header">
        <h3>🚗 Motoristas</h3>
        <button class="btn-add" id="btnAddDriver" style="padding: 6px 12px; font-size: 12px;">+ Adicionar</button>
      </div>
      <div id="driversList">
        <div class="loading"></div>
      </div>
    </div>
  `;

  const driversList = el.querySelector("#driversList");
  const btnAdd = el.querySelector("#btnAddDriver");

  // Watch drivers
  watchDrivers((snapshot) => {
    driversList.innerHTML = "";
    
    if (snapshot.empty) {
      driversList.innerHTML = `
        <p style="text-align: center; color: #90A4AE; font-size: 13px; padding: 20px;">
          Nenhum motorista cadastrado
        </p>
      `;
      return;
    }

    snapshot.forEach((doc) => {
      const driver = doc.data();
      const driverCard = document.createElement("div");
      driverCard.style.cssText = `
        margin-bottom: 12px;
        padding: 12px;
        background: #F8F9FA;
        border-radius: 8px;
        border-left: 4px solid var(--ambulance-blue);
      `;

      const isAvailable = driver.status === "Disponível na unidade";
      const statusColor = isAvailable ? "var(--stable-green)" : "var(--ambulance-blue)";

      driverCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <strong style="font-size: 14px; color: var(--text-dark);">${driver.nome}</strong>
          <button class="btn-delete" data-driver="${driver.nome}" 
                  style="padding: 2px 8px; font-size: 11px; background: var(--emergency-red);">
            🗑️
          </button>
        </div>
        <select class="status-select ${isAvailable ? 'status-available' : 'status-busy'}" 
                data-driver="${driver.nome}" 
                style="border-color: ${statusColor}; background: ${statusColor}15; color: ${statusColor};">
          ${STATUS_MOTORISTA.map(status => `
            <option value="${status}" ${driver.status === status ? 'selected' : ''}>
              ${status}
            </option>
          `).join('')}
        </select>
      `;

      driversList.appendChild(driverCard);
    });

    // Add event listeners for status changes
    driversList.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", async (e) => {
        const driverName = e.target.dataset.driver;
        const newStatus = e.target.value;
        
        try {
          await setDriverStatus(driverName, newStatus);
          notifySuccess(`Status de ${driverName} atualizado`);
        } catch (error) {
          console.error(error);
          notifyError("Erro ao atualizar status: " + error.message);
        }
      });
    });

    // Add event listeners for delete buttons
    driversList.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const driverName = e.target.dataset.driver;
        
        if (!confirm(`Excluir motorista ${driverName}?`)) {
          return;
        }
        
        try {
          await deleteDriver(driverName);
          notifySuccess(`Motorista ${driverName} removido`);
        } catch (error) {
          console.error(error);
          notifyError("Erro ao excluir motorista: " + error.message);
        }
      });
    });
  });

  // Add new driver
  btnAdd.addEventListener("click", async () => {
    const driverName = prompt("Nome do motorista:");
    if (!driverName || !driverName.trim()) {
      return;
    }

    try {
      await addDriver(driverName.trim());
      notifySuccess(`Motorista ${driverName} adicionado`);
    } catch (error) {
      console.error(error);
      notifyError("Erro ao adicionar motorista: " + error.message);
    }
  });
}
