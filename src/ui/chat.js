import { watchMessages, sendMessage } from "../firebase.js";
import { notifyError } from "../utils/notifications.js";

export function mountChat(el) {
  el.innerHTML = `
    <section class="chat-section">
      <h3>💬 Chat Interno</h3>
      
      <div id="chatArea" class="chat-area"></div>
      
      <div class="chat-input">
        <input type="text" id="chatMsg" placeholder="Digite sua mensagem..." />
        <button id="btnSendMsg" class="btn-add">Enviar</button>
      </div>
    </section>
  `;

  setupChatEvents(el);
  
  // Escutar mensagens em tempo real
  watchMessages((snapshot) => {
    const chatArea = document.querySelector("#chatArea");
    if (!chatArea) return;
    
    chatArea.innerHTML = "";
    
    snapshot.forEach(doc => {
      const msg = doc.data();
      const p = document.createElement("p");
      p.className = "chat-message";
      p.innerHTML = `<strong>${msg.userName}:</strong> ${msg.message}`;
      chatArea.appendChild(p);
    });
    
    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
  });
}

function setupChatEvents(root) {
  const sendBtn = root.querySelector("#btnSendMsg");
  const msgInput = root.querySelector("#chatMsg");
  
  const enviarMensagem = async () => {
    const msg = msgInput.value.trim();
    if (!msg) return;
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userName = currentUser.nome || "Anônimo";
    
    try {
      await sendMessage(msg, userName);
      msgInput.value = "";
    } catch (error) {
      notifyError(error.message);
    }
  };
  
  sendBtn.addEventListener("click", enviarMensagem);
  
  msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      enviarMensagem();
    }
  });
}
