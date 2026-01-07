import { watchCalls, deleteCall } from "../firebase.js";
import { formatDateTime } from "../utils/formatters.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

export function mountTable(el) {
  el.innerHTML = `
    <section>
      <h2>📊 Chamados Registrados</h2>
      <div style="margin-bottom: 16px; display: flex; gap: 8px;">
        <button class="btn-del" id="btnDeleteSelected">🗑️ Excluir Selecionados</button>
      </div>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" id="selectAll"></th>
              <th>Data/Hora</th>
              <th>Paciente</th>
              <th>Endereço</th>
              <th>Número</th>
              <th>Destino</th>
              <th>Motorista</th>
              <th>Prioridade</th>
              <th>Sinais</th>
              <th>Finalidade</th>
              <th>Óbito</th>
              <th>Tipo</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody id="tabelaChamados">
            <tr><td colspan="13" class="text-center">Carregando...</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;

  const tbody = el.querySelector("#tabelaChamados");
  const selectAll = el.querySelector("#selectAll");
  const btnDelete = el.querySelector("#btnDeleteSelected");

  // Select all checkbox
  selectAll.addEventListener("change", (e) => {
    const checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
  });

  // Delete selected
  btnDelete.addEventListener("click", async () => {
    const selected = [...tbody.querySelectorAll('input[type="checkbox"]:checked')]
      .map(cb => cb.dataset.id);
    
    if (selected.length === 0) {
      notifyError("Nenhum chamado selecionado");
      return;
    }

    if (!confirm(`Excluir ${selected.length} chamado(s)?`)) return;

    try {
      await Promise.all(selected.map(id => deleteCall(id)));
      notifySuccess(`${selected.length} chamado(s) excluído(s)`);
    } catch (error) {
      console.error(error);
      notifyError("Erro ao excluir: " + error.message);
    }
  });

  // Watch calls
  watchCalls((snapshot) => {
    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="13" class="text-center">Nenhum chamado registrado</td></tr>';
      return;
    }

    tbody.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const tr = document.createElement("tr");
      
      // Adicionar classe baseada no tipo
      if (data.tipoChamado === "Urgência") {
        tr.classList.add("urgencia");
      } else if (data.tipoChamado === "Emergência") {
        tr.classList.add("emergencia");
      }

      const sinaisText = Array.isArray(data.sinais) ? data.sinais.join(", ") : data.sinais || "—";
      
      tr.innerHTML = `
        <td><input type="checkbox" data-id="${doc.id}"></td>
        <td>${formatDateTime(data.dataHora)}</td>
        <td>${data.paciente}</td>
        <td>${data.endereco}</td>
        <td>${data.numero || "—"}</td>
        <td>${data.destino}</td>
        <td>${data.motorista}</td>
        <td>${data.prioridade || "—"}</td>
        <td>${sinaisText}</td>
        <td>${data.finalidade || "—"}</td>
        <td>${data.obito}</td>
        <td><span class="badge badge-${data.tipoChamado?.toLowerCase() || 'normal'}">${data.tipoChamado || "Normal"}</span></td>
        <td>${data.observacoes || "—"}</td>
      `;

      tbody.appendChild(tr);
    });
  });
}
