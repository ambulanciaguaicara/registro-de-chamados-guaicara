import { mountForm } from "./components/form.js";
import { mountDrivers } from "./components/drivers.js";
import { onCallsChange } from "./firebase.js";

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Montar componentes
  const formContainer = document.querySelector("#formContainer") || document.querySelector(".container");
  const driversContainer = document.querySelector("#driversContainer") || document.querySelector(".sidebar");

  if (formContainer) {
    mountForm(formContainer);
  }

  if (driversContainer) {
    mountDrivers(driversContainer);
  }

  // Escutar mudanças nos chamados
  onCallsChange((calls) => {
    renderCalls(calls);
  });
});

function renderCalls(calls) {
  const tbody = document.querySelector("#corpoTabela");
  if (!tbody) return;

  tbody.innerHTML = calls.map(call => `
    <tr>
      <td>${new Date(call.dataHora).toLocaleString('pt-BR')}</td>
      <td>${call.paciente}</td>
      <td>${call.endereco}, ${call.numero}</td>
      <td>${call.destino}</td>
      <td>${call.motorista}</td>
      <td>${call.prioridade}</td>
      <td>${Array.isArray(call.sinais) ? call.sinais.join(', ') : call.sinais || '—'}</td>
      <td>${call.finalidade}</td>
      <td>${call.obito}</td>
      <td>${call.observacoes || '—'}</td>
      <td>${call.tipoChamado}</td>
    </tr>
  `).join('');
}
