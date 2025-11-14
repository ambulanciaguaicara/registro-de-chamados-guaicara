import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";

import firebaseConfig from "./firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Carregar tela login
document.getElementById("app").innerHTML = `
  <h2>Login</h2>
  <input id="email" placeholder="E-mail">
  <input id="senha" placeholder="Senha" type="password">
  <button id="login">Entrar</button>
  <button id="register">Criar Conta</button>
`;

document.getElementById("login").onclick = async () => {
  await signInWithEmailAndPassword(auth, email.value, senha.value);
};

document.getElementById("register").onclick = async () => {
  await createUserWithEmailAndPassword(auth, email.value, senha.value);
};

// Se logado → página principal
onAuthStateChanged(auth, user => {
  if (!user) return;

  document.getElementById("app").innerHTML = `
    <h2>Chamados</h2>
    <button id="add">Novo Chamado</button>
    <ul id="list"></ul>
  `;

  const ref = collection(db, "chamados");

  onSnapshot(ref, snapshot => {
    list.innerHTML = "";
    snapshot.forEach(doc => {
      const item = doc.data();
      list.innerHTML += `<li>${item.nome} — ${item.prioridade}</li>`;
    });
  });

  add.onclick = async () => {
    await addDoc(ref, {
      nome: "Paciente",
      prioridade: "Emergência",
      user: user.uid,
      time: Date.now()
    });
  };
});
