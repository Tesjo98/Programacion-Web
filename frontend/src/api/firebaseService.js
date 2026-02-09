import { db } from "./firebaseConfig";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";

// Nombre de la colección en Firestore que ya creaste
const COLLECTION_NAME = "evaluaciones_docentes";

/**
 * Guarda o actualiza la evaluación de una carrera específica
 * @param {Object} data - Objeto con programaAcademico, calificacion, totalDocentes y periodo
 */
export const saveEvaluacion = async (data) => {
  try {
    // Primero buscamos si ya existe un registro para esa carrera y periodo
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("programaAcademico", "==", data.programaAcademico),
      where("periodo", "==", data.periodo)
    );
    
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si existe, lo actualizamos
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(db, COLLECTION_NAME, docId);
      await updateDoc(docRef, {
        calificacion: Number(data.calificacion),
        totalDocentes: Number(data.totalDocentes),
        fechaActualizacion: serverTimestamp()
      });
      console.log("Registro actualizado con éxito");
    } else {
      // Si no existe, creamos uno nuevo
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
 * Obtiene todos los registros de un periodo específico para llenar la tabla
 */
export const fetchEvaluaciones = async (periodo) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("periodo", "==", periodo));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return [];
  }
};