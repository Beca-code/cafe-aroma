/* ==========================================
   BITACORA.JS - Gestión de Bitácoras
   Maneja la lectura y visualización de las 3 bitácoras
   desde Firestore
   ========================================== */

// Esperar a que Firebase esté disponible
function waitForFirebase() {
    return new Promise((resolve) => {
        const checkFirebase = setInterval(() => {
            if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                clearInterval(checkFirebase);
                resolve();
            }
        }, 100);
    });
}

// ==========================================
// FUNCIÓN: CARGAR Y MOSTRAR ACCESOS CORRECTOS
// ==========================================
async function loadAccesosCorrectos() {
    try {
        // Esperar a que Firebase esté listo
        await waitForFirebase();

        const tabla = document.getElementById('accesosCorrectosTable');
        if (!tabla) return;

        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">Cargando...</td></tr>';

        // Obtener datos de Firestore
        const snapshot = await db.collection('bitacora_acceso_correcto')
            .orderBy('fecha_hora', 'desc')
            .get();

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No hay registros de accesos correctos</td></tr>';
            return;
        }

        // Llenar tabla con datos
        tbody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const fecha = new Date(data.fecha_hora.toDate());
            const fechaFormato = fecha.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const row = `
                <tr>
                    <td>${fechaFormato}</td>
                    <td>${data.usuario}</td>
                    <td>${data.rol === 'admin' ? '🔐 Administrador' : '👤 Usuario'}</td>
                    <td><code style="font-size: 0.75rem; background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${data.id_sesion.substring(0, 15)}...</code></td>
                    <td>${data.ip || 'N/A'}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error cargando accesos correctos:', error);
        const tabla = document.getElementById('accesosCorrectosTable');
        if (tabla) {
            tabla.querySelector('tbody').innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error al cargar datos</td></tr>';
        }
    }
}

// ==========================================
// FUNCIÓN: CARGAR Y MOSTRAR ACCESOS FALLIDOS
// ==========================================
async function loadAccesosFallidos() {
    try {
        // Esperar a que Firebase esté listo
        await waitForFirebase();

        const tabla = document.getElementById('accesosFallidosTable');
        if (!tabla) return;

        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">Cargando...</td></tr>';

        // Obtener datos de Firestore
        const snapshot = await db.collection('bitacora_acceso_fallido')
            .orderBy('fecha_hora', 'desc')
            .get();

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No hay registros de accesos fallidos</td></tr>';
            return;
        }

        // Llenar tabla con datos
        tbody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const fecha = new Date(data.fecha_hora.toDate());
            const fechaFormato = fecha.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const motivo = data.motivo === 'contraseña incorrecta' ? '🔓 Contraseña incorrecta' : '❌ Usuario no existe';

            const row = `
                <tr>
                    <td>${fechaFormato}</td>
                    <td>${data.email_intentado}</td>
                    <td>${motivo}</td>
                    <td>${data.ip || 'N/A'}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error cargando accesos fallidos:', error);
        const tabla = document.getElementById('accesosFallidosTable');
        if (tabla) {
            tabla.querySelector('tbody').innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error al cargar datos</td></tr>';
        }
    }
}

