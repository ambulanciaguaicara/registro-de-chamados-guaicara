// Configuração do Firebase (seu projeto)
const firebaseConfig = {
  apiKey: "AIzaSyCoSPb1WMrH2MMuM1AdR2YEAX60XVgO3WE",
  authDomain: "registro-ambulancia192.firebaseapp.com",
  databaseURL: "https://registro-ambulancia192-default-rtdb.firebaseio.com",
  projectId: "registro-ambulancia192",
  storageBucket: "registro-ambulancia192.firebasestorage.app",
  messagingSenderId: "549498386461",
  appId: "1:549498386461:web:94d6ac364a54a7d4216ef4",
  measurementId: "G-NM7EQL6E83"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

// --- Autenticação ---
auth.onAuthStateChanged((user) => {
  const uEl = document.getElementById("usuarioLogado");
  if (!user) {
    if (!location.pathname.endsWith("/login.html")) {
      window.location.href = "/login.html";
    }
  } else {
    if (uEl) uEl.innerText = `Usuário: ${user.email || user.uid.slice(0, 6)}`;
  }
});

window.logout = () => auth.signOut().then(() => (window.location.href = "/login.html"));

// --- Status de conexão ---
function atualizarSync() {
  const el = document.getElementById("ultimaSync");
  if (el) el.innerText = "Última sync: " + new Date().toLocaleTimeString();
}
firebase.database().ref(".info/connected").on("value", (snap) => {
  const el = document.getElementById("statusConexao");
  if (!el) return;
  el.innerHTML = snap.val()
    ? 'Status: <span class="status-online">Conectado</span>'
    : 'Status: <span class="status-offline">Offline</span>';
});

// --- Tipo de Chamado ---
let tipo = "normal";
window.tipoChamado = (t) => {
  tipo = t;
  alert(`Tipo de Chamado: ${t.toUpperCase()}`);
};

// --- Extras ---
let prioridadesSelecionadas = [];
let sinaisSelecionados = [];
let finalidadeSelecionada = "";

window.adicionarDestino = () => {
  const novo = prompt("Digite novo destino:");
  if (!novo) return;
  const sel = document.getElementById("destino");
  const opt = document.createElement("option");
  opt.value = novo; opt.textContent = novo;
  sel.appendChild(opt);
  sel.value = novo;
  alert("Destino adicionado!");
};
window.adicionarPrioridade = () => {
  const p = document.getElementById("prioridade").value;
  if (!p) return alert("Selecione uma prioridade");
  if (!prioridadesSelecionadas.includes(p)) {
    prioridadesSelecionadas.push(p);
    alert("Prioridade adicionada!");
  }
};
window.adicionarSinal = () => {
  const s = document.getElementById("sinais").value;
  if (!s) return alert("Selecione um sinal/sintoma");
  if (!sinaisSelecionados.includes(s)) {
    sinaisSelecionados.push(s);
    alert("Sinal/Sintoma adicionado!");
  }
};
window.adicionarFinalidade = () => {
  const f = document.getElementById("finalidade").value;
  if (!f) return alert("Selecione a finalidade");
  finalidadeSelecionada = f;
  alert("Finalidade adicionada!");
};

// --- Adicionar chamado ---
window.adicionarChamado = () => {
  if (!auth.currentUser) return alert("Usuário não autenticado");

  const paciente = document.getElementById("paciente").value.trim();
  const data = document.getElementById("data").value;
  if (!paciente || !data) return alert("Preencha paciente e data!");

  const horario = document.getElementById("horario").value || new Date().toLocaleTimeString();
  const endereco = document.getElementById("endereco").value || "";
  const numero = document.getElementById("numero").value || "";
  const destino = document.getElementById("destino").value || "";
  const motorista = document.getElementById("motorista").value || "";
  const obito = document.getElementById("obito").value || "Não";
  const obs = document.getElementById("obs").value || "";

  const prioridadeSingle = document.getElementById("prioridade").value || "";

  const chamado = {
    data, horario, paciente, endereco, numero, destino, motorista,
    prioridade: prioridadeSingle, prioridades: prioridadesSelecionadas,
    sinais: sinaisSelecionados, finalidade: finalidadeSelecionada,
    obito, obs, tipo,
    createdBy: auth.currentUser.uid,
    createdAt: new Date().toISOString(),
  };

  db.ref("chamados").push(chamado).then(() => {
    alert("Chamado adicionado!");
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
  }).catch((e) => alert("Erro ao adicionar: " + e.message));
};

// --- Replicar / Excluir ---
window.replicarChamado = () => {
  const check = document.querySelector('input[type="checkbox"]:checked');
  if (!check) return alert("Selecione um chamado!");
  const id = check.dataset.id;
  db.ref("chamados/" + id).once("value").then((snap) => {
    const data = snap.val();
    return db.ref("chamados").push({ ...data, replicado: true, createdAt: new Date().toISOString() });
  }).then(() => alert("Chamado replicado")).catch((e) => alert("Erro ao replicar: " + e.message));
};
window.excluirSelecionados = () => {
  const list = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
  if (!list.length) return alert("Selecione ao menos um chamado!");
  Promise.all(list.map((c) => db.ref("chamados/" + c.dataset.id).remove()))
    .then(() => atualizarSync())
    .catch((e) => alert("Erro ao excluir: " + e.message));
};

// --- Render chamados ---
function renderChamados() {
  const corpo = document.getElementById("corpoTabela");
  if (!corpo) return;
  db.ref("chamados").on("value", (snap) => {
    corpo.innerHTML = "";
    snap.forEach((item) => {
      const ch = item.val();
      const id = item.key;
      const tr = document.createElement("tr");

      if (ch.tipo === "urgencia") tr.style.background = "#fffae6";
      if (ch.tipo === "emergencia") tr.style.background = "#ffe5e5";
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
window.enviarMsg = () => {
  const inp = document.getElementById("chatMsg");
  if (!inp) return;
  const txt = inp.value;
  if (!txt.trim()) return;
  if (!auth.currentUser) return alert("Usuário não autenticado");
  db.ref("chat").push({ msg: txt, uid: auth.currentUser.uid, hora: new Date().toLocaleTimeString() })
    .then(() => { inp.value = ""; atualizarSync(); });
};
window.editarMsg = (id, atual) => {
  const novo = prompt("Editar:", atual);
  if (!novo) return;
  db.ref("chat/" + id).update({ msg: novo });
};
window.delMsg = (id) => db.ref("chat/" + id).remove();

function renderChat() {
  const area = document.getElementById
