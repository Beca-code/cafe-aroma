/* ==========================================
   AUTH.JS - Lógica de Autenticación con localStorage
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

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Mostrar spinner de carga
    showLoadingSpinner();

    try {
        // Esperar un poco para simular verificación
        await new Promise(resolve => setTimeout(resolve, 800));

        // Intentar autenticar
        const result = db.authenticateUser(email, password);

        if (!result.success) {
            hideLoadingSpinner();
            
            // Registrar intento fallido
            const clientIP = await getClientIP();
            db.recordAccessFailure(email, result.reason, clientIP);
            
            showErrorCard(result.reason);
            return;
        }

        const user = result.user;

        // Guardar información de sesión
        sessionStartTime = new Date();
        const sessionToken = 'session_' + Math.random().toString(36).substr(2, 16);
        
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', user.rol);
        localStorage.setItem('userName', user.nombre);
        localStorage.setItem('userUID', user.uid);
        localStorage.setItem('sessionStartTime', sessionStartTime.getTime());
        localStorage.setItem('sessionToken', sessionToken);

        // Registrar acceso exitoso
        const clientIP = await getClientIP();
        db.recordAccessSuccess(email, user.rol, sessionToken, clientIP);

        hideLoadingSpinner();

        // Redirigir según rol
        if (user.rol === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'user.html';
        }

    } catch (error) {
        hideLoadingSpinner();
        console.error('Error en login:', error);
        showErrorCard('Error inesperado. Intenta de nuevo.');
    }
}

// ==========================================
// FUNCIÓN: MANEJO DE REGISTRO
// ==========================================
async function handleRegister(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validaciones
    if (password !== confirmPassword) {
        showErrorCard('Las contraseñas no coinciden');
        return;
    }

    if (password.length < 8) {
        showErrorCard('La contraseña debe tener al menos 8 caracteres');
        return;
    }

    if (fullName.length < 3) {
        showErrorCard('El nombre debe tener al menos 3 caracteres');
        return;
    }

    showLoadingSpinner();

    try {
        // Esperar un poco para simular procesamiento
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Determinar rol según email
        const role = email.includes('@admin.cafearoma.com') ? 'admin' : 'usuario';

        // Crear usuario en la "base de datos"
        const newUser = db.createUser(email, password, fullName, role);

        hideLoadingSpinner();
        
        // Mostrar tarjeta de éxito
        document.getElementById('successCard').classList.remove('hidden');

        // Redirigir a login después de 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        hideLoadingSpinner();
        console.error('Error en registro:', error);
        
        let errorMessage = 'Error al crear la cuenta';
        if (error.message.includes('ya está registrado')) {
            errorMessage = 'Este email ya está registrado. Inicia sesión o usa otro email.';
        }
        
        showErrorCard(errorMessage);
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
            userGreeting.textContent = `Hola, ${userName} (Administrador)`;
        } else {
            userGreeting.textContent = `Hola, ${userName}`;
        }
    }
}

// ==========================================
// FUNCIÓN: MOSTRAR TOKEN DE SESIÓN
// ==========================================
function displaySessionToken() {
    const sessionToken = localStorage.getItem('sessionToken');
    const tokenElement = document.getElementById('sessionToken');

    if (tokenElement && sessionToken) {
        tokenElement.textContent = sessionToken;
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

        // Registrar cierre de sesión
        db.recordSessionClose(userEmail, userRole, durationMinutes);

        // Limpiar localStorage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userUID');
        localStorage.removeItem('sessionStartTime');
        localStorage.removeItem('sessionToken');

        // Redirigir al login
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
        
        // Limpiar igualmente en caso de error
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userUID');
        localStorage.removeItem('sessionStartTime');
        localStorage.removeItem('sessionToken');
    }
}

// ==========================================
// VERIFICAR AUTENTICACIÓN
// ==========================================
function verifyPageAccess() {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const currentPage = window.location.pathname;

    // Si no está autenticado, redirigir a login
    if (!userEmail) {
        if (currentPage.includes('admin.html') || currentPage.includes('user.html')) {
            window.location.href = 'index.html';
        }
        return false;
    }

    // Verificar acceso según rol
    if (currentPage.includes('admin.html') && userRole !== 'admin') {
        window.location.href = 'user.html';
        return false;
    }

    return true;
}

// ==========================================
// INICIALIZACIÓN GLOBAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación y permisos
    verifyPageAccess();

    // Mostrar información de usuario si está autenticado
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        setupUserGreeting();
        displaySessionToken();
    }

    // Configurar botón de logout si existe
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});
