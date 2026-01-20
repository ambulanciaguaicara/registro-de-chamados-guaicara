// Script ES module para garantir que o administrador está cadastrado corretamente no Firestore
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase.js";

async function ensureAdmin() {
  const adminData = {
    createdAt: "2026-01-07T19:00:00.000Z",
    email: "ambulanciadeguaicara@gmail.com",
    funcao: "administrador",
    nome: "administrador",
    status: "aprovado",
    telefone: "(14)99685-4224",
    uid: "2Y281T5Kv7bXdl8uiptGxNNqUvW2",
    unidade: "centro"
  };
  try {
    await setDoc(doc(db, "usuarios", adminData.uid), adminData);
    console.log("Administrador atualizado/criado com sucesso!");
  } catch (err) {
    console.error("Erro ao criar/atualizar administrador:", err);
  }
}

ensureAdmin();
