const admin = require('firebase-admin');
const { getApps, initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    try {
        const path = require('path');
        serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
    } catch (e) {
        console.error('❌ No se encontró serviceAccountKey.json ni FIREBASE_SERVICE_ACCOUNT');
        process.exit(1);
    }
}

// Usar la API modular que es más estable
if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

const connectDB = () => {
    try {
        console.log('✔ Servidor vinculado exitosamente a Firebase');
    } catch (error) {
        console.error('❌ Error crítico de conexión a Firebase:', error.message);
        process.exit(1);
    }
};

module.exports = { db, connectDB };