const admin = require('firebase-admin');

// 1. Cargamos la Llave desde las variables de entorno o local si existe
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // En producción (Render) parseamos el string JSON
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    // En local, sigue usando tu archivo por comodidad
    try {
        const path = require('path');
        serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
    } catch (e) {
        console.error('❌ No se encontró serviceAccountKey.json ni la variable FIREBASE_SERVICE_ACCOUNT');
        process.exit(1);
    }
}

// 2. Inicializamos Firebase DE INMEDIATO
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

// 3. Exportamos la base de datos
const db = admin.firestore();

const connectDB = () => {
    try {
        console.log('✔ Servidor vinculado exitosamente a Firebase');
    } catch (error) {
        console.error('❌ Error crítico de conexión a Firebase:', error.message);
        process.exit(1);
    }
};

module.exports = { db, connectDB };