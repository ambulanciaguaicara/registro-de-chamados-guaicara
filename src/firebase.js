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

// Criar conta
export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Salvar chamado
export function salvarChamado(data) {
  if (!auth.currentUser) throw new Error("Usuário não autenticado.");
  return push(ref(db, "chamados"), {
    ...data,
    createdBy: auth.currentUser.uid,
    createdAt: new Date().toISOString()
  });
}

// Ouvir chamados
export function ouvirChamados(callback) {
  onValue(ref(db, "chamados"), snapshot => {
    callback(snapshot.val() || {});
  });
}

// Editar chamado
export function editarChamado(id, updates) {
  if (!auth.currentUser) throw new Error("Usuário não autenticado.");
  return update(ref(db, `chamados/${id}`), updates);
}

// Deletar chamado
export function deletarChamado(id) {
  if (!auth.currentUser) throw new Error("Usuário não autenticado.");
  return remove(ref(db, `chamados/${id}`));
}
