import { watchChat, sendMessage, auth } from "../firebase.js";
import { notifyError } from "../utils/notifications.js";
import { formatTime } from "../utils/formatters.js";

export function mountChat(el) {
  el.innerHTML = `
    <div class="chat-container">
      <h3>💬 Chat da Equipe</h3>
      <div class="chat-messages" id="chatMessages">
        <div class="loading"></div>
      </div>
      <form class="chat-form" id="chatForm">
        <input type="text" id="chatInput" placeholder="Digite sua mensagem..." required>
        <button type="submit" class="btn-add" style="padding: 10px 16px;">Enviar</button>
      </form>
    </div>
  `;

  const messagesDiv = el.querySelector("#chatMessages");
  const form = el.querySelector("#chatForm");
  const input = el.querySelector("#chatInput");

  // Watch chat messages
  watchChat((snapshot) => {
    messagesDiv.innerHTML = "";
    
    if (snapshot.empty) {
      messagesDiv.innerHTML = `
        <p style="text-align: center; color: #90A4AE; font-size: 13px; padding: 20px;">
          Nenhuma mensagem ainda. Seja o primeiro a enviar!
        </p>
      `;
      return;
    }

    snapshot.forEach((doc) => {
      const message = doc.data();
      const msgDiv = document.createElement("div");
      
      const currentUser = auth.currentUser;
      const isOwnMessage = currentUser && message.user === currentUser.email;
      
      msgDiv.className = isOwnMessage ? "msg msg-own" : "msg msg-other";
      
      let timestamp = '—';
      if (message.createdAt && message.createdAt.toDate) {
        timestamp = formatTime(message.createdAt.toDate());
      }

      msgDiv.innerHTML = `
        <div class="msg-header">
          <strong>${message.user || 'Anônimo'}</strong>
          <span class="msg-time">${timestamp}</span>
        </div>
        <div class="msg-text">${message.text}</div>
      `;

      messagesDiv.appendChild(msgDiv);
    });

    // Auto scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  // Send message
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const text = input.value.trim();
    if (!text) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      notifyError("Você precisa estar autenticado para enviar mensagens");
      return;
    }

    try {
      await sendMessage({
        text: text,
        user: currentUser.email
      });
      
      input.value = "";
      input.focus();
    } catch (error) {
      console.error(error);
      notifyError("Erro ao enviar mensagem: " + error.message);
    }
  });
}
