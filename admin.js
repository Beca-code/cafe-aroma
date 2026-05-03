/* ==========================================
   ADMIN.JS - Lógica del Panel Administrador
   Gestiona funcionalidades específicas del panel admin
   ========================================== */

// ==========================================
// MOSTRAR INFORMACIÓN DE SESIÓN DEL ADMINISTRADOR
// ==========================================
function displaySessionToken() {
    const sessionToken = localStorage.getItem('sessionToken');
    const tokenElement = document.getElementById('sessionToken');

    if (tokenElement && sessionToken) {
        tokenElement.textContent = sessionToken;
    }
}

// ==========================================
// CONFIGURAR SALUDO PERSONALIZADO ADMIN
// ==========================================
function setupUserGreeting() {
    const userName = localStorage.getItem('userName');
    const userGreeting = document.getElementById('userGreeting');

    if (userGreeting && userName) {
        userGreeting.textContent = ` ${userName} (Administrador)`;
    }
}

// ==========================================
// FUNCIÓN: EXPORTAR DATOS A CSV
// ==========================================
function exportarBitacoraCSV() {
    try {
        const csv = db.exportAsCSV();
        
        // Crear blob y descargar
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'bitacora_cafe_aroma_' + new Date().getTime() + '.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Bitácora exportada exitosamente');

    } catch (error) {
        console.error('Error al exportar:', error);
        alert('Error al exportar bitácora');
    }
}

// ==========================================
// FUNCIÓN: LIMPIAR BITÁCORA
// ==========================================
function limpiarBitacora() {
    const confirmacion = confirm('¿Estás seguro de que deseas limpiar TODA la bitácora? Esta acción no se puede deshacer.');

    if (!confirmacion) {
        return;
    }

    try {
        db.clearLogs();
        alert('Bitácora limpiada exitosamente');
        
        // Recargar todas las bitácoras
        loadAccesosCorrectos();
        loadAccesosFallidos();
        loadCierresSesion();
        loadSummaryCounters();

    } catch (error) {
        console.error('Error limpiando bitácora:', error);
        alert('Error al limpiar la bitácora');
    }
}

// ==========================================
// Hacer funciones disponibles globalmente
// ==========================================
window.exportarBitacoraCSV = exportarBitacoraCSV;
window.limpiarBitacora = limpiarBitacora;
