import { db } from "./firebaseConfig";
import {
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

// Nombre de la colección principal
const COLLECTION_NAME = "evaluaciones_docentes";

/**
 * Guarda o actualiza datos. Soporta tanto registros individuales (Evaluación Docente)
 * como objetos complejos con arreglos (Tablas Dinámicas).
 */
export const saveEvaluacion = async (data) => {
  try {
    // LÓGICA PARA TABLAS DINÁMICAS (Si el objeto tiene un ID específico como 'alumnos-eventos-...')
    if (data.id && typeof data.id === 'string' && data.id.includes('-')) {
      const docRef = doc(db, COLLECTION_NAME, data.id);
      await setDoc(docRef, {
        ...data,
        fechaActualizacion: serverTimestamp()
      }, { merge: true });
      console.log("Tabla dinámica guardada con éxito en Firestore");
      return;
    }

    // LÓGICA ORIGINAL PARA EVALUACIÓN DOCENTE (Registros por programaAcademico)
    const q = query(
      collection(db, COLLECTION_NAME),
      where("programaAcademico", "==", data.programaAcademico),
      where("periodo", "==", data.periodo)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(db, COLLECTION_NAME, docId);
      await updateDoc(docRef, {
        calificacion: Number(data.calificacion),
        totalDocentes: Number(data.totalDocentes),
        fechaActualizacion: serverTimestamp()
      });
      console.log("Registro actualizado con éxito");
    } else {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        calificacion: Number(data.calificacion),
        totalDocentes: Number(data.totalDocentes),
        fechaActualizacion: serverTimestamp()
      });
      console.log("Nuevo registro creado con éxito");
    }
  } catch (error) {
    console.error("Error al conectar con Firebase:", error);
    throw error;
  }
};

/**
 * Obtiene registros. Si el periodo coincide con un ID de documento (Tabla dinámica),
 * devuelve ese documento específico. Si no, busca todos los registros del periodo.
 */
export const fetchEvaluaciones = async (periodo) => {
  try {
    // 1. Intentamos buscar directamente por la referencia del Document ID (Tablas dinámicas)
    // Esto soluciona que no se encuentren los datos si el ID es el nombre del documento
    const docRef = doc(db, COLLECTION_NAME, periodo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Documento de tabla dinámica encontrado");
      return docSnap.data();
    }

    // 2. Si no es un Document ID, buscamos por el campo 'periodo' (Evaluación Docente)
    const q = query(collection(db, COLLECTION_NAME), where("periodo", "==", periodo));
    const querySnapshot = await getDocs(q);

    const resultados = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Se encontraron ${resultados.length} registros para el periodo ${periodo}`);
    return resultados;

  } catch (error) {
    console.error("Error al obtener datos de Firebase:", error);
    return [];
  }
};