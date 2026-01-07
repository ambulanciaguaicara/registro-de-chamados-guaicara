import { STATUS_MOTORISTA } from "../data/constants.js";
import { setDriverStatus, onDriversChange } from "../firebase.js";

let drivers = [];

export function mountDrivers(el) {
  // Escutar mudanças no Firebase
  onDriversChange((firebaseDrivers) => {
    drivers = firebaseDrivers;
    renderDrivers(el);
  });

  const html = `
    <h3>Motoristas</h3>
    <button class="btn-add" id="btnAddDriver">Adicionar motorista</button>
    <table class="motoristas-tabela">
      <thead>
        <tr><th>Motorista</th><th>Status</th></tr>
      </thead>
      <tbody id="tabelaMotoristas"></tbody>
    </table>
  `;
  
  el.innerHTML = html;
  renderDrivers(el);

  // Event listener para adicionar motorista
  el.querySelector("#btnAddDriver").addEventListener("click", () => {
    const nome = prompt("Digite o nome do motorista:");
    if (nome && nome.trim()) {
      setDriverStatus(nome.trim(), "Disponível na unidade");
    }
  });
}

function renderDrivers(root) {
  const tbody = root.querySelector("#tabelaMotoristas");
  if (!tbody) return;

  tbody.innerHTML = drivers.map(driver => `
    <tr>
      <td>${driver.nome}</td>
      <td>
        <select onchange="window.changeDriverStatus('${driver.nome}', this.value)">
          ${STATUS_MOTORISTA.map(status => 
            `<option ${driver.status === status ? "selected" : ""}>${status}</option>`
          ).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

export function setDriverOnDuty(driverName, patientName) {
  setDriverStatus(driverName, `Em atendimento - ${patientName}`);
}

// Expor para onclick
window.changeDriverStatus = (nome, status) => {
  setDriverStatus(nome, status);
};

export function getDrivers() {
  return drivers;
}
