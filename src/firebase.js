import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, push, onValue, update, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SUA_AUTH_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SUA_PROJECT_ID",
  storageBucket: "SUA_STORAGE_BUCKET",
  messagingSenderId: "SUA_MESSAGING_SENDER_ID",
  appId: "SUA_APP_ID",
  measurementId: "SUA_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Funções exportadas para uso no main.js
export function login(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

export function register(email, senha) {
  return createUserWithEmailAndPassword(auth, senha);
}

export function logout() {
  return signOut(auth);
}
