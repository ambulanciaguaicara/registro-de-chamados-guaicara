import { auth, login } from "./firebase.js";

const btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const status = document.getElementById("statusMsg");
  status.innerText = "";

  if(!email || !senha){
    status.innerText = "Preencha e-mail e senha.";
    return;
  }

  try {
    await login(email, senha);
    window.location.href = "index.html";
  } catch(err) {
    status.innerText = err.message;
  }
});