// ==========================================
// FUNCIÓN: CARGAR Y MOSTRAR CIERRES DE SESIÓN
// ==========================================
async function loadCierresSesion() {
    try {        // Esperar a que Firebase esté listo
        await waitForFirebase();
        const tabla = document.getElementById('cierresTable');
        if (!tabla) return;

        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">Cargando...</td></tr>';

        // Obtener datos de Firestore
        const snapshot = await db.collection('bitacora_cierre_sesion')
            .orderBy('fecha_hora', 'desc')
            .get();

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No hay registros de cierres de sesión</td></tr>';
            return;
        }

        // Llenar tabla con datos
        tbody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const fecha = new Date(data.fecha_hora.toDate());
            const fechaFormato = fecha.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const row = `
                <tr>
                    <td>${fechaFormato}</td>
                    <td>${data.usuario}</td>
                    <td>${data.rol === 'admin' ? '🔐 Administrador' : '👤 Usuario'}</td>
                    <td>${data.duracion_sesion} min</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error cargando cierres de sesión:', error);
        const tabla = document.getElementById('cierresTable');
        if (tabla) {
            tabla.querySelector('tbody').innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error al cargar datos</td></tr>';
        }
    }
}

// ==========================================
// FUNCIÓN: CARGAR CONTADORES DE RESUMEN
// ==========================================
async function loadSummaryCounters() {
    try {
        // Contador de accesos correctos
        const correctosSnapshot = await db.collection('bitacora_acceso_correcto').get();
        const totalCorrectos = correctosSnapshot.size;
        const elementoCorrectos = document.getElementById('totalAccesosCorrectos');
        if (elementoCorrectos) {
            elementoCorrectos.textContent = totalCorrectos;
        }

        // Contador de accesos fallidos
        const fallidosSnapshot = await db.collection('bitacora_acceso_fallido').get();
        const totalFallidos = fallidosSnapshot.size;
        const elementoFallidos = document.getElementById('totalAccesosFallos');
        if (elementoFallidos) {
            elementoFallidos.textContent = totalFallidos;
        }

        // Contador de cierres de sesión
        const cierresSnapshot = await db.collection('bitacora_cierre_sesion').get();
        const totalCierres = cierresSnapshot.size;
        const elementoCierres = document.getElementById('totalCierres');
        if (elementoCierres) {
            elementoCierres.textContent = totalCierres;
        }

    } catch (error) {
        console.error('Error cargando contadores:', error);
    }
}

// ==========================================
// FUNCIÓN: CARGAR USUARIOS REGISTRADOS
// ==========================================
async function loadUsuariosRegistrados() {
    try {
        // Esperar a que Firebase esté listo
        await waitForFirebase();

        const tabla = document.getElementById('usuariosTable');
        if (!tabla) return;

        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">Cargando...</td></tr>';

        // Obtener datos de Firestore
        const snapshot = await db.collection('usuarios')
            .orderBy('fechaRegistro', 'desc')
            .get();

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No hay usuarios registrados</td></tr>';
            return;
        }

        // Llenar tabla con datos
        tbody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const fecha = new Date(data.fechaRegistro.toDate ? data.fechaRegistro.toDate() : data.fechaRegistro);
            const fechaFormato = fecha.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            const row = `
                <tr>
                    <td>${data.nombre}</td>
                    <td>${data.email}</td>
                    <td>${data.rol === 'admin' ? '🔐 Administrador' : '👤 Usuario'}</td>
                    <td>${fechaFormato}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error cargando usuarios:', error);
        const tabla = document.getElementById('usuariosTable');
        if (tabla) {
            tabla.querySelector('tbody').innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error al cargar datos</td></tr>';
        }
    }
}

// ==========================================
// INICIALIZACIÓN - CARGAR DATOS AL ABRIR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que Firebase esté listo
    auth.onAuthStateChanged(user => {
        if (user) {
            const currentPage = window.location.pathname;

            // Cargar datos correspondientes según la página
            if (currentPage.includes('admin.html')) {
                // Cargar datos del admin
                loadUsuariosRegistrados();
                loadAccesosCorrectos();
                loadAccesosFallidos();
                loadCierresSesion();
                loadSummaryCounters();

                // Re-cargar datos cada 30 segundos
                setInterval(() => {
                    loadUsuariosRegistrados();
                    loadAccesosCorrectos();
                    loadAccesosFallidos();
                    loadCierresSesion();
                    loadSummaryCounters();
                }, 30000);
            }
        }
    });
});

// ==========================================
// SISTEMA DE PESTAÑAS - CARGAR AL CAMBIAR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Cargar datos cuando se hace click en la pestaña
            setTimeout(() => {
                if (tabName === 'usuarios') {
                    loadUsuariosRegistrados();
                } else if (tabName === 'accesos-correctos') {
                    loadAccesosCorrectos();
                } else if (tabName === 'accesos-fallidos') {
                    loadAccesosFallidos();
                } else if (tabName === 'cierres-sesion') {
                    loadCierresSesion();
                } else if (tabName === 'resumen') {
                    loadSummaryCounters();
                }
            }, 300);
        });
    });
});
