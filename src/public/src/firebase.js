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


// Configuração usando variáveis do Vercel
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Login
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Criar conta (botão "Criar novo usuário")
export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// 🔥 SALVAR CHAMADO (grava quem criou)
export function salvarChamado(data) {
  const chamadoRef = ref(db, "chamados");
  return push(chamadoRef, {
    ...data,
    createdBy: auth.currentUser.uid,
    createdAt: new Date().toISOString()
  });
}

// 🔥 OUVIR CHAMADOS EM TEMPO REAL
export function ouvirChamados(callback) {
  const chamadosRef = ref(db, "chamados");
  onValue(chamadosRef, (snapshot) => {
    callback(snapshot.val());
  });
}

// 🔥 EDITAR SOMENTE SE FOI O CRIADOR
export async function editarChamado(id, updates) {
  const chamadoRef = ref(db, `chamados/${id}`);
  return update(chamadoRef, updates);
}

// 🔥 EXCLUIR (somente criador)
export function deletarChamado(id) {
  const chamadoRef = ref(db, `chamados/${id}`);
  return remove(chamadoRef);
}
