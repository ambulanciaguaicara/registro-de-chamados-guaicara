import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  getDatabase, 
  ref, 
  push, 
  onValue, 
  update, 
  remove 
} from "firebase/database";

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
export const db = getDatabase(app);

// Funções exportadas para uso no main.js
export function login(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

export function register(email, senha) {
  return createUserWithEmailAndPassword(auth, email, senha);
}

export function logout() {
  return signOut(auth);
}
