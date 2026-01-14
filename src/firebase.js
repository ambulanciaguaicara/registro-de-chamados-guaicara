import { initializeApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, setDoc,
  onSnapshot, serverTimestamp, query, orderBy
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ========== AUTENTICAÇÃO ==========
export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}

// ========== COLLECTIONS ==========
export const callsCol = collection(db, "chamados");
export const chatCol = collection(db, "chat");
export const driversCol = collection(db, "motoristas");

// ========== CHAMADOS ==========
export async function createCall(data) {
  const docRef = await addDoc(callsCol, { 
    ...data, 
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  // Salvar também no prontuário do paciente
  if (data.paciente) {
    const prontuarioCol = collection(db, "prontuarios", data.paciente, "chamados");
    await addDoc(prontuarioCol, {
      ...data,
      chamadoId: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  return docRef;
}

export async function updateCall(id, data) {
  return updateDoc(doc(db, "chamados", id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function deleteCall(id) {
  return deleteDoc(doc(db, "chamados", id));
}

export function watchCalls(callback) {
  const q = query(callsCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, callback);
}

// ========== CHAT ==========
export async function sendMessage({ text, user }) {
  return addDoc(chatCol, { 
    text, 
    user, 
    createdAt: serverTimestamp() 
  });
}

export function watchChat(callback) {
  const q = query(chatCol, orderBy("createdAt", "asc"));
  return onSnapshot(q, callback);
}

// ========== MOTORISTAS ==========
export async function setDriverStatus(driverName, status) {
  const driverRef = doc(db, "motoristas", driverName);
  // Salvar histórico
  await addDoc(collection(driverRef, "historico"), {
    status,
    timestamp: serverTimestamp()
  });
  return setDoc(driverRef, {
    nome: driverName,
    status: status,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

// Buscar histórico de status do motorista
export function watchDriverHistory(driverName, callback) {
  const driverRef = doc(db, "motoristas", driverName);
  const histCol = collection(driverRef, "historico");
  const q = query(histCol, orderBy("timestamp", "desc"));
  return onSnapshot(q, callback);
}

export async function addDriver(driverName) {
  return setDriverStatus(driverName, "Disponível na unidade");
}

export async function deleteDriver(driverName) {
  return deleteDoc(doc(db, "motoristas", driverName));
}

export function watchDrivers(callback) {
  return onSnapshot(driversCol, callback);
}

export function setDriverOnDuty(driverName, patientName) {
  // Vincula o status do motorista ao chamado
  return setDriverStatus(driverName, `Em atendimento - ${patientName}`);
}
}

// Buscar chamados/prontuário de um paciente
export function watchProntuario(paciente, callback) {
  const prontuarioCol = collection(db, "prontuarios", paciente, "chamados");
  const q = query(prontuarioCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, callback);
}
