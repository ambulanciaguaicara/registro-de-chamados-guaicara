import { mountForm } from "./components/form.js";
import { mountDrivers } from "./components/drivers.js";
import { onCallsChange } from "./firebase.js";

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.querySelector(".container");
  const sidebar = document.querySelector(".sidebar");

  // Montar motoristas primeiro (para que o form possa acessar a lista)
  if (sidebar) {
    // Usar a tabela de motoristas como referência para encontrar a seção
    const motoristasTable = sidebar.querySelector("#tabelaMotoristas");
    if (motoristasTable) {
      // Criar container para motoristas
      const motoristasContainer = document.createElement("div");
      motoristasContainer.id = "motoristasSection";
      
      // Encontrar todos os elementos da seção de motoristas
      // (h3, botão e tabela)
      const table = motoristasTable.closest('table');
      const button = table.previousElementSibling;
      const h3 = button.previousElementSibling;
      
      // Remover elementos antigos
      if (table) table.remove();
      if (button && button.classList.contains('btn-add')) button.remove();
      if (h3 && h3.tagName === 'H3') h3.remove();
      
      // Adicionar novo container
      sidebar.appendChild(motoristasContainer);
      mountDrivers(motoristasContainer);
    }
  }

  // Montar formulário depois dos motoristas
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
      <td>${escapeHtml(call.paciente)}</td>
      <td>${escapeHtml(call.endereco)}, ${escapeHtml(call.numero)}</td>
      <td>${escapeHtml(call.destino)}</td>
      <td>${escapeHtml(call.motorista)}</td>
      <td>${escapeHtml(call.prioridade)}</td>
      <td>${Array.isArray(call.sinais) ? call.sinais.map(s => escapeHtml(s)).join(', ') : escapeHtml(call.sinais || '—')}</td>
      <td>${escapeHtml(call.finalidade)}</td>
      <td>${escapeHtml(call.obito)}</td>
      <td>${escapeHtml(call.observacoes || '—')}</td>
      <td>${escapeHtml(call.tipoChamado)}</td>
    </tr>
  `).join('');
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
