import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { 
  getDatabase, 
  ref, 
  push, 
  onValue, 
  update, 
  remove 
} from "firebase/database";

// Configuração do Firebase
// NOTA: Estas credenciais são seguras para exposição em código client-side.
// Firebase usa regras de segurança do Firestore/Database para controle de acesso.
// As chaves de API aqui servem apenas para identificar o projeto Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyCoSPb1WMrH2MMuM1AdR2YEAX60XVgO3WE",
  authDomain: "registro-ambulancia192.firebaseapp.com",
  databaseURL: "https://registro-ambulancia192-default-rtdb.firebaseio.com",
  projectId: "registro-ambulancia192",
  storageBucket: "registro-ambulancia192.appspot.com",
  messagingSenderId: "549498386461",
  appId: "1:549498386461:web:94d6ac364a54a7d4216ef4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Exportar funções do Firestore
export { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
};

// Funções de autenticação
export function login(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

export function register(email, senha) {
  return createUserWithEmailAndPassword(auth, email, senha);
}

export function logout() {
  return signOut(auth);
}

// Observar estado de autenticação
export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// Funções para chamados
export async function createCall(data) {
  return await addDoc(collection(db, "chamados"), {
    ...data,
    createdAt: new Date().toISOString()
  });
}

export function watchCalls(callback) {
  const q = query(collection(db, "chamados"), orderBy("createdAt", "desc"));
  return onSnapshot(q, callback);
}

export async function updateCall(id, data) {
  return await updateDoc(doc(db, "chamados", id), data);
}

export async function deleteCall(id) {
  return await deleteDoc(doc(db, "chamados", id));
}

// Funções para motoristas
export function watchDrivers(callback) {
  const q = query(collection(db, "motoristas"));
  return onSnapshot(q, callback);
}

export async function deleteDriver(id) {
  return await deleteDoc(doc(db, "motoristas", id));
}

export async function setDriverOnDuty(driverName, patientName) {
  const driversRef = collection(db, "motoristas");
  const q = query(driversRef, where("nome", "==", driverName));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    const driverDoc = snapshot.docs[0];
    await updateDoc(doc(db, "motoristas", driverDoc.id), {
      status: "Em atendimento",
      pacienteAtual: patientName,
      updatedAt: new Date().toISOString()
    });
  }
}

export async function addDriver(nome) {
  return await addDoc(collection(db, "motoristas"), {
    nome,
    status: "Disponível na unidade",
    createdAt: new Date().toISOString()
  });
}

export async function updateDriverStatus(id, status) {
  return await updateDoc(doc(db, "motoristas", id), {
    status,
    updatedAt: new Date().toISOString()
  });
}

// Funções para mensagens de chat
export function watchMessages(callback) {
  const q = query(collection(db, "mensagens"), orderBy("createdAt", "asc"));
  return onSnapshot(q, callback);
}

export async function sendMessage(message, userName) {
  return await addDoc(collection(db, "mensagens"), {
    message,
    userName,
    createdAt: new Date().toISOString()
  });
}
