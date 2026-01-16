// Funções para aprovação de usuários
import { db, collection, query, where, getDocs, updateDoc, doc } from "../firebase.js";

export async function getPendingUsers() {
  const q = query(collection(db, "usuarios"), where("status", "==", "pendente"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function approveUser(userId) {
  await updateDoc(doc(db, "usuarios", userId), { status: "aprovado" });
}
