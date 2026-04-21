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

    } catch (error) {
        console.error('Error actualizando perfil:', error);
    }
}

// ==========================================
// FUNCIÓN: CARGAR PREFERENCIAS DE USUARIO
// ==========================================
function loadUserPreferences() {
    // Recuperar preferencias guardadas en localStorage (si las hubiera)
    const preferences = {
        idioma: localStorage.getItem('userLanguage') || 'es',
        tema: localStorage.getItem('userTheme') || 'claro',
        notificaciones: localStorage.getItem('userNotifications') !== 'false'
    };

    console.log('⚙️ Preferencias del Usuario:', preferences);

    return preferences;
}

// ==========================================
// FUNCIÓN: GUARDAR PREFERENCIAS DE USUARIO
// ==========================================
function saveUserPreferences(preferencias) {
    localStorage.setItem('userLanguage', preferencias.idioma);
    localStorage.setItem('userTheme', preferencias.tema);
    localStorage.setItem('userNotifications', preferencias.notificaciones);

    console.log('✅ Preferencias guardadas');
}

// ==========================================
// FUNCIÓN: OBTENER INFORMACIÓN DE LA SESIÓN
// ==========================================
function getSessionInfo() {
    const sessionStartTime = localStorage.getItem('sessionStartTime');
    
    if (sessionStartTime) {
        const startTime = new Date(parseInt(sessionStartTime));
        const currentTime = new Date();
        const diffMinutes = Math.floor((currentTime - startTime) / (1000 * 60));
        const diffSeconds = Math.floor(((currentTime - startTime) / 1000) % 60);

        return {
            inicio: startTime.toLocaleString('es-ES'),
            duracion: `${diffMinutes}m ${diffSeconds}s`,
            email: localStorage.getItem('userEmail'),
            token: sessionStorage.getItem('sessionToken')
        };
    }

    return null;
}

// ==========================================
// FUNCIÓN: MOSTRAR ESTADÍSTICAS EN CONSOLA
// ==========================================
function displayUserStats() {
    const sessionInfo = getSessionInfo();

    if (sessionInfo) {
        console.log('📊 Estadísticas de Sesión:');
        console.log('  - Inicio:', sessionInfo.inicio);
        console.log('  - Duración:', sessionInfo.duracion);
        console.log('  - Email:', sessionInfo.email);
    }
}

// ==========================================
// EVENTO: CARGAR DATOS AL INICIAR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el usuario tenga acceso
    verifyUserAccess()
        .then(userData => {
            console.log('✅ Acceso de usuario verificado:', userData.nombre);
            
            // Configurar interfaz
            setupUserGreeting();
            displayUserSessionInfo();
            updateUserProfile();
            loadUserPreferences();
            displayUserStats();

            // Actualizar duración de sesión cada minuto
            setInterval(() => {
                displayUserStats();
            }, 60000);
        })
        .catch(error => {
            console.error('❌ Error de autorización:', error);
            // No redirigir automáticamente, permitir que el usuario vea el error
        });

    // Configurar eventos de menú (si hubiera interacción)
    setupMenuEvents();
});

// ==========================================
// FUNCIÓN: CONFIGURAR EVENTOS DEL MENÚ
// ==========================================
function setupMenuEvents() {
    // Agregar comportamiento interactivo a las tarjetas del menú
    const menuItems = document.querySelectorAll('.menu-item-card');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const nombre = this.querySelector('h4').textContent;
            const precio = this.querySelector('.item-price').textContent;

            console.log('🛒 Producto seleccionado:', nombre, '-', precio);
            
            // Aquí se podría agregar una funcionalidad de carrito si fuera necesario
        });
    });
}

// ==========================================
// FUNCIÓN: SIMULAR AGREGAR AL CARRITO
// ==========================================
let carrito = [];

function agregarAlCarrito(nombreProducto, precio) {
    carrito.push({
        nombre: nombreProducto,
        precio: precio,
        timestamp: new Date()
    });

    console.log('✅ Agregado al carrito:', nombreProducto);
    console.log('🛒 Total en carrito:', carrito.length, 'productos');

    return carrito;
}

// ==========================================
// FUNCIÓN: VER CARRITO
// ==========================================
function verCarrito() {
    if (carrito.length === 0) {
        console.log('🛒 El carrito está vacío');
        return;
    }

    let total = 0;
    console.log('🛒 Contenido del carrito:');
    
    carrito.forEach((item, index) => {
        const precioNum = parseFloat(item.precio.replace('$', ''));
        total += precioNum;
        console.log(`  ${index + 1}. ${item.nombre} - ${item.precio}`);
    });

    console.log('💰 Total:', '$' + total.toFixed(2));
    return carrito;
}

// ==========================================
// FUNCIÓN: LIMPIAR CARRITO
// ==========================================
function limpiarCarrito() {
    carrito = [];
    console.log('🗑️ Carrito limpiado');
}

// ==========================================
// HACER FUNCIONES DISPONIBLES GLOBALMENTE
// ==========================================
window.agregarAlCarrito = agregarAlCarrito;
window.verCarrito = verCarrito;
window.limpiarCarrito = limpiarCarrito;
window.getSessionInfo = getSessionInfo;
window.displayUserStats = displayUserStats;
