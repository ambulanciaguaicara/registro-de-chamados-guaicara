import { db, collection, query, where, getDocs, updateDoc, doc } from "../firebase.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

export function mountAdminPanel(el) {
  el.innerHTML = `
    <section class="admin-section">
      <h2>👤 Aprovação de Novos Usuários</h2>
      <div id="pendingUsersContainer">Carregando usuários pendentes...</div>
      <hr />
      <h3>Adicionar Novo Usuário</h3>
      <form id="formNovoUsuario" class="admin-new-user-form">
        <label>Nome: <input type="text" id="novoNome" required /></label>
        <label>Status: <input type="text" id="novoStatus" value="aprovado" required /></label>
        <label>Telefone: <input type="text" id="novoTelefone" required /></label>
        <label>UID: <input type="text" id="novoUid" required /></label>
        <label>Unidade: <input type="text" id="novoUnidade" required /></label>
        <button type="submit" class="btn-add">Adicionar Usuário</button>
      </form>
    </section>
  `;
  loadPendingUsers();
  setupNovoUsuarioForm();
// Função para adicionar novo usuário manualmente
function setupNovoUsuarioForm() {
  const form = document.getElementById("formNovoUsuario");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("novoNome").value;
    const status = document.getElementById("novoStatus").value;
    const telefone = document.getElementById("novoTelefone").value;
    const uid = document.getElementById("novoUid").value;
    const unidade = document.getElementById("novoUnidade").value;
    try {
      await import("../firebase.js").then(async ({ db, setDoc, doc }) => {
        await setDoc(doc(db, "usuarios", uid), {
          nome,
          status,
          telefone,
          uid,
          unidade,
          funcao: "atendente", // padrão, pode ser ajustado
          email: "",
          createdAt: new Date().toISOString()
        });
      });
      notifySuccess("Usuário adicionado e aprovado!");
      form.reset();
      loadPendingUsers();
    } catch (err) {
      notifyError("Erro ao adicionar usuário: " + err.message);
    }
  });
}
}

async function loadPendingUsers() {
  const container = document.getElementById("pendingUsersContainer");
  try {
    const usersRef = collection(db, "usuarios");
    const q = query(usersRef, where("status", "==", "pendente"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      container.innerHTML = "Nenhum usuário pendente.";
      return;
    }
    let html = '<ul class="pending-users-list">';
    snapshot.forEach(docSnap => {
      const user = docSnap.data();
      html += `<li>${user.nome} (${user.email}) - <button class="btn-approve-user" data-id="${docSnap.id}">Aprovar</button></li>`;
    });
    html += "</ul>";
    container.innerHTML = html;
    document.querySelectorAll(".btn-approve-user").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const userId = btn.getAttribute("data-id");
        try {
          await updateDoc(doc(db, "usuarios", userId), { status: "aprovado" });
          notifySuccess("Usuário aprovado!");
          loadPendingUsers();
        } catch (err) {
          notifyError("Erro ao aprovar usuário: " + err.message);
        }
      });
    });
  } catch (err) {
    container.innerHTML = "Erro ao carregar usuários.";
  }
}
