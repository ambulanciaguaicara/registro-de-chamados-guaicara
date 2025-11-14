import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";
import firebaseConfig from "./firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.body.innerHTML = `
<div style="max-width:480px;margin:auto;padding:20px">
  <h2 style="text-align:center">Sistema Ambulância Guaiçara 🚑</h2>

  <input id="email" placeholder="E-mail" style="width:100%;padding:10px;margin:5px 0">
  <input id="senha" type="password" placeholder="Senha" style="width:100%;padding:10px;margin:5px 0">

  <button id="login" style="width:100%;padding:10px;background:#034ea2;color:white;margin-top:10px;border:none;border-radius:6px">Entrar</button>
  <button id="register" style="width:100%;padding:10px;background:#e63946;color:white;margin-top:10px;border:none;border-radius:6px">Criar Novo Login</button>

  <div id="status"></div>
  <ul id="lista"></ul>
</div>
`;

login.onclick = async () => {
  await signInWithEmailAndPassword(auth, email.value, senha.value);
};

register.onclick = async () => {
  await createUserWithEmailAndPassword(auth, email.value, senha.value);
};

onAuthStateChanged(auth, user => {
  if (!user) return;
  document.body.innerHTML = `
  <h2>Chamados</h2>
  <button id="add">Adicionar Chamado</button>
  <ul id="lista"></ul>
  `;
  
  const ref = collection(db, "chamados");
  
  onSnapshot(ref, snapshot => {
    lista.innerHTML = "";
    snapshot.forEach(doc => {
      lista.innerHTML += `<li>${doc.data().nome} — ${doc.data().prioridade}</li>`;
    });
  });

  add.onclick = async () => {
    await addDoc(ref, {
      nome: "Não identificado",
      prioridade: "Normal",
      user: user.uid,
      timestamp: Date.now()
    });
  };
});
