import { initializeApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, setDoc,
  onSnapshot, serverTimestamp, query, orderBy
} from "firebase/firestore";

// Firebase configuration using environment variables
// Note: Firebase config keys are safe to expose in client-side code
// Security is managed through Firebase Security Rules, not config secrecy
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
  return addDoc(callsCol, { 
    ...data, 
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
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
  return setDoc(driverRef, {
    nome: driverName,
    status: status,
    updatedAt: serverTimestamp()
  }, { merge: true });
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
  return setDriverStatus(driverName, `Em atendimento - ${patientName}`);
}
