// Atualiza ou cria o usuário administrador no Firestore
const { db } = require("../firebase.js");
const { setDoc, doc } = require("firebase/firestore");

async function updateAdmin() {
  const adminData = {
    email: "ambulanciadeguaicara@gmail.com",
    funcao: "administrador",
    nome: "administrador",
    status: "aprovado",
    telefone: "(14)99685-4224",
    uid: "ckU0x07rQzL1XkwZdoCXtTmUhkB3",
    unidade: "centro"
  };
  try {
    await setDoc(doc(db, "usuarios", "GB53R1bO9cA5XPSEVwcb"), adminData);
    console.log("Administrador atualizado/criado com sucesso!");
  } catch (err) {
    console.error("Erro ao criar/atualizar administrador:", err);
  }
}

updateAdmin();
