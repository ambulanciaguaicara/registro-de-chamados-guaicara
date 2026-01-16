import { db, collection, query, where, getDocs, updateDoc, doc } from "../firebase.js";
import { notifySuccess, notifyError } from "../utils/notifications.js";

export function mountAdminPanel(el) {
  el.innerHTML = `
    <section class="admin-section">
      <h2>👤 Aprovação de Novos Usuários</h2>
      <div id="pendingUsersContainer">Carregando usuários pendentes...</div>
    </section>
  `;
  loadPendingUsers();
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
