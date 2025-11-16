import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

import { 
  getDatabase, 
  ref, 
  push, 
  onValue, 
  update, 
  remove 
} from "firebase/database";

// Configuração usando variáveis do Vercel (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Login
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Criar novo usuário
export function register(email, password) {
  return createUserWithEmailAndPassword(auth, password);
}

// Salvar chamado
export function salvarChamado(data) {
  return push(ref(db, "chamados"), {
    ...data,
    createdBy: auth.currentUser.uid,
    createdAt: new Date().toISOString()
  });
}

// Ouvir chamados em tempo real
export function ouvirChamados(callback) {
  onValue(ref(db, "chamados"), (snapshot) => {
    callback(snapshot.val());
  });
}

// Editar chamado
export function editarChamado(id, updates) {
  return update(ref(db, `chamados/${id}`), updates);
}

// Excluir chamado
export function deletarChamado(id) {
  return remove(ref(db, `chamados/${id}`));
}
