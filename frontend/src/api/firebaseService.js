import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";

// 1. CONFIGURACIÓN (Variables de entorno)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// 2. INICIALIZACIÓN (Evita el error de '[DEFAULT] already exists')
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// 3. PROVEEDORES
const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

microsoftProvider.setCustomParameters({
  prompt: 'select_account',
  tenant: 'common'
});

const COLLECTION_NAME = "evaluaciones_docentes";

// --- TUS FUNCIONES ORIGINALES CORREGIDAS ---

export const saveEvaluacion = async (data) => {
  try {
    // 1. LÓGICA PARA TABLAS DINÁMICAS
    if (data.id && typeof data.id === 'string' && data.id.includes('-')) {
      const docRef = doc(db, COLLECTION_NAME, data.id);
      await setDoc(docRef, {
        ...data,
        fechaActualizacion: serverTimestamp()
      }, { merge: true });

      console.log("Tabla dinámica guardada con éxito");
      return { success: true, id: data.id };
    }

    // 2. LÓGICA PARA EVALUACIÓN DOCENTE
    const q = query(
      collection(db, COLLECTION_NAME),
      where("programaAcademico", "==", data.programaAcademico),
      where("periodo", "==", data.periodo)
    );

    const querySnapshot = await getDocs(q);
    const payload = {
      ...data,
      calificacion: Number(data.calificacion || 0),
      totalDocentes: Number(data.totalDocentes || 0),
      fechaActualizacion: serverTimestamp()
    };

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(db, COLLECTION_NAME, docId);
      await updateDoc(docRef, payload);
      console.log("Registro actualizado con éxito");
      return { success: true, id: docId };
    } else {
      const newDoc = await addDoc(collection(db, COLLECTION_NAME), payload);
      console.log("Nuevo registro creado con éxito");
      return { success: true, id: newDoc.id };
    }
  } catch (error) {
    console.error("Error al conectar con Firebase:", error);
    throw error;
  }
};

export const fetchEvaluaciones = async (periodoOrId) => {
  try {
    if (!periodoOrId) return [];

    // Intentar como ID de Documento
    const docRef = doc(db, COLLECTION_NAME, periodoOrId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }

    // Intentar como búsqueda por campo periodo
    const q = query(collection(db, COLLECTION_NAME), where("periodo", "==", periodoOrId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  } catch (error) {
    console.error("Error al obtener datos:", error);
    return [];
  }
};

export const loginWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    return result.user;
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.warn("Popup cerrado por el usuario");
      return null;
    }
    console.error("Error en login:", error);
    throw error;
  }
};

// Exportación adicional para el extractor de Gemini
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') return null;
    throw error;
  }
};