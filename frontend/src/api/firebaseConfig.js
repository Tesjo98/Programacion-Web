import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Datos obtenidos de tu consola de Firebase PSICEI-TESJo
const firebaseConfig = {
  apiKey: "AIzaSyDLvXLcr4M0_saPWyr59DpwUt0gTo42RYY",
  authDomain: "psicei-tesjo-b3b67.firebaseapp.com",
  projectId: "psicei-tesjo-b3b67",
  storageBucket: "psicei-tesjo-b3b67.firebasestorage.app",
  messagingSenderId: "287421376630",
  appId: "1:287421376630:web:6fe48f98db28d16d769757",
  measurementId: "G-99TEY1RTYZ"
};

// Inicializamos la App de Firebase para el Navegador
const app = initializeApp(firebaseConfig);

// Exportamos los servicios para usarlos en AuthContext.jsx
export const auth = getAuth(app);
export const db = getFirestore(app);