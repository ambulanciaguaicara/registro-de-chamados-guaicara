import { mountForm } from "./components/form.js";
import { mountDrivers } from "./components/drivers.js";
import { onCallsChange } from "./firebase.js";

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Montar componentes
  const formContainer = document.querySelector(".container");
  const sidebar = document.querySelector(".sidebar");

  if (formContainer) {
    // Limpar container e adicionar form
    formContainer.innerHTML = "";
    mountForm(formContainer);
    
    // Adicionar tabela de chamados após o formulário
    const tableSection = document.createElement("div");
    tableSection.innerHTML = `
      <h2>Chamados Registrados</h2>
      <table class="chamados-tabela">
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Paciente</th>
            <th>Endereço</th>
            <th>Destino</th>
            <th>Motorista</th>
            <th>Prioridade</th>
            <th>Sinais/Sintomas</th>
            <th>Finalidade</th>
            <th>Óbito</th>
            <th>Observações</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody id="corpoTabela"></tbody>
      </table>
    `;
    formContainer.appendChild(tableSection);
  }

  if (sidebar) {
    // Encontrar e substituir apenas a seção de motoristas
    const motoristasSection = sidebar.querySelector("h3:last-of-type");
    if (motoristasSection && motoristasSection.textContent === "Motoristas") {
      // Criar container para motoristas
      const motoristasContainer = document.createElement("div");
      motoristasContainer.id = "motoristasSection";
      
      // Substituir tudo após o h3 de Motoristas
      const nextElements = [];
      let current = motoristasSection.nextElementSibling;
      while (current) {
        nextElements.push(current);
        current = current.nextElementSibling;
      }
      
      // Remover elementos antigos
      nextElements.forEach(el => el.remove());
      motoristasSection.remove();
      
      // Adicionar novo container
      sidebar.appendChild(motoristasContainer);
      mountDrivers(motoristasContainer);
    }
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
