import { watchCalls, deleteCall, createCall } from "../firebase.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";
import { formatDateTime } from "../utils/formatters.js";

let selectedCallId = null;

export function mountTable(el) {
  el.innerHTML = `
    <section>
      <h2>📊 Chamados Registrados</h2>
      <div style="margin-bottom: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn-del" id="btnExcluir">🗑️ Excluir Selecionado</button>
        <button class="btn-success" id="btnReplicar">📋 Replicar Selecionado</button>
      </div>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Sel</th>
              <th>Data/Hora</th>
              <th>Paciente</th>
              <th>Endereço</th>
              <th>N°</th>
              <th>Destino</th>
              <th>Motorista</th>
              <th>Prioridade</th>
              <th>Sinais/Sintomas</th>
              <th>Finalidade</th>
              <th>Óbito</th>
              <th>Tipo</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody id="tabelaChamados">
            <tr>
              <td colspan="13" style="text-align: center; padding: 40px;">
                <div class="loading"></div>
                Carregando chamados...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;

  const tbody = el.querySelector("#tabelaChamados");
  const btnExcluir = el.querySelector("#btnExcluir");
  const btnReplicar = el.querySelector("#btnReplicar");

  // Watch for changes in calls
  watchCalls((snapshot) => {
    tbody.innerHTML = "";
    
    if (snapshot.empty) {
      tbody.innerHTML = `
        <tr>
          <td colspan="13" style="text-align: center; padding: 40px; color: #90A4AE;">
            Nenhum chamado registrado ainda.
          </td>
        </tr>
      `;
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const tr = document.createElement("tr");
      
      // Add class based on tipo
      if (data.tipoChamado === "Emergência") {
        tr.classList.add("emergencia");
      } else if (data.tipoChamado === "Urgência") {
        tr.classList.add("urgencia");
      }

      // Format datetime
      let formattedDate = formatDateTime(data.dataHora);
      if (data.createdAt && data.createdAt.toDate) {
        formattedDate = formatDateTime(data.createdAt.toDate());
      }

      tr.innerHTML = `
        <td><input type="radio" name="selectedCall" value="${doc.id}"></td>
        <td>${formattedDate}</td>
        <td>${data.paciente || '—'}</td>
        <td>${data.endereco || '—'}</td>
        <td>${data.numero || '—'}</td>
        <td>${data.destino || '—'}</td>
        <td>${data.motorista || '—'}</td>
        <td><span class="badge badge-${(data.prioridade || 'normal').toLowerCase()}">${data.prioridade || '—'}</span></td>
        <td>${Array.isArray(data.sinais) ? data.sinais.join(', ') : (data.sinais || '—')}</td>
        <td>${data.finalidade || '—'}</td>
        <td>${data.obito || '—'}</td>
        <td><span class="badge badge-${(data.tipoChamado || 'normal').toLowerCase()}">${data.tipoChamado || 'Normal'}</span></td>
        <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${data.observacoes || '—'}</td>
      `;

      tbody.appendChild(tr);
    });
  });

  // Delete selected call
  btnExcluir.addEventListener("click", async () => {
    const selected = el.querySelector("input[name='selectedCall']:checked");
    if (!selected) {
      notifyError("Selecione um chamado para excluir");
      return;
    }

    if (!confirm("Tem certeza que deseja excluir este chamado?")) {
      return;
    }

    try {
      await deleteCall(selected.value);
      notifySuccess("Chamado excluído com sucesso!");
    } catch (error) {
      console.error(error);
      notifyError("Erro ao excluir chamado: " + error.message);
    }
  });

  // Replicate selected call
  btnReplicar.addEventListener("click", async () => {
    const selected = el.querySelector("input[name='selectedCall']:checked");
    if (!selected) {
      notifyError("Selecione um chamado para replicar");
      return;
    }

    try {
      // Get the selected call data
      const snapshot = await new Promise((resolve) => {
        const unsubscribe = watchCalls((snap) => {
          unsubscribe();
          resolve(snap);
        });
      });

      const docToReplicate = snapshot.docs.find(doc => doc.id === selected.value);
      if (!docToReplicate) {
        notifyError("Chamado não encontrado");
        return;
      }

      const originalData = docToReplicate.data();
      
      // Create a copy without timestamps
      const newData = {
        dataHora: originalData.dataHora,
        paciente: originalData.paciente,
        endereco: originalData.endereco,
        numero: originalData.numero,
        destino: originalData.destino,
        motorista: originalData.motorista,
        prioridade: originalData.prioridade,
        sinais: originalData.sinais,
        finalidade: originalData.finalidade,
        obito: originalData.obito,
        observacoes: (originalData.observacoes || '') + ' [REPLICADO]',
        tipoChamado: originalData.tipoChamado,
      };

      await createCall(newData);
      notifySuccess("Chamado replicado com sucesso!");
    } catch (error) {
      console.error(error);
      notifyError("Erro ao replicar chamado: " + error.message);
    }
  });
}
