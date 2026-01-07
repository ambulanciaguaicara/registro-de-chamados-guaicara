import { db, collection, query, where, getDocs } from "../firebase.js";
import { formatDateTime } from "../utils/formatters.js";

export function mountProntuarios(el) {
  el.innerHTML = `
    <section class="prontuarios-section">
      <h2>📁 Prontuários de Pacientes</h2>
      
      <div class="prontuarios-search">
        <input 
          type="text" 
          id="searchPaciente" 
          placeholder="Buscar paciente por nome..."
        >
        <button id="btnBuscarPaciente" class="btn-add">🔍 Buscar</button>
      </div>
      
      <div id="prontuarioResult" class="prontuario-result"></div>
    </section>
  `;

  setupProntuariosEvents(el);
}

function setupProntuariosEvents(root) {
  root.querySelector("#btnBuscarPaciente").addEventListener("click", async () => {
    const nomePaciente = root.querySelector("#searchPaciente").value.trim();
    
    if (!nomePaciente) {
      return alert("Digite o nome do paciente");
    }

    try {
      const prontuario = await buscarProntuario(nomePaciente);
      renderProntuario(root, prontuario);
    } catch (error) {
      alert("Erro ao buscar prontuário: " + error.message);
    }
  });

  root.querySelector("#searchPaciente").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      root.querySelector("#btnBuscarPaciente").click();
    }
  });
}

async function buscarProntuario(nomePaciente) {
  const callsRef = collection(db, "chamados");
  const q = query(
    callsRef, 
    where("paciente", "==", nomePaciente)
  );
  
  const snapshot = await getDocs(q);
  const atendimentos = [];
  
  snapshot.forEach(doc => {
    atendimentos.push({ id: doc.id, ...doc.data() });
  });

  // Ordenar por data
  atendimentos.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return {
    nomePaciente,
    totalAtendimentos: atendimentos.length,
    atendimentos
  };
}

function renderProntuario(root, prontuario) {
  const resultDiv = root.querySelector("#prontuarioResult");
  
  if (prontuario.totalAtendimentos === 0) {
    resultDiv.innerHTML = `
      <div class="prontuario-empty">
        <p>Nenhum atendimento encontrado para: <strong>${prontuario.nomePaciente}</strong></p>
      </div>
    `;
    return;
  }

  resultDiv.innerHTML = `
    <div class="prontuario-header">
      <h3>Paciente: ${prontuario.nomePaciente}</h3>
      <span class="badge-normal">${prontuario.totalAtendimentos} atendimento(s)</span>
    </div>
    
    <div class="table-wrapper">
      <table class="prontuario-table">
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Endereço</th>
            <th>Destino</th>
            <th>Prioridade</th>
            <th>Sinais/Sintomas</th>
            <th>Motorista</th>
            <th>Enfermagem</th>
            <th>Atendente</th>
          </tr>
        </thead>
        <tbody>
          ${prontuario.atendimentos.map(at => `
            <tr>
              <td>${at.data || "—"} ${at.hora || ""}</td>
              <td>${at.endereco || "—"}${at.numero ? ", " + at.numero : ""}</td>
              <td>${at.destino || "—"}</td>
              <td>${at.prioridade || "—"}</td>
              <td>${at.sinais || "—"}</td>
              <td>${at.motorista || "—"}</td>
              <td>${at.enfermagem || "—"}</td>
              <td>${at.criadoPorNome || "—"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
