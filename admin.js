/* ==========================================
   ADMIN.JS - Lógica del Panel Administrador
   Gestiona funcionalidades específicas del panel admin
   ========================================== */

// ==========================================
// VERIFICAR AUTORIZACIÓN DE ADMINISTRADOR
// ==========================================
function verifyAdminAccess() {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(async user => {
            if (!user) {
                window.location.href = 'index.html';
                reject('No autenticado');
                return;
            }

            try {
                // Obtener documento del usuario
                const userDoc = await db.collection('usuarios').doc(user.uid).get();

                if (!userDoc.exists) {
                    window.location.href = 'user.html';
                    reject('Usuario no encontrado');
                    return;
                }

                const userData = userDoc.data();

                // Verificar si es administrador
                if (userData.rol !== 'admin') {
                    window.location.href = 'user.html';
                    reject('No tiene permisos de administrador');
                    return;
                }

                resolve(userData);

            } catch (error) {
                console.error('Error verificando acceso admin:', error);
                reject(error);
            }
        });
    });
}

// ==========================================
// CONFIGURAR SALUDO PERSONALIZADO ADMIN
// ==========================================
function setupAdminGreeting() {
    const userName = localStorage.getItem('userName');
    const userGreeting = document.getElementById('userGreeting');

    if (userGreeting && userName) {
        userGreeting.textContent = `👋 Hola, ${userName}`;
    }
}

// ==========================================
// MOSTRAR INFORMACIÓN DE SESIÓN
// ==========================================
function displayAdminSessionInfo() {
    const sessionToken = sessionStorage.getItem('sessionToken');
    const tokenElement = document.getElementById('sessionToken');

    if (tokenElement && sessionToken) {
        tokenElement.textContent = sessionToken;
    }
}

// ==========================================
// FUNCIÓN: FORMATEAR FECHA Y HORA
// ==========================================
function formatearFechaHora(firebaseTimestamp) {
    try {
        let fecha;
        
        // Verificar si es un timestamp de Firebase o un Date
        if (firebaseTimestamp && typeof firebaseTimestamp.toDate === 'function') {
            fecha = firebaseTimestamp.toDate();
        } else if (firebaseTimestamp instanceof Date) {
            fecha = firebaseTimestamp;
        } else {
            return 'N/A';
        }

        return fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return 'N/A';
    }
}

// ==========================================
// EVENTO: CARGAR DATOS AL INICIAR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el usuario sea administrador
    verifyAdminAccess()
        .then(userData => {
            console.log('✅ Acceso de administrador verificado:', userData.nombre);
            
            // Configurar interfaz
            setupAdminGreeting();
            displayAdminSessionInfo();

            // Cargar datos iniciales
            setTimeout(() => {
                loadUsuariosRegistrados();
                loadAccesosCorrectos();
                loadAccesosFallidos();
                loadCierresSesion();
                loadSummaryCounters();
            }, 500);

            // Recargar datos periódicamente (cada 45 segundos)
            setInterval(() => {
                loadUsuariosRegistrados();
                loadAccesosCorrectos();
                loadAccesosFallidos();
                loadCierresSesion();
                loadSummaryCounters();
            }, 45000);
        })
        .catch(error => {
            console.error('❌ Error de autorización:', error);
            window.location.href = 'index.html';
        });

    // Configurar eventos de las pestañas
    setupTabEvents();
});

// ==========================================
// FUNCIÓN: CONFIGURAR EVENTOS DE PESTAÑAS
// ==========================================
function setupTabEvents() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Cambiar clase activa
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Cambiar contenido de pestaña
            const allTabs = document.querySelectorAll('.tab-content');
            allTabs.forEach(tab => tab.classList.remove('active'));
            
            const activeTab = document.getElementById(tabName + '-tab');
            if (activeTab) {
                activeTab.classList.add('active');
            }

            // Cargar datos al cambiar pestaña
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
            }, 100);
        });
    });
}

// ==========================================
// FUNCIÓN: EXPORTAR DATOS A CSV (Opcional)
// ==========================================
async function exportarBitacoraCSV(coleccion, nombreArchivo) {
    try {
        const snapshot = await db.collection(coleccion).get();
        
        if (snapshot.empty) {
            alert('No hay datos para exportar');
            return;
        }

        let csv = '';
        let headers = [];
        let datos = [];

        snapshot.forEach((doc, index) => {
            const data = doc.data();
            
            if (index === 0) {
                // Primera iteración: obtener headers
                headers = Object.keys(data);
                csv += headers.join(',') + '\n';
            }

            // Convertir valores a formato CSV
            const valores = headers.map(header => {
                let value = data[header];
                
                // Formatear timestamps
                if (value && typeof value.toDate === 'function') {
                    value = value.toDate().toLocaleString('es-ES');
                }
                
                // Escapar comillas
                if (typeof value === 'string') {
                    value = '"' + value.replace(/"/g, '""') + '"';
                }
                
                return value || '';
            });

            csv += valores.join(',') + '\n';
            datos.push(data);
        });

        // Crear blob y descargar
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', nombreArchivo + '.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('✅ Archivo exportado exitosamente');

    } catch (error) {
        console.error('Error al exportar:', error);
        alert('❌ Error al exportar datos');
    }
}

// ==========================================
// FUNCIÓN: LIMPIAR BITÁCORA (Requiere confirmación)
// ==========================================
async function limpiarBitacora(coleccion) {
    const confirmacion = confirm(`⚠️ ¿Estás seguro de que deseas limpiar toda la bitácora de ${coleccion}? Esta acción no se puede deshacer.`);

    if (!confirmacion) {
        return;
    }

    try {
        const snapshot = await db.collection(coleccion).get();
        
        // Eliminar documentos uno por uno
        snapshot.forEach(doc => {
            db.collection(coleccion).doc(doc.id).delete();
        });

        alert('✅ Bitácora limpiada exitosamente');
        
        // Recargar datos
        if (coleccion === 'bitacora_acceso_correcto') {
            loadAccesosCorrectos();
        } else if (coleccion === 'bitacora_acceso_fallido') {
            loadAccesosFallidos();
        } else if (coleccion === 'bitacora_cierre_sesion') {
            loadCierresSesion();
        }

    } catch (error) {
        console.error('Error limpiando bitácora:', error);
        alert('❌ Error al limpiar la bitácora');
    }
}

// ==========================================
// Hacer funciones disponibles globalmente
// ==========================================
window.exportarBitacoraCSV = exportarBitacoraCSV;
window.limpiarBitacora = limpiarBitacora;
window.formatearFechaHora = formatearFechaHora;
