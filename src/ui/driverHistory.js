// Módulo para exibir histórico de status do motorista
import { watchDrivers, watchDriverHistory } from "../firebase.js";

export function mountDriverHistory(el) {
  el.innerHTML = `
    <section>
      <h2>🕓 Histórico de Status dos Motoristas</h2>
      <select id="selectMotorista" style="margin-bottom: 12px;"></select>
      <ul id="historicoStatus" class="history-list"></ul>
    </section>
  `;
  const select = el.querySelector('#selectMotorista');
  const ul = el.querySelector('#historicoStatus');

  // Carregar motoristas
  watchDrivers((snapshot) => {
    select.innerHTML = '<option value="">Selecione o motorista</option>';
    snapshot.forEach(doc => {
      const nome = doc.data().nome;
      select.innerHTML += `<option value="${nome}">${nome}</option>`;
    });
  });

  select.onchange = () => {
    ul.innerHTML = '';
    if (!select.value) return;
    watchDriverHistory(select.value, (snap) => {
      ul.innerHTML = '';
      if (snap.empty) {
        ul.innerHTML = '<li>Nenhum histórico encontrado.</li>';
        return;
      }
      snap.forEach(doc => {
        const d = doc.data();
        const dt = d.timestamp?.toDate ? d.timestamp.toDate() : new Date();
        ul.innerHTML += `<li><b>${dt.toLocaleString()}</b>: ${d.status}</li>`;
      });
    });
  };
}
