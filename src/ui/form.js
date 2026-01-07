import { DESTINOS, PRIORIDADES, SINAIS_SINTOMAS, FINALIDADES, TIPO_CHAMADO } from "../data/constants.js";
import { STREETS } from "../data/streets.js";
import { createCall, setDriverOnDuty } from "../firebase.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";
import { validateForm } from "../utils/validators.js";

export function mountForm(el) {
  el.innerHTML = `
    <section>
      <h2>📋 Novo Chamado</h2>
      <form id="chamadoForm">
        <div class="grid">
          <label>
            Data e Hora
            <input type="datetime-local" id="dataHora" required>
          </label>
          <label>
            Paciente
            <input type="text" id="paciente" required placeholder="Nome do paciente">
          </label>
          <label>
            Endereço
            <select id="endereco" required>
              <option value="">Selecione...</option>
              ${STREETS.map(s => `<option value="${s}">${s}</option>`).join("")}
            </select>
          </label>
          <label>
            Número
            <input type="text" id="numero" required placeholder="N°">
          </label>
          <label>
            Destino
            <select id="destino" required>
              <option value="">Selecione...</option>
              ${DESTINOS.map(d => `<option value="${d}">${d}</option>`).join("")}
            </select>
          </label>
          <label>
            Motorista
            <input type="text" id="motorista" required placeholder="Nome do motorista">
          </label>
          <label>
            Prioridade
            <select id="prioridade" required>
              <option value="">Selecione...</option>
              ${PRIORIDADES.map(p => `<option value="${p}">${p}</option>`).join("")}
            </select>
          </label>
          <label>
            Sinais/Sintomas
            <select id="sinais" multiple>
              ${SINAIS_SINTOMAS.map(s => `<option value="${s}">${s}</option>`).join("")}
            </select>
            <small>Ctrl+clique para múltiplos</small>
          </label>
          <label>
            Finalidade
            <select id="finalidade" required>
              <option value="">Selecione...</option>
              ${FINALIDADES.map(f => `<option value="${f}">${f}</option>`).join("")}
            </select>
          </label>
          <label>
            Óbito
            <select id="obito" required>
              <option value="Não">Não</option>
              <option value="Sim">Sim</option>
            </select>
          </label>
          <label>
            Tipo de Chamado
            <select id="tipoChamado" required>
              <option value="">Selecione...</option>
              ${TIPO_CHAMADO.map(t => `<option value="${t}">${t}</option>`).join("")}
            </select>
          </label>
          <label style="grid-column: 1 / -1;">
            Observações
            <textarea id="observacoes" rows="3" placeholder="Informações adicionais..."></textarea>
          </label>
        </div>
        <div style="margin-top: 16px;">
          <button type="submit" class="btn-add">🚑 Adicionar Chamado</button>
        </div>
      </form>
    </section>
  `;

  // Set default datetime to now
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  el.querySelector("#dataHora").value = localDateTime;

  el.querySelector("#chamadoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    
    const data = {
      dataHora: form.querySelector("#dataHora").value,
      paciente: form.querySelector("#paciente").value.trim(),
      endereco: form.querySelector("#endereco").value,
      numero: form.querySelector("#numero").value.trim(),
      destino: form.querySelector("#destino").value,
      motorista: form.querySelector("#motorista").value.trim(),
      prioridade: form.querySelector("#prioridade").value,
      sinais: [...form.querySelector("#sinais").selectedOptions].map(o => o.value),
      finalidade: form.querySelector("#finalidade").value,
      obito: form.querySelector("#obito").value,
      observacoes: form.querySelector("#observacoes").value.trim(),
      tipoChamado: form.querySelector("#tipoChamado").value,
    };

    // Validate
    const errors = validateForm(data);
    if (errors.length > 0) {
      notifyError(errors[0]);
      return;
    }

    try {
      const docRef = await createCall(data);
      await setDriverOnDuty(data.motorista, data.paciente);
      form.reset();
      
      // Reset datetime to now
      el.querySelector("#dataHora").value = localDateTime;
      
      notifySuccess(`Chamado ${docRef.id.slice(0,8)}... registrado com sucesso!`);
    } catch (error) {
      console.error(error);
      notifyError("Erro ao adicionar chamado: " + error.message);
    }
  });
}
