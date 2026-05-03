# 🔐 Credenciales de Acceso - Café Aroma

## Plataforma Web de Autenticación y Gestión CRUD

### 📋 Cuentas Disponibles

#### 1. **PERFIL: ADMINISTRADOR** 👑
- **Email:** `admin@admin.cafearoma.com`
- **Contraseña:** `Admin123`
- **Rol:** Administrador (Máximos permisos)
- **Permisos:**
  - ✅ Insertar información
  - ✅ Eliminar información
  - ✅ Visualizar información
  - ✅ Ver bitácoras completas
  - ✅ Exportar datos a CSV
  - ✅ Gestionar registros CRUD

#### 2. **PERFIL: USUARIO REGULAR** 👤
- **Email:** `usuario@example.com`
- **Contraseña:** `Prueba123!`
- **Rol:** Usuario Regular (Permisos limitados)
- **Permisos:**
  - ❌ No puede insertar
  - ❌ No puede eliminar
  - ✅ Solo visualizar información
  - ✅ Ver su token de sesión
  - ✅ Cerrar sesión

---

## 🌍 URL de Acceso

**Sitio Web:** https://caffe-aroma.netlify.app/

---

## 🧪 Funcionalidades de Prueba

### 1. Autenticación
- Inicia sesión con cualquiera de las credenciales anteriores
- Observa tu perfil y nivel de permisos mostrado en la pantalla

### 2. Sistema CRUD
- **Como Administrador:**
  - Accede a la pestaña "📦 Gestión de Datos (CRUD)"
  - Prueba insertar registros
  - Prueba eliminar registros
  - Visualiza todos los cambios en tiempo real

- **Como Usuario Regular:**
  - Solo verás la opción "Visualizar Información"
  - No podrás insertar ni eliminar
  - Verás mensajes de permiso denegado

### 3. Prueba de Robo de Sesión
1. Inicia sesión como administrador
2. Copia tu "Token de Sesión"
3. Abre una ventana de incógnito (Ctrl+Shift+N)
4. Ve a: https://caffe-aroma.netlify.app/
5. Abre la consola del navegador (F12)
6. Ejecuta:
   ```javascript
   localStorage.setItem('sessionToken', 'PEGA_TU_TOKEN_AQUI');
   localStorage.setItem('userRole', 'admin');
   localStorage.setItem('userEmail', 'admin@admin.cafearoma.com');
   localStorage.setItem('userName', 'Administrador');
   ```
7. Recarga la página (F5)
8. ¡Deberías ver el panel de admin en la otra sesión!

### 4. Bitácoras de Auditoría (Solo Administrador)
- Ve a la pestaña "👥 Usuarios Registrados" para ver todos los usuarios
- "✅ Accesos Correctos" - Registra logins exitosos
- "❌ Accesos Fallidos" - Registra intentos fallidos
- "🚪 Cierres de Sesión" - Registra cuando se cierra sesión
- "📊 Resumen" - Estadísticas generales

---

## 🔒 Requerimientos del Proyecto

✅ **Autenticación:** Sistema de login y registro  
✅ **Identificación de Perfil:** Muestra si eres Admin o Usuario  
✅ **CRUD Básico:** Insertar, Eliminar, Visualizar datos  
✅ **Control de Permisos:** Diferentes opciones según el rol  
✅ **Bitácoras de Acceso:** Registro de intentos de login  
✅ **Prueba de Seguridad:** Simulación de robo de token  
✅ **Despliegue:** Netlify (producción)  

---

## 📊 Información Técnica

**Tecnologías Utilizadas:**
- HTML5 + CSS3 (Diseño Glassmorphism)
- JavaScript vanilla (ES6+)
- localStorage para persistencia de datos
- Responsive design (Mobile, Tablet, Desktop)

**Estructura de Carpetas:**
```
caffeAroma/
├── index.html          (Página de Login)
├── register.html       (Página de Registro)
├── admin.html          (Panel de Administrador)
├── user.html           (Panel de Usuario)
├── style.css           (Estilos globales)
├── database.js         (Base de datos en localStorage)
├── auth.js             (Autenticación y sesiones)
├── bitacora.js         (Mostrar bitácoras)
├── admin.js            (Funciones de admin)
├── user.js             (Funciones de usuario)
└── CREDENCIALES.md     (Este archivo)
```

---

## 🆘 Solución de Problemas

**P: Olvidé mi contraseña**  
R: Las credenciales están arriba. Usa cualquiera de las dos cuentas.

**P: Mi sesión se cerró**  
R: Los datos se guardan en localStorage. Inicia sesión nuevamente.

**P: No veo mis datos CRUD**  
R: Asegúrate de estar logueado como administrador para insertar/eliminar.

**P: ¿Cómo veo las bitácoras?**  
R: Solo el administrador puede ver las bitácoras. Inicia sesión con la cuenta de admin.

---

**Versión:** 1.0  
**Última actualización:** 2026-05-02  
**Estado:** ✅ Producción
