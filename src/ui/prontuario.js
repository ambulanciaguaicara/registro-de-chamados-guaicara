// Módulo para exibir prontuário do paciente
import { watchProntuario } from "../firebase.js";

export function mountProntuario(el) {
  el.innerHTML = `
    <section>
      <h2>🗂️ Prontuário do Paciente</h2>
      <input id="inputPacienteProntuario" type="text" placeholder="Nome do paciente" style="margin-bottom: 12px;">
      <ul id="listaProntuario" class="history-list"></ul>
    </section>
  `;
  const input = el.querySelector('#inputPacienteProntuario');
  const ul = el.querySelector('#listaProntuario');

  let unsub = null;
  input.oninput = () => {
    ul.innerHTML = '';
    if (unsub) unsub();
    const nome = input.value.trim();
    if (!nome) return;
    unsub = watchProntuario(nome, (snap) => {
      ul.innerHTML = '';
      if (snap.empty) {
        ul.innerHTML = '<li>Nenhum chamado encontrado para este paciente.</li>';
        return;
      }
      snap.forEach(doc => {
        const d = doc.data();
        const dt = d.dataHora ? new Date(d.dataHora) : null;
        ul.innerHTML += `<li><b>${dt ? dt.toLocaleString() : ''}</b> - Destino: ${d.destino || ''} - Motorista: ${d.motorista || ''} - Profissional: ${d.profissional || ''} - Enfermagem: ${d.enfermagem || ''} - Tipo: ${d.tipoChamado || ''}</li>`;
      });
    });
  };
}
