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
  remove,
  set
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

// ========== Autenticação ==========
export function login(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

export function register(email, senha) {
  return createUserWithEmailAndPassword(auth, email, senha);
}

export function logout() {
  return signOut(auth);
}

// ========== Chamados ==========
export function createCall(data) {
  const callsRef = ref(db, 'chamados');
  return push(callsRef, {
    ...data,
    timestamp: Date.now(),
    createdAt: new Date().toISOString()
  });
}

export function updateCall(callId, data) {
  const callRef = ref(db, `chamados/${callId}`);
  return update(callRef, data);
}

export function deleteCall(callId) {
  const callRef = ref(db, `chamados/${callId}`);
  return remove(callRef);
}

export function onCallsChange(callback) {
  const callsRef = ref(db, 'chamados');
  return onValue(callsRef, (snapshot) => {
    const data = snapshot.val();
    const calls = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
    callback(calls);
  });
}

// ========== Motoristas ==========
export function setDriverStatus(driverName, status) {
  const driverRef = ref(db, `motoristas/${driverName}`);
  return set(driverRef, {
    nome: driverName,
    status: status,
    updatedAt: new Date().toISOString()
  });
}

export function onDriversChange(callback) {
  const driversRef = ref(db, 'motoristas');
  return onValue(driversRef, (snapshot) => {
    const data = snapshot.val();
    const drivers = data ? Object.values(data) : [];
    callback(drivers);
  });
}
