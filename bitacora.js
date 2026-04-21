/* ==========================================
   BITACORA.JS - Gestión de Bitácoras con localStorage
   Maneja la lectura y visualización de las 3 bitácoras
   ========================================== */

// ==========================================
// FUNCIÓN: CARGAR Y MOSTRAR ACCESOS CORRECTOS
// ==========================================
async function loadAccesosCorrectos() {
    try {
        const tabla = document.getElementById('accesosCorrectosTable');
        if (!tabla) return;

        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">Cargando...</td></tr>';

        // Obtener datos del localStorage
        const logs = db.getSuccessLog();

        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No hay registros de accesos correctos</td></tr>';
            return;
        }

        // Llenar tabla con datos
        tbody.innerHTML = '';
        logs.forEach(log => {
            const fecha = new Date(log.fecha_hora);
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
                    <td>${log.usuario}</td>
                    <td>${log.rol === 'admin' ? '🔐 Admin' : '👤 Usuario'}</td>
                    <td style="font-size: 11px; font-family: monospace; background: #f5f5f5; padding: 4px; border-radius: 3px; word-break: break-all;">${log.id_sesion}</td>
                    <td>${log.ip}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error cargando accesos correctos:', error);
    }
}

// ==========================================
// FUNCIÓN: CARGAR Y MOSTRAR ACCESOS FALLIDOS
// ==========================================
async function loadAccesosFallidos() {
    try {
        const tabla = document.getElementById('accesosFallidosTable');
        if (!tabla) return;

        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">Cargando...</td></tr>';

        // Obtener datos del localStorage
        const logs = db.getFailureLog();

        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No hay registros de accesos fallidos</td></tr>';
            return;
        }

        // Llenar tabla con datos
        tbody.innerHTML = '';
        logs.forEach(log => {
            const fecha = new Date(log.fecha_hora);
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
                    <td>${log.email_intentado}</td>
                    <td>❌ ${log.motivo}</td>
                    <td>${log.ip}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error cargando accesos fallidos:', error);
    }
}

// ==========================================
// FUNCIÓN: CARGAR Y MOSTRAR CIERRES DE SESIÓN
// ==========================================
async function loadCierresSesion() {
    try {
        const tabla = document.getElementById('cierresTable');
        if (!tabla) return;

        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">Cargando...</td></tr>';

        // Obtener datos del localStorage
        const logs = db.getCloseLog();

        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No hay registros de cierres de sesión</td></tr>';
            return;
        }

        // Llenar tabla con datos
        tbody.innerHTML = '';
        logs.forEach(log => {
            const fecha = new Date(log.fecha_hora);
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
                    <td>${log.usuario}</td>
                    <td>${log.rol === 'admin' ? '🔐 Admin' : '👤 Usuario'}</td>
                    <td>${log.duracion_sesion} min</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error cargando cierres de sesión:', error);
    }
}

// ==========================================
// FUNCIÓN: CARGAR CONTADORES DE RESUMEN
// ==========================================
async function loadSummaryCounters() {
    try {
        const counters = db.getCounters();

        const totalUsuarios = document.getElementById('totalUsuarios');
        const totalAccesosCorrectos = document.getElementById('totalAccesosCorrectos');
        const totalAccesosFallidos = document.getElementById('totalAccesosFallidos');
        const totalCierresSesion = document.getElementById('totalCierresSesion');

        if (totalUsuarios) totalUsuarios.textContent = counters.usuariosRegistrados;
        if (totalAccesosCorrectos) totalAccesosCorrectos.textContent = counters.accesosCorrectos;
        if (totalAccesosFallidos) totalAccesosFallidos.textContent = counters.accesosFallidos;
        if (totalCierresSesion) totalCierresSesion.textContent = counters.cierresSesion;

    } catch (error) {
        console.error('Error cargando contadores:', error);
    }
}

// ==========================================
// FUNCIÓN: CARGAR USUARIOS REGISTRADOS
// ==========================================
async function loadUsuariosRegistrados() {
    try {
        const tabla = document.getElementById('usuariosTable');
        if (!tabla) return;

        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">Cargando...</td></tr>';

        // Obtener usuarios del localStorage
        const usuarios = db.getAllUsers();

        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No hay usuarios registrados</td></tr>';
            return;
        }

        // Llenar tabla con datos
        tbody.innerHTML = '';
        usuarios.forEach(user => {
            const fecha = new Date(user.fechaRegistro);
            const fechaFormato = fecha.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            const row = `
                <tr>
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                    <td>${user.rol === 'admin' ? '🔐 Administrador' : '👤 Usuario'}</td>
                    <td>${fechaFormato}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}
