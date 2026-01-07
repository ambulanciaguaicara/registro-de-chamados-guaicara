import { watchChat, sendMessage, watchAuth } from "../firebase.js";
import { formatTime } from "../utils/formatters.js";
import { notifyError } from "../utils/notifications.js";

let currentUser = null;

export function mountChat(el) {
  el.innerHTML = `
    <div class="chat-container">
      <h3>💬 Chat da Equipe</h3>
      <div class="chat-messages" id="chatMessages"></div>
      <form class="chat-form" id="chatForm">
        <input type="text" id="chatInput" placeholder="Digite uma mensagem..." required>
        <button type="submit" class="btn-add">Enviar</button>
      </form>
    </div>
  `;

  const messagesDiv = el.querySelector("#chatMessages");
  const form = el.querySelector("#chatForm");
  const input = el.querySelector("#chatInput");

  // Watch auth state
  watchAuth((user) => {
    currentUser = user;
  });

  // Send message
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const userName = currentUser?.email || "Anônimo";

    try {
      await sendMessage({ text, user: userName });
      input.value = "";
    } catch (error) {
      console.error(error);
      notifyError("Erro ao enviar mensagem: " + error.message);
    }
  });

  // Watch messages
  watchChat((snapshot) => {
    if (snapshot.empty) {
      messagesDiv.innerHTML = '<p style="text-align: center; color: #90A4AE; padding: 20px;">Nenhuma mensagem ainda</p>';
      return;
    }

    messagesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const msgDiv = document.createElement("div");
      
      const isOwn = data.user === currentUser?.email;
      msgDiv.className = isOwn ? "msg msg-own" : "msg msg-other";

      const timestamp = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
      
      msgDiv.innerHTML = `
        <div class="msg-header">
          <strong>${data.user}</strong>
          <span class="msg-time">${formatTime(timestamp)}</span>
        </div>
        <div class="msg-text">${escapeHtml(data.text)}</div>
      `;

      messagesDiv.appendChild(msgDiv);
    });

    // Auto scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
