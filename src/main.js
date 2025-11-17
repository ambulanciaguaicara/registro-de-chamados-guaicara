import { auth, db, login, register, logout } from "./firebase.js";
import { ref, push, onValue, update, remove, get } from "firebase/database";

// Proteção de rota: se não estiver logado, manda para login
auth.onAuthStateChanged(user => {
  if (!user) {
    if (window.location.pathname.endsWith("index.html")) {
      window.location.href = "/login.html";
    }
  } else {
    const usuarioEl = document.getElementById("usuarioLogado");
    if (usuarioEl) usuarioEl.innerText = "Usuário: " + (user.email || user.uid);
  }
});

// Função de logout
window.logout = () => {
  logout().then(() => window.location.href = "/login.html");
};

// ---------------------- LOGIN ----------------------
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const status = document.getElementById("statusMsg");
    status.innerText = "";

    if (!email || !senha) {
      status.innerText = "📌 Preencha e-mail e senha.";
      return;
    }

    try {
      await login(email, senha);
      status.innerText = "✅ Login realizado com sucesso. Redirecionando...";
      setTimeout(() => window.location.href = "/index.html", 1000);
    } catch (err) {
      status.innerText = "⚠️ Erro: " + err.message;
    }
  });
}

// Criar cadastro simples
window.criarCadastro = async function () {
  const email = prompt("Digite o email do novo usuário:");
  const senha = prompt("Digite a senha:");
  if (!email || !senha) return alert("Cadastro cancelado.");
  try {
    await register(email, senha);
    alert("Usuário criado com sucesso.");
  } catch (err) {
    alert("Erro: " + err.message);
  }
};

// ---------------------- CHAMADOS ----------------------
let prioridadeAtual = "normal";

window.setPrioridade = tipo => {
  prioridadeAtual = tipo;
  alert("Prioridade: " + tipo.toUpperCase());
};

window.adicionarDestino = () => {
  const novo = prompt("Digite novo destino:");
  if (novo) {
    const sel = document.getElementById("destino");
    const opt = document.createElement("option");
    opt.value = novo;
    opt.innerText = novo;
    sel.appendChild(opt);
    sel.value = novo;
  }
};

window.adicionarChamado = () => {
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;
  const paciente = document.getElementById("paciente").value;
  const endereco = document.getElementById("endereco").value;
  const destino = document.getElementById("destino").value;
  const motorista = document.getElementById("motorista").value;
  const obs = document.getElementById("obs").value;

  if (!paciente || !data) return alert("Preencha paciente e data!");

  push(ref(db, "chamados"), {
    data,
    horario,
    paciente,
    endereco,
    destino,
    motorista,
    prioridade: prioridadeAtual,
    obs,
    createdBy: auth.currentUser.uid
  });

  prioridadeAtual = "normal";
  atualizarSync();
};

onValue(ref(db, "chamados"), snap => {
  const corpo = document.getElementById("corpoTabela");
  if (!corpo) return;
  corpo.innerHTML = "";
  snap.forEach(item => {
    const ch = item.val();
    const id = item.key;
    const tr = document.createElement("tr");

    if (ch.prioridade === "urgencia") tr.style.background = "#ffcc00";
    else if (ch.prioridade === "emergencia") tr.style.background = "#b50000";
    else if (ch.prioridade === "normal") tr.style.background = "#28a745";

    tr.innerHTML = `
      <td><input type="checkbox" data-id="${id}"></td>
      <td>${ch.data || ""}</td>
      <td>${ch.horario || ""}</td>
      <td>${ch.paciente || ""}</td>
      <td>${ch.endereco || ""}</td>
      <td>${ch.destino || ""}</td>
      <td>${ch.motorista || ""}</td>
      <td>${ch.prioridade || ""}</td>
      <td>${ch.obs || ""}</td>
    `;
    corpo.appendChild(tr);
  });
  atualizarSync();
});

window.excluirSelecionados = () => {
  document.querySelectorAll("input[type=checkbox]:checked").forEach(c => {
    remove(ref(db, "chamados/" + c.dataset.id));
  });
  atualizarSync();
};

window.replicarChamadoSelecionado = () => {
  const sel = document.querySelector("input[type=checkbox]:checked");
  if (!sel) return alert("Selecione um chamado para replicar");
  get(ref(db, "chamados/" + sel.dataset.id)).then(snap => {
    const ch = snap.val();
    if (!ch) return;
    ch.prioridade = "normal";
    push(ref(db, "chamados"), { ...ch, createdBy: auth.currentUser.uid, replicated: true });
  });
};

// ---------------------- CHAT ----------------------
window.enviarMsg = () => {
  const txt = document.getElementById("chatMsg").value;
  if (!txt.trim()) return;
  push(ref(db, "chat"), {
    msg: txt,
    uid: auth.currentUser.uid,
    hora: new Date().toLocaleTimeString()
  });
  document.getElementById("chatMsg").value = "";
};

onValue(ref(db, "chat"), snap => {
  const area = document.getElementById("chatArea");
  if (!area) return;
  area.innerHTML = "";
  snap.forEach(item => {
    const m = item.val();
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `
      <b>${m.hora}</b> - ${m.msg}
      <div class="msg-actions">
        ${m.uid === auth.currentUser.uid ? `
          <span onclick="editarMsg('${item.key}','${m.msg}')">Editar</span>
          <span onclick="delMsg('${item.key}')">Excluir</span>
        ` : ""}
      </div>`;
    area.appendChild(div);
  });
  atualizarSync();
});

window.editarMsg = (id, atual) => {
  const novo = prompt("Editar mensagem:", atual);
  if (!novo) return;
  update(ref(db, "chat/" + id), { msg: novo });
};

window.delMsg = id => {
  remove(ref(db, "chat/" + id));
};

// ---------------------- RELATÓRIO ----------------------
window.gerarRelatorioMensal = () => {
  const agora = new Date();
  const mes = agora.getMonth(), ano = agora.getFullYear();
  const cont = { normal: 0, urgencia: 0, emergencia: 0, total: 0 };

  get(ref(db, "chamados")).then(snapshot => {
    snapshot.forEach(item => {
      const ch = item.val();
      const d = new Date(ch.data);
      if (d.getMonth() === mes && d.getFullYear() === ano) {
        cont.total++;
        if (ch.prioridade === "emergencia") cont.emergencia++;
        else if (ch.prioridade === "urgencia") cont.urgencia++;
        else cont.normal++;
      }
    });

    const ctx = document.getElementById("graficoMensal").getContext("2d");
    if (window.chartInstance) window.chartInstance.destroy();
    window.chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Normal", "Urgência", "Emergência"],
        datasets: [{
          label: "Chamados Totais: " + cont.total,
          data: [cont.normal, cont.urgencia, cont.emergencia],
          backgroundColor: ["#28a745", "#ffcc00", "#b50000"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: `Relatório Mensal ${mes + 1}/${ano}` }
        },
        scales: { y: { beginAtZero: true } }
      }
    });
  });
};

// ---------------------- STATUS ----------------------
function atualizarSync() {
  const el = document.getElementById("ultimaSync");
  if (el) el.innerText = "Última sync: " + new Date().toLocaleTimeString();
}

onValue(ref(db, ".info/connected"), snap => {
  const el = document.getElementById("statusConexao");
  if (!el) return;
  el.innerHTML = snap.val()
    ? 'Status: <span class="status-online">Conectado</span>'
    : 'Status: <span
