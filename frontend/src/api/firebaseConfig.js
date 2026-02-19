import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, OAuthProvider } from "firebase/auth"; // Combinados en una sola línea

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // O import.meta.env.VITE_FIREBASE_API_KEY
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


// Inicializamos la App de Firebase (Solo una vez)
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// Configuración para Microsoft (Azure AD)
export const microsoftProvider = new OAuthProvider('microsoft.com');

// Forzamos a que pida la cuenta de la escuela específicamente
microsoftProvider.setCustomParameters({
  prompt: 'select_account',
  tenant: 'common' // O el ID de inquilino específico de tu escuela si lo tienes
});