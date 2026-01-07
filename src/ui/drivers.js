import { watchDrivers, addDriver, deleteDriver, setDriverStatus } from "../firebase.js";
import { STATUS_MOTORISTA } from "../data/constants.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

export function mountDrivers(el) {
  el.innerHTML = `
    <div class="drivers-panel">
      <div class="drivers-header">
        <h3>👨‍✈️ Motoristas</h3>
        <button class="btn-add" id="btnAddDriver">+</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="tabelaMotoristas">
          <tr><td colspan="3" class="text-center">Carregando...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  const tbody = el.querySelector("#tabelaMotoristas");
  const btnAdd = el.querySelector("#btnAddDriver");

  // Add driver
  btnAdd.addEventListener("click", async () => {
    const nome = prompt("Nome do motorista:");
    if (!nome || !nome.trim()) return;

    try {
      await addDriver(nome.trim());
      notifySuccess(`Motorista ${nome} adicionado`);
    } catch (error) {
      console.error(error);
      notifyError("Erro ao adicionar motorista: " + error.message);
    }
  });

  // Watch drivers
  watchDrivers((snapshot) => {
    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum motorista cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><strong>${data.nome}</strong></td>
        <td>
          <select class="status-select ${getStatusClass(data.status)}" data-driver="${data.nome}">
            ${STATUS_MOTORISTA.map(s => 
              `<option value="${s}" ${s === data.status ? 'selected' : ''}>${s}</option>`
            ).join("")}
          </select>
        </td>
        <td>
          <button class="btn-del" data-delete="${data.nome}" style="padding: 6px 12px; font-size: 12px;">🗑️</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Add event listeners
    tbody.querySelectorAll("select.status-select").forEach(select => {
      select.addEventListener("change", async (e) => {
        const driverName = e.target.dataset.driver;
        const newStatus = e.target.value;
        
        try {
          await setDriverStatus(driverName, newStatus);
          e.target.className = `status-select ${getStatusClass(newStatus)}`;
          notifySuccess(`Status de ${driverName} atualizado`);
        } catch (error) {
          console.error(error);
          notifyError("Erro ao atualizar status: " + error.message);
        }
      });
    });

    tbody.querySelectorAll("[data-delete]").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const driverName = e.target.dataset.delete;
        if (!confirm(`Excluir motorista ${driverName}?`)) return;

        try {
          await deleteDriver(driverName);
          notifySuccess(`Motorista ${driverName} excluído`);
        } catch (error) {
          console.error(error);
          notifyError("Erro ao excluir motorista: " + error.message);
        }
      });
    });
  });
}

function getStatusClass(status) {
  if (status === "Disponível na unidade") return "status-available";
  return "status-busy";
}
