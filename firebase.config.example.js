/* ==========================================
   FIREBASE.CONFIG.EXAMPLE.JS
   
   ARCHIVO DE EJEMPLO - COPIAR Y RENOMBRAR
   
   Este es un archivo de ejemplo con la estructura
   correcta para la configuración de Firebase.
   
   INSTRUCCIONES:
   1. Copia este archivo
   2. Renómbralo a "firebase-config.local.js"
   3. Completa con tus valores de Firebase
   4. NUNCA subas este archivo a GitHub
   5. Usa los valores en firebase.js
   
   ========================================== */

// EJEMPLO DE CONFIGURACIÓN DE FIREBASE
// Reemplaza con los valores de tu proyecto
const firebaseConfigExample = {
    apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "cafearoma-xxxxx.firebaseapp.com",
    projectId: "cafearoma-xxxxx",
    storageBucket: "cafearoma-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefg1234567890"
};

// DONDE OBTENER ESTOS VALORES:
// 1. Ve a Firebase Console: https://console.firebase.google.com/
// 2. Haz clic en tu proyecto
// 3. Ve a Project Settings (ícono de engranaje)
// 4. En la pestaña "General", desplázate hacia abajo
// 5. En "Tus aplicaciones", haz clic en "Configuración" de Web
// 6. Copia el objeto firebaseConfig
// 7. Pega en firebase.js sustituyendo los valores TU_*

// EJEMPLO DE VALORES REALES (FICTICIOS):
const firebaseConfigRealExample = {
    apiKey: "AIzaSyA1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
    authDomain: "cafearoma-prueba.firebaseapp.com",
    projectId: "cafearoma-prueba",
    storageBucket: "cafearoma-prueba.appspot.com",
    messagingSenderId: "987654321098",
    appId: "1:987654321098:web:zyxwvutsrqponoml"
};

// PASOS PARA HABILITAR AUTENTICACIÓN EN FIREBASE:
// 1. En Firebase Console, ve a Authentication
// 2. Haz clic en "Primeros pasos"
// 3. Selecciona "Email/Contraseña"
// 4. Habilítalo

// PASOS PARA CREAR FIRESTORE:
// 1. En Firebase Console, ve a Firestore Database
// 2. Haz clic en "Crear base de datos"
// 3. Selecciona "Modo de prueba" (para desarrollo)
// 4. Selecciona una ubicación
// 5. Crea las colecciones manualmente:
//    - usuarios
//    - bitacora_acceso_correcto
//    - bitacora_acceso_fallido
//    - bitacora_cierre_sesion

// REGLAS DE FIRESTORE PARA DESARROLLO:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
*/

// REGLAS DE FIRESTORE PARA PRODUCCIÓN:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: todos pueden leer, solo admin puede escribir
    match /usuarios/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    
    // Bitácoras: solo admin puede leer/escribir
    match /bitacora_{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
*/

console.log("Este es un archivo de ejemplo. Usa firebase.js para la configuración real.");
