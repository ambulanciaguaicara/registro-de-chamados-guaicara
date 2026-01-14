// Módulo para buscar pacientes cadastrados (com prontuário)
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

export async function fetchPacientes() {
  const prontuariosCol = collection(db, "prontuarios");
  const snap = await getDocs(prontuariosCol);
  return snap.docs.map(doc => doc.id);
}

export function mountBuscaPacientes(el, onSelect) {
  el.innerHTML = `
    <section>
      <h2>🔎 Buscar Paciente</h2>
      <input id="inputBuscaPaciente" type="text" placeholder="Digite o nome do paciente..." style="margin-bottom: 12px;">
      <ul id="listaPacientes" class="history-list"></ul>
    </section>
  `;
  const input = el.querySelector('#inputBuscaPaciente');
  const ul = el.querySelector('#listaPacientes');

  let pacientes = [];
  fetchPacientes().then(list => {
    pacientes = list;
    renderList();
  });

  input.oninput = renderList;

  function renderList() {
    const termo = input.value.trim().toLowerCase();
    ul.innerHTML = '';
    const filtrados = termo ? pacientes.filter(p => p.toLowerCase().includes(termo)) : pacientes;
    if (filtrados.length === 0) {
      ul.innerHTML = '<li>Nenhum paciente encontrado.</li>';
      return;
    }
    filtrados.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      li.style.cursor = 'pointer';
      li.onclick = () => onSelect && onSelect(p);
      ul.appendChild(li);
    });
  }
}
