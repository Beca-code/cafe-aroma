/* ==========================================
   AUTH.JS - Lógica de Autenticación
   Maneja login, registro, validaciones y sesiones
   ========================================== */

// Variable global para almacenar inicio de sesión
let sessionStartTime = null;

// Función para obtener la dirección IP del usuario
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error obteniendo IP:', error);
        return 'IP no disponible';
    }
}

// ==========================================
// FUNCIÓN: MANEJO DE LOGIN
// ==========================================
async function handleLogin(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Mostrar spinner de carga
    showLoadingSpinner();

    try {
        // Intentar autenticación con Firebase
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Obtener información del usuario desde Firestore
        const userDoc = await db.collection('usuarios').doc(user.uid).get();
        let userRole = 'usuario'; // Rol por defecto
        let userName = email;

        if (userDoc.exists) {
            userRole = userDoc.data().rol || 'usuario';
            userName = userDoc.data().nombre || email;
        } else {
            // Si no existe documento, crear uno
            const role = email.includes('@admin.cafearoma.com') ? 'admin' : 'usuario';
            await db.collection('usuarios').doc(user.uid).set({
                nombre: email.split('@')[0],
                email: email,
                rol: role,
                fechaRegistro: new Date(),
                uid: user.uid
            });
            userRole = role;
        }

        // Guardar información de sesión
        sessionStartTime = new Date();
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userUID', user.uid);
        localStorage.setItem('sessionStartTime', sessionStartTime.getTime());
        sessionStorage.setItem('sessionToken', user.uid);

        // Registrar acceso exitoso en Firestore
        const clientIP = await getClientIP();
        await db.collection('bitacora_acceso_correcto').add({
            fecha_hora: new Date(),
            usuario: email,
            rol: userRole,
            id_sesion: user.uid,
            ip: clientIP
        });

        // Mostrar mensaje de éxito temporal
        hideLoadingSpinner();
        
        // Redirigir según rol
        if (userRole === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'user.html';
        }

    } catch (error) {
        hideLoadingSpinner();

        // Manejar diferentes tipos de error
        let errorMessage = '⚠️ Error desconocido. Intenta de nuevo.';
        let motivo = 'error desconocido';

        if (error.code === 'auth/user-not-found') {
            errorMessage = '❌ El usuario no existe. Verifica tu email o regístrate.';
            motivo = 'usuario no existe';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = '❌ Contraseña incorrecta. Intenta de nuevo.';
            motivo = 'contraseña incorrecta';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = '❌ Email inválido. Verifica el formato.';
            motivo = 'email inválido';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = '⚠️ Demasiados intentos fallidos. Intenta más tarde.';
            motivo = 'demasiados intentos';
        }

        // Registrar intento fallido en Firestore
        const clientIP = await getClientIP();
        try {
            await db.collection('bitacora_acceso_fallido').add({
                fecha_hora: new Date(),
                email_intentado: document.getElementById('email').value,
                motivo: motivo,
                ip: clientIP
            });
        } catch (firestoreError) {
            console.error('Error registrando intento fallido:', firestoreError);
        }

        // Mostrar tarjeta de error con animación
        showErrorCard(errorMessage);
    }
}

// ==========================================
// FUNCIÓN: MANEJO DE REGISTRO
// ==========================================
async function handleRegister(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validaciones
    if (password !== confirmPassword) {
        showErrorCard('❌ Las contraseñas no coinciden');
        return;
    }

    if (password.length < 8) {
        showErrorCard('❌ La contraseña debe tener al menos 8 caracteres');
        return;
    }

    if (fullName.length < 3) {
        showErrorCard('❌ El nombre debe tener al menos 3 caracteres');
        return;
    }

    showLoadingSpinner();

    try {
        // Crear usuario en Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Determinar rol según email
        const role = email.includes('@admin.cafearoma.com') ? 'admin' : 'usuario';

        // Guardar información del usuario en Firestore
        await db.collection('usuarios').doc(user.uid).set({
            nombre: fullName,
            email: email,
            rol: role,
            fechaRegistro: new Date(),
            uid: user.uid
        });

        // Mostrar tarjeta de éxito
        hideLoadingSpinner();
        document.getElementById('successCard').classList.remove('hidden');

        // Redirigir a login después de 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        hideLoadingSpinner();

        let errorMessage = '⚠️ Error al crear la cuenta';

        if (error.code === 'auth/email-already-in-use') {
            errorMessage = '❌ Este email ya está registrado. Inicia sesión o usa otro email.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = '❌ Contraseña muy débil. Usa mayúsculas, números y caracteres especiales.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = '❌ Email inválido. Verifica el formato.';
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = '❌ El registro está deshabilitado. Contacta al administrador.';
        }

        showErrorCard(errorMessage);
        console.error('Error en registro:', error);
    }
}

