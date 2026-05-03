/* ==========================================
   USER.JS - Lógica del Panel de Usuario
   Gestiona funcionalidades específicas del panel usuario
   ========================================== */

// ==========================================
// FUNCIÓN: MOSTRAR INFORMACIÓN DE SESIÓN DEL USUARIO
// ==========================================
function displaySessionToken() {
    const sessionToken = localStorage.getItem('sessionToken');
    const tokenElement = document.getElementById('sessionToken');

    if (tokenElement && sessionToken) {
        tokenElement.textContent = sessionToken;
    }
}

// ==========================================
// FUNCIÓN: CONFIGURAR SALUDO PERSONALIZADO
// ==========================================
function setupUserGreeting() {
    const userName = localStorage.getItem('userName');
    const userGreeting = document.getElementById('userGreeting');

    if (userGreeting && userName) {
        userGreeting.textContent = `Hola, ${userName}`;
    }
}

// ==========================================
// CARGAR PREFERENCIAS DE USUARIO
// ==========================================
function loadUserPreferences() {
    const preferences = {
        idioma: localStorage.getItem('userLanguage') || 'es',
        tema: localStorage.getItem('userTheme') || 'claro'
    };
    return preferences;
}
