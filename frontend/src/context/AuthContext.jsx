import React, { createContext, useContext, useState, useEffect } from 'react';
// Importaciones necesarias de Firebase SDK
import { auth, db } from '../api/firebaseConfig'; // Verifica que esta ruta sea correcta en tu PC
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Cambiamos isAuthenticated por user para que coincida con lo que espera App.js
    const [user, setUser] = useState(null);
    // Cambiamos isLoading por loading (o mantenemos ambos, pero App.js busca 'loading')
    const [loading, setLoading] = useState(true);

    // --- OBSERVADOR DE ESTADO DE AUTENTICACIÓN ---
    // Este efecto es el que evita el bucle de redirección
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // Detiene el estado de carga una vez que Firebase responde
        });
        return () => unsubscribe();
    }, []);

    // Función de REGISTRO REAL con FIREBASE
    const register = async (userData) => {
        setLoading(true);
        try {
            // 1. Crear el usuario en Firebase Authentication (Email y Password)
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            const userFirebase = userCredential.user;

            // 2. Guardar los datos adicionales en Firestore (Nombre, Área, Subárea, Teléfono)
            await setDoc(doc(db, "users", userFirebase.uid), {
                uid: userFirebase.uid,
                name: userData.name,
                email: userData.email,
                username: userData.username,
                phone: userData.phone,
                area: userData.area,
                subarea: userData.subarea,
                role: 'docente',
                createdAt: new Date()
            });

            console.log("Registro exitoso en Firebase y Firestore.");
            return userFirebase;

        } catch (error) {
            let errorMessage = "Fallo en el registro con Firebase.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Este correo ya está registrado en el sistema.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "El formato del correo institucional es inválido.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "La contraseña es muy débil para Firebase.";
            }
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        // La lógica de signIn se maneja en tu LoginForm, 
        // onAuthStateChanged detectará el cambio automáticamente aquí.
    };

    const value = {
        user,        // Exportamos el usuario real
        loading,     // Exportamos el estado de carga que App.js necesita
        register,
        login,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};