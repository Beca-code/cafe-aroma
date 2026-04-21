/* ==========================================
   FIREBASE.JS - Configuración de Firebase
   Este archivo contiene la inicialización de Firebase
   con autenticación y Firestore
   ========================================== */

// 🔧 PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE
// Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);

// Obtener referencias de Firebase Auth y Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Configurar persistencia de sesión
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(error => {
    console.error("Error configurando persistencia:", error);
});

// Información de módulos Firebase disponibles
console.log("✅ Firebase inicializado correctamente");
console.log("🔐 Auth disponible:", typeof auth !== 'undefined');
console.log("📊 Firestore disponible:", typeof db !== 'undefined');
