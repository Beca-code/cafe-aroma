/* ==========================================
   FIREBASE.JS - Configuración de Firebase
   Este archivo contiene la inicialización de Firebase
   con autenticación y Firestore
   ========================================== */

// 🔧 PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE
// Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCuRHygwfHk6l2UP-DNQZRhVdyM33hkpw8",
    authDomain: "cafe-aroma-b8987.firebaseapp.com",
    projectId: "cafe-aroma-b8987",
    storageBucket: "cafe-aroma-b8987.firebasestorage.app",
    messagingSenderId: "53760085828",
    appId: "1:53760085828:web:6dbc8d2453612f58c19111"
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
