import { DESTINOS, PRIORIDADES, SINAIS_SINTOMAS, FINALIDADES, TIPO_CHAMADO } from "../data/constants.js";
import { STREETS } from "../data/streets.js";
import { createCall, setDriverOnDuty } from "../firebase.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

export function mountForm(el) {
  el.innerHTML = `
    <section>
      <h2>📋 Novo Chamado</h2>
      <form id="chamadoForm" class="grid">
        <label>
          Data e Hora
          <input type="datetime-local" id="dataHora" required>
        </label>
        <label>
          Paciente
          <input type="text" id="paciente" required>
        </label>
        <label>
          Endereço
          <div style="display: flex; gap: 6px; align-items: center;">
            <select id="endereco" required style="flex:1;">
              <option value="">Selecione...</option>
              ${STREETS.map(s => `<option value="${s}">${s}</option>`).join("")}
            </select>
            <button type="button" id="addEndereco" class="btn-add" title="Adicionar novo endereço" style="padding: 6px 10px;">+</button>
          </div>
        </label>
        <label>
          Número
          <input type="text" id="numero" required>
        </label>
        <label>
          Destino
          <div style="display: flex; gap: 6px; align-items: center;">
            <select id="destino" required style="flex:1;">
              <option value="">Selecione...</option>
              ${DESTINOS.map(d => `<option value="${d}">${d}</option>`).join("")}
            </select>
            <button type="button" id="addDestino" class="btn-add" title="Adicionar novo destino" style="padding: 6px 10px;">+</button>
          </div>
        </label>
        <label>
          Motorista
          <input type="text" id="motorista" required>
        </label>
        <label>
          Enfermagem
          <input type="text" id="enfermagem" placeholder="Nome da enfermagem">
        </label>
        <label>
          Prioridade
          <div style="display: flex; gap: 6px; align-items: center;">
            <select id="prioridade" required style="flex:1;">
              <option value="">Selecione...</option>
              ${PRIORIDADES.map(p => `<option value="${p}">${p}</option>`).join("")}
            </select>
            <button type="button" id="addPrioridade" class="btn-add" title="Adicionar nova prioridade" style="padding: 6px 10px;">+</button>
          </div>
        </label>
        <label>
          Sinais/Sintomas
          <div style="display: flex; gap: 6px; align-items: center;">
            <select id="sinais" multiple style="flex:1;">
              ${SINAIS_SINTOMAS.map(s => `<option value="${s}">${s}</option>`).join("")}
            </select>
            <button type="button" id="addSinal" class="btn-add" title="Adicionar novo sinal/sintoma" style="padding: 6px 10px;">+</button>
          </div>
          <small>Ctrl+clique para múltiplos</small>
        </label>
        <label>
          Finalidade
          <div style="display: flex; gap: 6px; align-items: center;">
            <select id="finalidade" required style="flex:1;">
              <option value="">Selecione...</option>
              ${FINALIDADES.map(f => `<option value="${f}">${f}</option>`).join("")}
            </select>
            <button type="button" id="addFinalidade" class="btn-add" title="Adicionar nova finalidade" style="padding: 6px 10px;">+</button>
          </div>
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
          <textarea id="observacoes" rows="3"></textarea>
        </label>
        <div style="grid-column: 1 / -1;">
          <button type="submit" class="btn-add">🚑 Adicionar Chamado</button>
        </div>
      </form>
    </section>
  `;
  // Botões de adicionar dinâmico
  el.querySelector('#addEndereco').onclick = () => {
    const novo = prompt('Digite o novo endereço:');
    if (novo) {
      const select = el.querySelector('#endereco');
      const opt = document.createElement('option');
      opt.value = novo;
      opt.textContent = novo;
      select.appendChild(opt);
      select.value = novo;
    }
  };
  el.querySelector('#addDestino').onclick = () => {
    const novo = prompt('Digite o novo destino:');
    if (novo) {
      const select = el.querySelector('#destino');
      const opt = document.createElement('option');
      opt.value = novo;
      opt.textContent = novo;
      select.appendChild(opt);
      select.value = novo;
    }
  };
  el.querySelector('#addPrioridade').onclick = () => {
    const novo = prompt('Digite a nova prioridade:');
    if (novo) {
      const select = el.querySelector('#prioridade');
      const opt = document.createElement('option');
      opt.value = novo;
      opt.textContent = novo;
      select.appendChild(opt);
      select.value = novo;
    }
  };
  el.querySelector('#addFinalidade').onclick = () => {
    const novo = prompt('Digite a nova finalidade:');
    if (novo) {
      const select = el.querySelector('#finalidade');
      const opt = document.createElement('option');
      opt.value = novo;
      opt.textContent = novo;
      select.appendChild(opt);
      select.value = novo;
    }
  };
  el.querySelector('#addSinal').onclick = () => {
    const novo = prompt('Digite o novo sinal/sintoma:');
    if (novo) {
      const select = el.querySelector('#sinais');
      const opt = document.createElement('option');
      opt.value = novo;
      opt.textContent = novo;
      select.appendChild(opt);
      opt.selected = true;
    }
  };

  // Definir data/hora atual
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  el.querySelector("#dataHora").value = now.toISOString().slice(0, 16);

  el.querySelector("#chamadoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      dataHora: form.querySelector("#dataHora").value,
      paciente: form.querySelector("#paciente").value,
      endereco: form.querySelector("#endereco").value,
      numero: form.querySelector("#numero").value,
      destino: form.querySelector("#destino").value,
      motorista: form.querySelector("#motorista").value,
      enfermagem: form.querySelector("#enfermagem").value,
      prioridade: form.querySelector("#prioridade").value,
      sinais: [...form.querySelector("#sinais").selectedOptions].map(o => o.value),
      finalidade: form.querySelector("#finalidade").value,
      obito: form.querySelector("#obito").value,
      observacoes: form.querySelector("#observacoes").value,
      tipoChamado: form.querySelector("#tipoChamado").value,
    };

    try {
      const docRef = await createCall(data);
      await setDriverOnDuty(data.motorista, data.paciente);
      form.reset();
      // Restaurar data/hora atual
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      form.querySelector("#dataHora").value = now.toISOString().slice(0, 16);
      notifySuccess(`Chamado ${docRef.id.slice(0,8)}... registrado!`);
    } catch (error) {
      console.error(error);
      notifyError("Erro ao adicionar chamado: " + error.message);
    }
  });
}
