import { DESTINOS, PRIORIDADES, SINAIS_SINTOMAS, FINALIDADES, TIPO_CHAMADO } from "../data/constants.js";
import { STREETS } from "../data/streets.js";
import { createCall } from "../firebase.js";
import { setDriverOnDuty, getDrivers } from "./drivers.js";

export function mountForm(el) {
  el.innerHTML = `
    <h2>Novo Chamado</h2>
    <form id="chamadoForm">
      <div class="grid">
        <label>Data e Hora
          <input type="datetime-local" id="dataHora" required>
        </label>
        <label>Paciente
          <input type="text" id="paciente" required>
        </label>
        <label>Endereço
          <select id="endereco" required>
            <option value="">Selecione o endereço</option>
            ${STREETS.map(s => `<option value="${s}">${s}</option>`).join("")}
          </select>
        </label>
        <label>Número
          <input type="text" id="numero" required>
        </label>
        <label>Destino
          <select id="destino" required>
            <option value="">Selecione o destino</option>
            ${DESTINOS.map(d => `<option value="${d}">${d}</option>`).join("")}
          </select>
        </label>
        <label>Motorista
          <select id="motorista" required>
            <option value="">Selecione o motorista</option>
            ${getDrivers().map(d => `<option value="${d.nome}">${d.nome}</option>`).join("")}
          </select>
        </label>
        <label>Chegada do Motorista
          <input type="time" id="chegadaMotorista">
        </label>
        <label>Prioridade
          <select id="prioridade" required>
            <option value="">Selecione a prioridade</option>
            ${PRIORIDADES.map(p => `<option value="${p}">${p}</option>`).join("")}
          </select>
        </label>
        <label>Sinais/Sintomas
          <select id="sinais" multiple>
            ${SINAIS_SINTOMAS.map(s => `<option value="${s}">${s}</option>`).join("")}
          </select>
          <small>Segure Ctrl para selecionar múltiplos</small>
        </label>
        <label>Finalidade
          <select id="finalidade" required>
            <option value="">Selecione a finalidade</option>
            ${FINALIDADES.map(f => `<option value="${f}">${f}</option>`).join("")}
          </select>
        </label>
        <label>Óbito
          <select id="obito" required>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </label>
        <label>Observações
          <textarea id="observacoes" rows="3"></textarea>
        </label>
        <label>Tipo de Chamado
          <select id="tipoChamado" required>
            <option value="">Selecione o tipo</option>
            ${TIPO_CHAMADO.map(t => `<option value="${t}">${t}</option>`).join("")}
          </select>
        </label>
      </div>
      <button type="submit" class="btn-add">Adicionar chamado</button>
    </form>
  `;

  el.querySelector("#chamadoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = collectFormData(el);
    
    try {
      const docRef = await createCall(data);
      await setDriverOnDuty(data.motorista, data.paciente);
      e.target.reset();
      alert("✅ Chamado adicionado com sucesso: " + docRef.key);
    } catch (error) {
      console.error("Erro ao adicionar chamado:", error);
      alert("❌ Erro ao adicionar chamado: " + error.message);
    }
  });
}

function collectFormData(root) {
  const get = (id) => root.querySelector(`#${id}`);
  const selectedMultiple = (sel) => [...sel.selectedOptions].map(o => o.value);

  return {
    dataHora: get("dataHora").value,
    paciente: get("paciente").value,
    endereco: get("endereco").value,
    numero: get("numero").value,
    destino: get("destino").value,
    motorista: get("motorista").value,
    chegadaMotorista: get("chegadaMotorista").value || null,
    prioridade: get("prioridade").value,
    sinais: selectedMultiple(get("sinais")),
    finalidade: get("finalidade").value,
    obito: get("obito").value,
    observacoes: get("observacoes").value,
    tipoChamado: get("tipoChamado").value,
  };
}
