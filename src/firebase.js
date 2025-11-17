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

// 🔹 Login
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// 🔹 Criar conta (somente admin)
export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// 🔹 Salvar chamado
export function salvarChamado(data) {
  if (!auth.currentUser) {
    throw new Error("Usuário não autenticado.");
  }
  const chamadoRef = ref(db, "chamados");
  return push(chamadoRef, {
    ...data,
    createdBy: auth.currentUser.uid,
    createdAt: new Date().toISOString()
  });
}

// 🔹 Ouvir chamados em tempo real
export function ouvirChamados(callback) {
  const chamadosRef = ref(db, "chamados");
  onValue(chamadosRef, snapshot => {
    callback(snapshot.val() || {});
  });
}

// 🔹 Editar chamado (somente criador)
export async function editarChamado(id, updates) {
  if (!auth.currentUser) {
    throw new Error("Usuário não autenticado.");
  }
  const chamadoRef = ref(db, `chamados/${id}`);
  return update(chamadoRef, updates);
}

// 🔹 Deletar chamado (somente criador)
export function deletarChamado(id) {
  if (!auth.currentUser) {
    throw new Error("Usuário não autenticado.");
  }
  const chamadoRef = ref(db, `chamados/${id}`);
  return remove(chamadoRef);
}
