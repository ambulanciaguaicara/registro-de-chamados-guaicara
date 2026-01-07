import { STATUS_MOTORISTA } from "../data/constants.js";
import { setDriverStatus, onDriversChange } from "../firebase.js";

let drivers = [];
let isInitialized = false;
let unsubscribe = null;
let currentRoot = null;
const listeners = [];

export function mountDrivers(el) {
  currentRoot = el;

  // Evitar múltiplos listeners
  if (!isInitialized) {
    // Escutar mudanças no Firebase
    unsubscribe = onDriversChange((firebaseDrivers) => {
      drivers = firebaseDrivers;
      if (currentRoot) {
        renderDrivers(currentRoot);
      }
      // Notificar outros componentes sobre mudanças
      listeners.forEach(callback => callback(drivers));
    });
    isInitialized = true;
  }

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

  tbody.innerHTML = drivers.map((driver, index) => {
    const escapedName = escapeHtml(driver.nome);
    const selectId = `driver-status-${index}`;
    return `
      <tr>
        <td>${escapedName}</td>
        <td>
          <select id="${selectId}" data-driver-name="${escapedName}">
            ${STATUS_MOTORISTA.map(status => 
              `<option value="${escapeHtml(status)}" ${driver.status === status ? "selected" : ""}>${escapeHtml(status)}</option>`
            ).join('')}
          </select>
        </td>
      </tr>
    `;
  }).join('');

  // Adicionar event listeners para os selects
  drivers.forEach((driver, index) => {
    const select = tbody.querySelector(`#driver-status-${index}`);
    if (select) {
      select.addEventListener('change', (e) => {
        const driverName = e.target.dataset.driverName;
        const newStatus = e.target.value;
        setDriverStatus(driverName, newStatus);
      });
    }
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function setDriverOnDuty(driverName, patientName) {
  setDriverStatus(driverName, `Em atendimento - ${patientName}`);
}

export function getDrivers() {
  return drivers;
}

// Permitir que outros componentes sejam notificados sobre mudanças nos motoristas
export function onDriversUpdate(callback) {
  listeners.push(callback);
  // Se já temos dados, notificar imediatamente
  if (drivers.length > 0) {
    callback(drivers);
  }
}
