# ☕ Café Aroma - Sitio Web Boutique

Un sitio web completo, funcional y listo para Netlify con autenticación Firebase y auditoría de seguridad. Desarrollado en HTML, CSS y JavaScript puro sin frameworks.

## 🎨 Identidad Visual

- **Colores Principales**: Terracota (#C1440E), Café Oscuro (#3E1C00), Beige (#F5E6C8)
- **Tipografías**: Playfair Display (títulos), Poppins (cuerpo)
- **Efectos**: Glassmorphism, transiciones suaves, animaciones fadeIn
- **Emojis Temáticos**: ☕ 🫘 🥐 🍵

## 📁 Estructura de Archivos

```
cafe-aroma/
├── index.html          # Pantalla de login
├── register.html       # Pantalla de registro
├── admin.html          # Panel del administrador
├── user.html           # Panel del usuario regular
├── style.css           # Estilos globales (responsive)
├── firebase.js         # Configuración de Firebase
├── auth.js             # Lógica de autenticación
├── bitacora.js         # Gestión de bitácoras
├── admin.js            # Lógica del panel admin
├── user.js             # Lógica del panel usuario
├── netlify.toml        # Configuración de Netlify
└── README.md           # Este archivo
```

## 🚀 Configuración Rápida

### 1. Clonar o Descargar el Proyecto

```bash
cd cafe-aroma
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Autenticación con Email/Contraseña
4. Crea una base de datos Firestore
5. Copia tus credenciales
6. Abre `firebase.js` y pega tu configuración:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};
```

### 3. Configurar Firestore (Colecciones Requeridas)

En Firebase Firestore, crea las siguientes colecciones:

- **usuarios** - Almacena información de usuarios registrados
- **bitacora_acceso_correcto** - Registra accesos exitosos
- **bitacora_acceso_fallido** - Registra intentos fallidos
- **bitacora_cierre_sesion** - Registra cierres de sesión

### 4. Abrir en VS Code

```bash
code .
```

Usa la extensión "Live Server" para ejecutar localmente, o abre directamente un archivo HTML.

## 🔐 Características de Seguridad

### Sistema de Autenticación

- Login y registro con Firebase Authentication
- Validación en tiempo real de contraseña
- Detección automática de rol de administrador
  - Email con `@admin.cafearoma.com` → Rol Admin
  - Otros emails → Rol Usuario

### Tres Bitácoras de Auditoría

1. **Bitácora de Acceso Correcto**
   - Fecha y hora del acceso
   - Email del usuario
   - Rol (Admin/Usuario)
   - ID de Sesión (Token Firebase)
   - Dirección IP

2. **Bitácora de Acceso Fallido**
   - Fecha y hora del intento
   - Email intentado
   - Motivo (contraseña incorrecta / usuario no existe)
   - Dirección IP

3. **Bitácora de Cierre de Sesión**
   - Fecha y hora del cierre
   - Email del usuario
   - Rol
   - Duración de la sesión (en minutos)

### Prueba de Robo de ID de Sesión

- El token de sesión se muestra en el panel para propósitos de auditoría
- Firebase permite multi-sesión por defecto (comportamiento registrado)
- Botón de copiar para facilitar pruebas

## 📊 Funcionalidades por Rol

### Administrador 🔐

- Saludo personalizado
- Panel con 4 pestañas de datos:
  - Usuarios Registrados
  - Accesos Correctos
  - Accesos Fallidos
  - Cierres de Sesión
- Resumen de auditoría con contadores
- Información sobre importancia de bitácoras
- Información de sesión activa

### Usuario Regular 👤

- Saludo personalizado
- Visualización del menú de cafetería
- Información de sesión
- Menú con categorías:
  - Bebidas de Café (Cappuccino, Latte, Americano, etc.)
  - Bebidas de Té (Verde, Negro, Chai)
  - Pastelería (Croissants, Muffins, Brownies)
  - Bebidas Especiales (Cold Brew, Mocha, Flat White)

## 🎯 Flujos Principales

### Flujo de Login

1. Usuario accede a `index.html`
2. Ingresa email y contraseña
3. Firebase valida credenciales
4. Si es correcto:
   - Registra en `bitacora_acceso_correcto`
   - Redirige según rol (admin.html o user.html)
5. Si es incorrecto:
   - Registra en `bitacora_acceso_fallido`
   - Muestra tarjeta de error con animación shake

### Flujo de Registro

1. Usuario accede a `register.html`
2. Completa formulario con validaciones en tiempo real
3. Sistema detecta rol según email
4. Firebase crea usuario
5. Firestore almacena en colección `usuarios`
6. Redirige a login

### Flujo de Cierre de Sesión

1. Usuario hace clic en "Cerrar Sesión"
2. Sistema calcula duración de sesión
3. Registra en `bitacora_cierre_sesion`
4. Firebase cierra sesión
5. Limpia localStorage y sessionStorage
6. Redirige a login

## 📱 Responsividad

El sitio es 100% responsivo:

- **Desktop**: Diseño completo con todas las funcionalidades
- **Tablet**: Adaptación de columnas y redimensionamiento
- **Móvil**: Interfaz touch-friendly con menús adaptados

## 🌐 Despliegue en Netlify

### Opción 1: Conectar Repositorio (Recomendado)

1. Sube el proyecto a GitHub
2. Ve a [Netlify](https://app.netlify.com/)
3. Haz clic en "New site from Git"
4. Selecciona tu repositorio
5. Configura:
   - **Build command**: Dejar en blanco (no hay compilación)
   - **Publish directory**: `.` (raíz)
6. Agrega variables de entorno de Firebase
7. Haz clic en "Deploy"

### Opción 2: Arrastra y Suelta

1. Ve a Netlify
2. Arrastra la carpeta `cafe-aroma` a la zona de suelta
3. Tu sitio estará en vivo en segundos

### Opción 3: Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

## 🔍 Testing

### Crear Cuentas de Prueba

1. **Usuario Regular**
   - Email: usuario@example.com
   - Contraseña: Test1234!

2. **Administrador**
   - Email: admin@admin.cafearoma.com
   - Contraseña: Admin1234!

### Prueba de Bitácoras

1. Inicia sesión varias veces con diferentes cuentas
2. Intenta acceder con credenciales incorrectas
3. Como admin, ve al panel y verifica las bitácoras
4. Confirma que los datos se registran correctamente

### Prueba de Seguridad

1. Inicia sesión en el navegador
2. Copia el token de sesión del panel
3. Intenta usar el token en otra pestaña/navegador
4. Verifica que Firebase permite multi-sesión

## 🛠️ Personalización

### Cambiar Colores

Edita `:root` en `style.css`:

```css
:root {
    --color-terracota: #C1440E;
    --color-cafe-oscuro: #3E1C00;
    --color-beige: #F5E6C8;
    /* ... más colores */
}
```

### Agregar Más Elementos al Menú

Edita la sección `menu-section` en `user.html`:

```html
<div class="menu-item-card">
    <div class="item-icon">☕</div>
    <h4>Tu Bebida</h4>
    <p class="item-description">Descripción</p>
    <span class="item-price">$X.XX</span>
</div>
```

### Modificar Reglas de Rol

En `auth.js` o durante el registro, cambia la lógica:

```javascript
// Detectar admin por email
const role = email.includes('@admin.cafearoma.com') ? 'admin' : 'usuario';
```

## 🐛 Solución de Problemas

### "Firebase no está definido"

- Asegúrate de que `firebase.js` está después de los scripts de Firebase CDN
- Verifica que la configuración de Firebase es correcta

### Las bitácoras no se guardan

- Comprueba que las colecciones existen en Firestore
- Verifica que Firebase tiene permisos de escritura
- Abre la consola del navegador (F12) para ver errores

### Login no funciona en Netlify

- Verifica que habilitaste autenticación en Firebase
- Comprueba que las reglas de Firestore permiten lectura/escritura
- Asegúrate de agregar el dominio de Netlify a Firebase

### La IP no se obtiene

- `getClientIP()` usa api.ipify.org (servicio externo)
- Si no está disponible, se guarda "IP no disponible"
- Esto es normal en algunos entornos de red corporativa

## 📚 Documentación Adicional

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Netlify Docs](https://docs.netlify.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

## ✅ Checklist Pre-Despliegue

- [ ] Configuración de Firebase completada
- [ ] Todas las colecciones de Firestore creadas
- [ ] Autenticación habilitada en Firebase
- [ ] Reglas de Firestore configuradas correctamente
- [ ] archivo `firebase.js` tiene credenciales reales
- [ ] Sitio probado localmente
- [ ] Todas las bitácoras funcionan correctamente
- [ ] Responsividad verificada en múltiples dispositivos
- [ ] Enlaces de logout funcionando
- [ ] Mensajes de error claros

## 📝 Comentarios del Código

Todo el código está comentado en español:

- Headers de archivos explicando su función
- Funciones documentadas
- Secciones de CSS agrupadas por tema
- Instrucciones de configuración en Firebase.js

## 🎓 Conceptos Educativos Implementados

1. **Autenticación**: Validación segura con Firebase
2. **Autorización**: Sistema de roles (Admin/Usuario)
3. **Auditoría**: Tres bitácoras independientes
4. **Seguridad**: Registro de intentos fallidos y sesiones
5. **Responsive Design**: Mobile-first con media queries
6. **Glassmorphism**: Diseño moderno con efectos visuales
7. **Single Page Application**: Enrutamiento sin página de recarga
8. **API Real**: Obtención de IP con API pública

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

## 🤝 Soporte

Para reportar bugs o sugerir mejoras, contacta al desarrollador.

---

**Desarrollado con ❤️ para Café Aroma**

Última actualización: Abril 2026
