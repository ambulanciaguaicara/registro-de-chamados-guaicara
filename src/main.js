// --- Firebase init (expects global firebase compat scripts loaded in HTML) ---
const firebaseConfig = {
  // preencha com seu config real
  apiKey: "xxxxx",
  authDomain: "xxxxx.firebaseapp.com",
  databaseURL: "https://xxxxx-default-rtdb.firebaseio.com",
  projectId: "xxxxx",
  storageBucket: "xxxxx.appspot.com",
  messagingSenderId: "xxxxx",
  appId: "xxxxx",
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

// --- Auth guard / logout ---
auth.onAuthStateChanged((user) => {
  const uEl = document.getElementById("usuarioLogado");
  if (!uEl) return; // not on index page
  if (!user) {
    // se estiver na index e não logado, manda pro login
    if (!location.pathname.endsWith("/login.html")) {
      window.location.href = "/login.html";
    }
  } else {
    if (uEl) uEl.innerText = `Usuário: ${user.email || user.uid.slice(0, 6)}`;
  }
});

export function logout() {
  auth
    .signOut()
    .then(() => (window.location.href = "/login.html"))
    .catch((e) => alert("Erro ao sair: " + e.message));
}

// --- Connection status / sync time ---
function atualizarSync() {
  const el = document.getElementById("ultimaSync");
  if (el) el.innerText = "Última sync: " + new Date().toLocaleTimeString();
}
firebase
  .database()
  .ref(".info/connected")
  .on("value", (snap) => {
    const el = document.getElementById("statusConexao");
    if (!el) return;
    el.innerHTML = snap.val()
      ? 'Status: <span class="status-online">Conectado</span>'
      : 'Status: <span class="status-offline">Offline</span>';
  });

// --- Endereços (opcional: gerar dinamicamente do array) ---
const enderecosFixos = [
  "Rua Rio Branco",
  "Rua Rui Barbosa",
  "Av. Paulo Xavier Ribeiro",
  "Rua Pedro Bertolino",
  "Rua Professora Adelaide Baptista Pereira Cruz",
  "Av. Roberto Lima Alves",
  "Rua Rogê Ferreira",
  "Rua Roman Garcia Echeto",
  "Rua Rosa Grande",
  "Rua Rubens Puorro",
  "Rua Sabino",
  "Rua Sebastião de Souza",
  "Rua Pedro Dutra Sobrinho",
  "Rua Osvaldo Cruz",
  "Rua Dirce Camargo Vaz",
  "Rua João Pacífico da Silva",
  "Rua Ayrton Alves dos Santos",
  "Rua José Francisco Moco",
  "Av. Duque de Caxias",
  "Av. Nove de Julho",
  "Rua Adão Afonso Costa",
  "Rua Yoshi Sato",
  "Rua Sunao Katsuki",
  "Rua Frei Henrique",
  "Rua José do Patrocínio",
  "Rua Tiradentes",
  "Rua Da Amizade",
  "Rua Marechal Deodoro",
  "Rua Ana de Jesus Maia",
  "Rua Angelin Garoze",
  "Travessa Mariano Martinez",
  "Rua José Gringo dos Santos",
  "Rua Jovino Faustino Rosa",
  "Rua Hiroshi Suzuki",
  "Rua Noé Franco da Rocha",
  "Rua Agénor Leme Franco",
  "Rua Ana Carlotta Arruda Paula",
  "Rua Luiz Caetano",
  "Rua Luiz Esperança",
  "Rua Ercilio Lima dos Santos",
  "Rua Orlando Jorge",
  "Rua Dirce Camargo",
  "Rua Mario Pereira da Silva",
  "Rua Antonio Monteiro Paschoal",
  "Rua Manoel dos Reis Soares",
  "Rua Luiz Caetano da Silva",
];
function popularEnderecosSelect() {
  const sel = document.getElementById("endereco");
  if (!sel || sel.children.length > 1) return; // já tem opções
  enderecosFixos.forEach((e) => {
    const opt = document.createElement("option");
    opt.value = e;
    opt.textContent = e;
    sel.appendChild(opt);
  });
}
document.addEventListener("DOMContentLoaded", popularEnderecosSelect);

// --- Tipo de Chamado + extras arrays ---
let tipo = "normal";
export function tipoChamado(t) {
  tipo = t;
  alert(`Tipo de Chamado: ${t.toUpperCase()}`);
}

// Se quiser permitir múltiplas prioridades/sinais:
let prioridadesSelecionadas = [];
let sinaisSelecionados = [];
let finalidadeSelecionada = "";

export function adicionarDestino() {
  const novo = prompt("Digite novo destino:");
  if (novo) {
    const sel = document.getElementById("destino");
    if (!sel) return;
    const opt = document.createElement("option");
    opt.value = novo;
    opt.textContent = novo;
    sel.appendChild(opt);
    sel.value = novo;
    alert("Destino adicionado!");
  }
}

export function adicionarPrioridade() {
  const pSel = document.getElementById("prioridade");
  if (!pSel || !pSel.value) return alert("Selecione uma prioridade");
  const p = pSel.value;
  if (!prioridadesSelecionadas.includes(p)) {
    prioridadesSelecionadas.push(p);
    alert("Prioridade adicionada!");
  } else {
    alert("Essa prioridade já foi adicionada.");
  }
}

export function adicionarSinal() {
  const sSel = document.getElementById("sinais");
  if (!sSel || !sSel.value) return alert("Selecione um sinal/sintoma");
  const s = sSel.value;
  if (!sinaisSelecionados.includes(s)) {
    sinaisSelecionados.push(s);
    alert("Sinal/Sintoma adicionado!");
  } else {
    alert("Esse sinal já foi adicionado.");
  }
}

export function adicionarFinalidade() {
  const fSel = document.getElementById("finalidade");
  if (!fSel || !fSel.value) return alert("Selecione a finalidade");
  finalidadeSelecionada = fSel.value;
  alert("Finalidade adicionada!");
}

// --- Chamados: adicionar / replicar / excluir / listar ---
export function adicionarChamado() {
  if (!auth.currentUser) return alert("Usuário não autenticado");

  const paciente = document.getElementById("paciente")?.value || "";
  const data = document.getElementById("data")?.value || "";
  if (!paciente || !data) return alert("Preencha paciente e data!");

  const horario = document.getElementById("horario")?.value || new Date().toLocaleTimeString();
  const endereco = document.getElementById("endereco")?.value || "";
  const numero = document.getElementById("numero")?.value || "";
  const destino = document.getElementById("destino")?.value || "";
  const obs = document.getElementById("obs")?.value || "";
  const obito = document.getElementById("obito")?.value || "Não";

  // também permitir uma prioridade única via select, se desejar:
  const prioridadeSingle = document.getElementById("prioridade")?.value || "";

  const chamado = {
    data,
    horario,
    paciente,
    endereco,
    numero,
    destino,
    // Se quiser guardar ambos: prioridade única + lista de prioridades
    prioridade: prioridadeSingle,
    prioridades: prioridadesSelecionadas,
    sinais: sinaisSelecionados,
    finalidade: finalidadeSelecionada,
    obito,
    obs,
    tipo, // normal/urgencia/emergencia
    createdBy: auth.currentUser.uid,
    createdAt: new Date().toISOString(),
  };

  db.ref("chamados")
    .push(chamado)
    .then(() => {
      alert("Chamado adicionado!");
      // reset buffers
      tipo = "normal";
      prioridadesSelecionadas = [];
      sinaisSelecionados = [];
      finalidadeSelecionada = "";
      document.getElementById("prioridade").value = "";
      document.getElementById("sinais").value = "";
      document.getElementById("finalidade").value = "";
      document.getElementById("obito").value = "Não";
      document.getElementById("obs").value = "";
      atualizarSync();
    })
    .catch((e) => alert("Erro ao adicionar: " + e.message));
}

export function replicarChamado() {
  const check = document.querySelector("input[type=checkbox]:checked");
  if (!check) return alert("Selecione um chamado!");
  const id = check.dataset.id;
  db.ref("chamados/" + id)
    .once("value")
    .then((snap) => {
      const data = snap.val();
      return db.ref("chamados").push({ ...data, replicado: true, createdAt: new Date().toISOString() });
    })
    .then(() => alert("Chamado replicado"))
    .catch((e) => alert("Erro ao replicar: " + e.message));
}

export function excluirSelecionados() {
  const list = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
  if (!list.length) return alert("Selecione ao menos um chamado!");
  Promise.all(list.map((c) => db.ref("chamados/" + c.dataset.id).remove()))
    .then(() => atualizarSync())
    .catch((e) => alert("Erro ao excluir: " + e.message));
}

// --- Render chamados in realtime ---
function renderChamados() {
  const corpo = document.getElementById("corpoTabela");
  if (!corpo) return;

  db.ref("chamados").on("value", (snap) => {
    corpo.innerHTML = "";
    snap.forEach((item) => {
      const ch = item.val();
      const id = item.key;
      const tr = document.createElement("tr");

      // cor por tipo
      if (ch.tipo === "urgencia") tr.style.background = "#fffae6"; // amarelinho
      if (ch.tipo === "emergencia") tr.style.background = "#ffe5e5"; // vermelho claro
      if (ch.replicado) tr.classList.add("replicado");

      const prioridadesTxt = Array.isArray(ch.prioridades) ? ch.prioridades.join(", ") : ch.prioridade || "";
      const sinaisTxt = Array.isArray(ch.sinais) ? ch.sinais.join(", ") : ch.sinais || "";

      tr.innerHTML = `
        <td><input type="checkbox" data-id="${id}"></td>
        <td>${ch.data || ""}</td>
        <td>${ch.horario || ""}</td>
        <td>${ch.paciente || ""}</td>
        <td>${ch.endereco || ""}</td>
        <td>${ch.numero || ""}</td>
        <td>${ch.destino || ""}</td>
        <td>${prioridadesTxt}</td>
        <td>${sinaisTxt}</td>
        <td>${ch.finalidade || ""}</td>
        <td>${ch.obito || "Não"}</td>
        <td>${ch.obs || ""}</td>
      `;
      corpo.appendChild(tr);
    });
    atualizarSync();
  });
}
document.addEventListener("DOMContentLoaded", renderChamados);

// --- Chat ---
export function enviarMsg() {
  const inp = document.getElementById("chatMsg");
  if (!inp) return;
  const txt = inp.value;
  if (!txt.trim()) return;
  if (!auth.currentUser) return alert("Usuário não autenticado");
  db.ref("chat")
    .push({ msg: txt, uid: auth.currentUser.uid, hora: new Date().toLocaleTimeString() })
    .then(() => {
      inp.value = "";
      atualizarSync();
    });
}

export function editarMsg(id, atual) {
  const novo = prompt("Editar:", atual);
  if (!novo) return;
  db.ref("chat/" + id).update({ msg: novo });
}
export function delMsg(id) {
  db.ref("chat/" + id).remove();
}

function renderChat() {
  const area = document.getElementById("chatArea");
  if (!area) return;
  db.ref("chat").on("value", (snap) => {
    area.innerHTML = "";
    snap.forEach((item) => {
      const m = item.val();
      const id = item.key;
      const div = document.createElement("div");
      div.className = "message";
      div.innerHTML = `<b>${m.hora || ""}</b> — ${m.msg || ""}
        <div class="msg-actions">
          ${
            m.uid === (auth.currentUser && auth.currentUser.uid)
              ? `<span onclick="editarMsg('${id}','${m.msg || ""}')">Editar</span>
                 <span onclick="delMsg('${id}')">Excluir</span>`
              : ""
          }
        </div>`;
      area.appendChild(div);
    });
    atualizarSync();
  });
}
document.addEventListener("DOMContentLoaded", renderChat);

// --- Expose functions to global for inline onclicks ---
window.tipoChamado = tipoChamado;
window.adicionarChamado = adicionarChamado;
window.replicarChamado = replicarChamado;
window.excluirSelecionados = excluirSelecionados;
window.enviarMsg = enviarMsg;
window.editarMsg = editarMsg;
window.delMsg = delMsg;
window.adicionarDestino = adicionarDestino;
window.adicionarPrioridade = adicionarPrioridade;
window.adicionarSinal = adicionarSinal;
window.adicionarFinalidade = adicionarFinalidade;
window.logout = logout;
