# 📘 Guía completa — Portfolio Enrique Perrin (v2 Fusión)

## Estructura de archivos

```
enrique-perrin/
├── index.html        → Página de Inicio
├── galeria.html      → Galería de trabajos
├── contacto.html     → Página de contacto
├── admin.html        → Panel de administración
├── css/
│   └── main.css      → Estilos compartidos
└── js/
    ├── data.js       → Base de datos (localStorage)
    └── shared.js     → JS compartido (cursor, nav, etc.)
```

---

## 1. Ejecutar en local

### Opción A — Live Server (VS Code)
1. Instala VS Code + extensión "Live Server"
2. Clic derecho en `index.html` → "Open with Live Server"
3. Abre en `http://localhost:5500`

### Opción B — Python
```bash
cd enrique-perrin
python -m http.server 8000
# Abre: http://localhost:8000
```

### Opción C — Doble clic
Abre `index.html` directamente. Funciona para la mayoría de funciones.

---

## 2. Subir a internet

### 🆓 Gratis — Netlify Drop (más fácil)
1. Ve a https://app.netlify.com/drop
2. Arrastra y suelta la carpeta `enrique-perrin/`
3. Obtienes URL pública en segundos (ej: `enriqueperrin.netlify.app`)

### 🆓 Gratis — GitHub Pages
1. Crea repo en github.com
2. Sube todos los archivos
3. Settings → Pages → Branch: main → Save

### 💰 Dominio propio
- Compra en porkbun.com (~10€/año)
- Apunta a Netlify o Vercel

---

## 3. Acceso al panel de administración

- URL local: `http://localhost:5500/admin.html`
- URL publicada: `tudominio.com/admin.html`
- **Contraseña por defecto: `admin123`**
- Cámbiala en: Admin → Configuración → Cambiar contraseña

---

## 4. Cómo usar el panel

### 4.1 Configuración general
- Nombre, tagline, email, LinkedIn, ArtStation, URL del CV
- Toggle "disponible para trabajo"

### 4.2 Página de Inicio
Panel → **Página de Inicio**. Tiene 5 pestañas:
- **Hero**: badge, título, subtítulo, imagen
- **Sobre mí**: foto, texto, datos de tarjeta, párrafos
- **Stats**: los números del hero (3+, 5+, etc.)
- **Habilidades**: barras de % y tarjetas de especialidad
- **Secciones**: activar/desactivar secciones completas

### 4.3 Proyectos
Panel → **Proyectos** → botón **+ Nuevo**
- Título, descripción, imagen (URL), categoría, tamaño en grid, tags, enlace

Tamaños:
- `Grande (7/12)` → ocupa más de la mitad
- `Estrecho (5/12)` → complementa al grande
- `Medio (6/12)` → mitad del ancho

### 4.4 Galería
Panel → **Galería** → pestaña **Imágenes**
1. Pega URL de imagen (Imgur, Google Drive, Cloudinary…)
2. Pon descripción y categoría
3. Clic **Añadir**

Para crear categorías: pestaña **Categorías** → añade ID y nombre

### 4.5 Contacto
Panel → **Contacto**
- Edita el texto introductorio, email, LinkedIn, ArtStation, URL del CV

### 4.6 Gameplays
Panel → **Gameplays**
- Activa la sección con el toggle
- Tipos soportados:
  - **YouTube**: pega el ID del vídeo (lo que va después de `?v=`)
  - **MP4**: URL directa al archivo
  - **GIF**: URL directa al gif
- Vista previa del embed de YouTube antes de guardar

---

## 5. Cómo subir imágenes

Los datos se guardan como URLs, no como archivos. Opciones gratuitas:

| Servicio | URL | Notas |
|----------|-----|-------|
| Imgur    | imgur.com | Sube y copia enlace directo |
| Cloudinary | cloudinary.com | Plan gratuito generoso |
| GitHub   | github.com | Sube a un repo público, copia raw URL |

---

## 6. Backup y migración

Los datos se guardan en el **localStorage del navegador**.

### Exportar (backup)
Admin → Dashboard → **Exportar JSON**
Guarda el archivo `.json` como copia de seguridad.

### Importar (migrar o restaurar)
Admin → Dashboard → **Importar JSON**
Selecciona el archivo exportado anteriormente.

---

## 7. Mejoras de esta versión fusionada

### Problemas corregidos de la versión original:
- ✅ **Fix móvil "Sobre mí"**: La tarjeta ya no se queda fija/sticky bloqueando el scroll. En móvil se muestra como tarjeta horizontal compacta con foto circular
- ✅ **Cursor personalizado**: Solo activo en dispositivos con ratón, no en táctil
- ✅ **Filtro de galería sin huecos**: Re-renderiza solo las imágenes visibles
- ✅ **Navegación responsive**: Menú hamburger fluido y limpio

### Mejoras respecto a las dos versiones:
- 🆕 Lightbox en galería con navegación anterior/siguiente y atajos de teclado
- 🆕 Contador de imágenes por categoría en filtros
- 🆕 Panel admin unificado con gestión de Contacto
- 🆕 Preview de embeds de YouTube en tiempo real antes de guardar
- 🆕 Edición de tarjetas de especialidades desde el panel
- 🆕 Sistema de secciones con toggle activo/inactivo
- 🆕 Gestión de estadísticas del hero desde el panel
- 🆕 Badge de disponibilidad dinámico en la página de contacto

---

## 8. Mantenimiento sin tocar código

**Todo** se gestiona desde `admin.html`:
- Textos → Sí
- Imágenes → Sí (por URL)
- Proyectos → Sí
- Galería → Sí
- Contacto → Sí
- Gameplays/multimedia → Sí

Para actualizar la web publicada: re-sube los archivos a Netlify o GitHub. Los datos del panel **no se pierden** al actualizar el código (están en localStorage del navegador del visitante... bueno, en tu caso en el tuyo cuando administras). Si cambias de ordenador, exporta e importa el JSON.

---

**Versión**: 2.0 Fusión · 2025