// ==========================================
// FUNCIÓN: MOSTRAR TARJETA DE ERROR
// ==========================================
function showErrorCard(message) {
    const errorCard = document.getElementById('errorCard');
    const errorMessage = document.getElementById('errorMessage');

    if (errorCard && errorMessage) {
        errorMessage.textContent = message;
        errorCard.classList.remove('hidden');
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            errorCard.classList.add('hidden');
        }, 5000);
    }
}

// ==========================================
// FUNCIÓN: MOSTRAR SPINNER DE CARGA
// ==========================================
function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.remove('hidden');
    }
}

// ==========================================
// FUNCIÓN: OCULTAR SPINNER DE CARGA
// ==========================================
function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.add('hidden');
    }
}

// ==========================================
// FUNCIÓN: CONFIGURAR SALUDO PERSONALIZADO
// ==========================================
function setupUserGreeting() {
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userGreeting = document.getElementById('userGreeting');

    if (userGreeting && userName) {
        if (userRole === 'admin') {
            userGreeting.textContent = `👋 Hola, ${userName} (Administrador)`;
        } else {
            userGreeting.textContent = `👋 Hola, ${userName}`;
        }
    }
}

// ==========================================
// FUNCIÓN: MOSTRAR TOKEN DE SESIÓN
// ==========================================
function displaySessionToken() {
    const sessionToken = sessionStorage.getItem('sessionToken');
    const tokenElement = document.getElementById('sessionToken');

    if (tokenElement && sessionToken) {
        // Mostrar solo primeros y últimos caracteres
        const shortToken = sessionToken.substring(0, 20) + '...' + sessionToken.substring(sessionToken.length - 10);
        tokenElement.textContent = sessionToken; // Mostrar token completo
    }
}

// ==========================================
// FUNCIÓN: CERRAR SESIÓN
// ==========================================
async function handleLogout() {
    try {
        // Calcular duración de la sesión
        const startTime = parseInt(localStorage.getItem('sessionStartTime'));
        const endTime = new Date().getTime();
        const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

        // Obtener datos de la sesión
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');
        const clientIP = await getClientIP();

        // Registrar cierre de sesión en Firestore
        await db.collection('bitacora_cierre_sesion').add({
            fecha_hora: new Date(),
            usuario: userEmail,
            rol: userRole,
            duracion_sesion: durationMinutes
        });

        // Cerrar sesión en Firebase
        await auth.signOut();

        // Limpiar localStorage y sessionStorage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userUID');
        localStorage.removeItem('sessionStartTime');
        sessionStorage.removeItem('sessionToken');

        // Redirigir al login
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión: ' + error.message);
    }
}

// ==========================================
// FUNCIÓN: VERIFICAR AUTENTICACIÓN
// ==========================================
function checkAuthentication() {
    auth.onAuthStateChanged(user => {
        const currentPage = window.location.pathname;

        // Si el usuario NO está autenticado
        if (!user) {
            // Si está en una página protegida, redirigir a login
            if (currentPage.includes('admin.html') || currentPage.includes('user.html')) {
                window.location.href = 'index.html';
            }
        } else {
            // Si el usuario ESTÁ autenticado
            // Verificar si está en la página correcta según su rol
            const userRole = localStorage.getItem('userRole');

            if (currentPage.includes('admin.html') && userRole !== 'admin') {
                window.location.href = 'user.html';
            } else if (currentPage.includes('user.html') && userRole === 'admin') {
                window.location.href = 'admin.html';
            }

            // Mostrar información de sesión
            setupUserGreeting();
            displaySessionToken();
        }
    });
}

// ==========================================
// INICIALIZACIÓN GLOBAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación al cargar
    checkAuthentication();

    // Configurar botón de logout si existe
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Listener para cambios en la autenticación
    auth.onAuthStateChanged(user => {
        if (user) {
            sessionStorage.setItem('sessionToken', user.uid);
            displaySessionToken();
        } else {
            sessionStorage.removeItem('sessionToken');
        }
    });
});
