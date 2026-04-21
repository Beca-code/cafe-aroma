/* ==========================================
   DATABASE.JS - Simulación de Base de Datos en localStorage
   Almacena usuarios y bitácoras de forma persistente
   ========================================== */

class CafeAromaDatabase {
    constructor() {
        this.storageKey = 'cafeAroma_db';
        this.initializeDatabase();
    }

    // Inicializar la base de datos si no existe
    initializeDatabase() {
        if (!localStorage.getItem(this.storageKey)) {
            const emptyDB = {
                usuarios: [],
                bitacora_acceso_correcto: [],
                bitacora_acceso_fallido: [],
                bitacora_cierre_sesion: []
            };
            localStorage.setItem(this.storageKey, JSON.stringify(emptyDB));
        }
    }

    // Obtener la base de datos completa
    getDB() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    }

    // Guardar la base de datos
    saveDB(db) {
        localStorage.setItem(this.storageKey, JSON.stringify(db));
    }

    // ==========================================
    // USUARIOS
    // ==========================================

    // Crear nuevo usuario
    createUser(email, password, nombre, rol = 'usuario') {
        const db = this.getDB();
        
        // Verificar si ya existe
        if (db.usuarios.find(u => u.email === email)) {
            throw new Error('El email ya está registrado');
        }

        const newUser = {
            uid: 'user_' + Math.random().toString(36).substr(2, 9),
            email: email,
            password: password,
            nombre: nombre,
            rol: rol,
            fechaRegistro: new Date().toISOString()
        };

        db.usuarios.push(newUser);
        this.saveDB(db);
        return newUser;
    }

    // Autenticar usuario
    authenticateUser(email, password) {
        const db = this.getDB();
        const user = db.usuarios.find(u => u.email === email);

        if (!user) {
            return { success: false, reason: 'Usuario no encontrado' };
        }

        if (user.password !== password) {
            return { success: false, reason: 'Contraseña incorrecta' };
        }

        return { success: true, user: user };
    }

    // Obtener usuario por UID
    getUserByUID(uid) {
        const db = this.getDB();
        return db.usuarios.find(u => u.uid === uid);
    }

    // Obtener todos los usuarios
    getAllUsers() {
        const db = this.getDB();
        return db.usuarios.map(u => ({
            ...u,
            password: '••••••••' // No mostrar contraseña
        }));
    }

    // ==========================================
    // BITÁCORAS
    // ==========================================

    // Registrar acceso correcto
    recordAccessSuccess(email, rol, sessionToken, ip) {
        const db = this.getDB();
        db.bitacora_acceso_correcto.push({
            id: 'access_' + Math.random().toString(36).substr(2, 9),
            fecha_hora: new Date().toISOString(),
            usuario: email,
            rol: rol,
            id_sesion: sessionToken,
            ip: ip
        });
        this.saveDB(db);
    }

    // Registrar acceso fallido
    recordAccessFailure(emailAttempted, motivo, ip) {
        const db = this.getDB();
        db.bitacora_acceso_fallido.push({
            id: 'failed_' + Math.random().toString(36).substr(2, 9),
            fecha_hora: new Date().toISOString(),
            email_intentado: emailAttempted,
            motivo: motivo,
            ip: ip
        });
        this.saveDB(db);
    }

    // Registrar cierre de sesión
    recordSessionClose(email, rol, duracionMinutos) {
        const db = this.getDB();
        db.bitacora_cierre_sesion.push({
            id: 'close_' + Math.random().toString(36).substr(2, 9),
            fecha_hora: new Date().toISOString(),
            usuario: email,
            rol: rol,
            duracion_sesion: duracionMinutos
        });
        this.saveDB(db);
    }

    // Obtener bitácora de accesos correctos
    getSuccessLog() {
        const db = this.getDB();
        return db.bitacora_acceso_correcto.sort((a, b) => 
            new Date(b.fecha_hora) - new Date(a.fecha_hora)
        );
    }

    // Obtener bitácora de accesos fallidos
    getFailureLog() {
        const db = this.getDB();
        return db.bitacora_acceso_fallido.sort((a, b) => 
            new Date(b.fecha_hora) - new Date(a.fecha_hora)
        );
    }

    // Obtener bitácora de cierres de sesión
    getCloseLog() {
        const db = this.getDB();
        return db.bitacora_cierre_sesion.sort((a, b) => 
            new Date(b.fecha_hora) - new Date(a.fecha_hora)
        );
    }

    // Obtener contadores
    getCounters() {
        const db = this.getDB();
        return {
            usuariosRegistrados: db.usuarios.length,
            accesosCorrectos: db.bitacora_acceso_correcto.length,
            accesosFallidos: db.bitacora_acceso_fallido.length,
            cierresSesion: db.bitacora_cierre_sesion.length
        };
    }

    // Limpiar bitácoras
    clearLogs() {
        const db = this.getDB();
        db.bitacora_acceso_correcto = [];
        db.bitacora_acceso_fallido = [];
        db.bitacora_cierre_sesion = [];
        this.saveDB(db);
    }

    // Exportar base de datos como JSON
    exportAsJSON() {
        const db = this.getDB();
        return JSON.stringify(db, null, 2);
    }

    // Exportar como CSV
    exportAsCSV() {
        const db = this.getDB();
        let csv = 'BITÁCORA DE ACCESOS CORRECTOS\n';
        csv += 'Fecha y Hora,Usuario,Rol,ID Sesión,IP\n';
        
        db.bitacora_acceso_correcto.forEach(log => {
            csv += `"${log.fecha_hora}","${log.usuario}","${log.rol}","${log.id_sesion}","${log.ip}"\n`;
        });

        csv += '\n\nBITÁCORA DE ACCESOS FALLIDOS\n';
        csv += 'Fecha y Hora,Email Intentado,Motivo,IP\n';
        
        db.bitacora_acceso_fallido.forEach(log => {
            csv += `"${log.fecha_hora}","${log.email_intentado}","${log.motivo}","${log.ip}"\n`;
        });

        csv += '\n\nBITÁCORA DE CIERRES DE SESIÓN\n';
        csv += 'Fecha y Hora,Usuario,Rol,Duración (min)\n';
        
        db.bitacora_cierre_sesion.forEach(log => {
            csv += `"${log.fecha_hora}","${log.usuario}","${log.rol}",${log.duracion_sesion}\n`;
        });

        return csv;
    }
}

// Instancia global de la base de datos
const db = new CafeAromaDatabase();
