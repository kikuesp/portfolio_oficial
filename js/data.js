/* =====================================================
   DATA.JS — Base de datos del portfolio
   Almacenamiento: JSONbin.io (nube) + localStorage (caché)
   ===================================================== */

const DB_KEY    = 'ep_portfolio_v2';
const CLOUD_KEY = 'ep_cloud_cfg';   // { apiKey, binId }

/* ── CONFIGURACIÓN DE NUBE ──────────────────────── */
function getCloudCfg() {
  try { return JSON.parse(localStorage.getItem(CLOUD_KEY)) || {}; }
  catch(e) { return {}; }
}
function setCloudCfg(cfg) {
  localStorage.setItem(CLOUD_KEY, JSON.stringify(cfg));
}
function isCloudEnabled() {
  const c = getCloudCfg();
  return !!(c.apiKey && c.binId);
}

/* ── LEER DB (sincrónico, desde caché local) ─────── */
function getDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return getDefaultDB();
}

/* Carga desde JSONbin y actualiza caché local.
   Devuelve Promise<db>. */
async function loadFromCloud(onSuccess, onError) {
  const { apiKey, binId } = getCloudCfg();
  if (!apiKey || !binId) {
    if (onError) onError('Sin configuración de nube');
    return;
  }
  try {
    const res = await fetch('https://api.jsonbin.io/v3/b/' + binId + '/latest', {
      headers: { 'X-Master-Key': apiKey }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    const db = json.record;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    if (onSuccess) onSuccess(db);
    return db;
  } catch(e) {
    if (onError) onError(e.message);
  }
}

/* ── GUARDAR DB ─────────────────────────────────── */
function saveDB(data) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    return true;
  } catch(e) { return false; }
}

/* Guarda en localStorage Y sube a JSONbin.
   Devuelve Promise<bool>. */
async function saveDBCloud(data) {
  saveDB(data);
  const { apiKey, binId } = getCloudCfg();
  if (!apiKey || !binId) return false;
  try {
    const res = await fetch('https://api.jsonbin.io/v3/b/' + binId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey
      },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch(e) {
    return false;
  }
}

/* Crea un nuevo bin en JSONbin con los datos actuales.
   Devuelve Promise<{binId}> o lanza error. */
async function createCloudBin(apiKey, initialData) {
  const res = await fetch('https://api.jsonbin.io/v3/b', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey,
      'X-Bin-Name': 'portfolio-ep',
      'X-Bin-Private': 'true'
    },
    body: JSON.stringify(initialData || getDB())
  });
  if (!res.ok) {
    const err = await res.json().catch(function(){ return {}; });
    throw new Error(err.message || 'HTTP ' + res.status);
  }
  const json = await res.json();
  return { binId: json.metadata.id };
}

/* ── RESET ──────────────────────────────────────── */
function resetDB() {
  localStorage.removeItem(DB_KEY);
  return getDefaultDB();
}

/* ── DEFAULT DATA ───────────────────────────────── */
function getDefaultDB() {
  return {
    config: {
      name: 'Enrique Perrin García',
      tagline: '3D Artist · Game Developer · Animator',
      email: 'enrique@email.com',
      linkedin: 'linkedin.com/in/enriqueperrin',
      artstation: 'artstation.com/enriqueperrin',
      cvUrl: '#',
      availableForWork: true,
      availableText: 'Buscando prácticas / empleo',
      socialLinks: [
        { id: 'sl1', label: 'LinkedIn',   url: 'https://linkedin.com/in/enriqueperrin', icon: '🔗', visible: true },
        { id: 'sl2', label: 'ArtStation', url: 'https://artstation.com/enriqueperrin',  icon: '🎨', visible: true },
        { id: 'sl3', label: 'Contacto',   url: 'contacto.html',                         icon: 'e️', visible: true }
      ]
    },
    home: {
      badge: 'Disponible para prácticas y trabajo',
      heroTitle: 'Enrique\nPerrin García',
      heroSubtitle: '3D Artist · Game Developer · Animator',
      heroDesc: 'Estudiante de Animación 3D y Entornos Interactivos con pasión por crear mundos, personajes y experiencias jugables memorables.',
      heroImage: 'https://cdn.b12.io/client_media/SgQdLLsD/ef3c0974-7d41-11f0-a7e3-0242ac110002-jpg-hero_image.png',
      stats: [
        { num: '3+', label: 'Áreas de especialización' },
        { num: '5+', label: 'Herramientas dominadas' },
        { num: '100%', label: 'Motivación y ganas' }
      ],
      sections: [
        {
          id: 'about', active: true, type: 'about',
          title: 'Quién soy y qué me mueve',
          photo: 'https://cdn.b12.io/client_media/SgQdLLsD/ef3c0974-7d41-11f0-a7e3-0242ac110002-jpg-hero_image.png',
          cardName: 'Enrique Perrin García',
          cardSub: '3D Artist & Game Developer',
          cardInfo: [
            { label: 'Especialidad', value: 'Animación 3D · Modelado' },
            { label: 'Idiomas', value: 'ES · EN' },
            { label: 'Disponibilidad', value: 'Inmediata' },
            { label: 'Ubicación', value: 'España' }
          ],
          cardStatus: 'Buscando prácticas / empleo',
          paragraphs: [
            '¡Hola! Soy <strong>Enrique Perrin</strong>, estudiante de <strong>Animación 3D y Entornos Interactivos</strong> con una gran pasión por el arte digital, el desarrollo de videojuegos y la cultura gamer.',
            'Me especializo en <strong>modelado 3D</strong>, <strong>animación</strong> y <strong>desarrollo de videojuegos</strong> desde cero, combinando creatividad artística con habilidades técnicas para crear proyectos originales e inmersivos.',
            'Me encanta dar vida a mundos, personajes y mecánicas que conecten con las personas. Soy una persona con <strong>iniciativa, visión creativa y muchas ganas de crecer</strong> en la industria del videojuego.'
          ],
          skills: [
            { name: 'Modelado 3D', pct: 85 },
            { name: 'Desarrollo de videojuegos', pct: 75 },
            { name: 'Animación 3D', pct: 78 },
            { name: 'Diseño de entornos', pct: 70 }
          ],
          tools: ['🟠 Blender','⬛ Unity','🔵 Unreal Engine','🔷 Maya','🟤 ZBrush']
        },
        { id: 'projects', active: true, type: 'projects', title: 'Mi trabajo', eyebrow: 'Proyectos' },
        {
          id: 'skills', active: true, type: 'skills',
          title: 'Qué puedo aportarte', eyebrow: 'Especialidades',
          cards: [
            { icon: '🎯', title: 'Modelado 3D', desc: 'Creación de assets 3D de calidad profesional, desde concept hasta modelo final optimizado para videojuegos o render.', tools: ['Blender','ZBrush','Maya','UV Mapping','PBR'] },
            { icon: '🎮', title: 'Game Development', desc: 'Desarrollo de videojuegos desde cero: diseño de mecánicas, prototipado rápido, integración de assets y scripting.', tools: ['Unity','Unreal Engine','C#','Blueprints','Level Design'] },
            { icon: '✨', title: 'Animación 3D', desc: 'Animación de personajes y objetos: rigging, skinning, keyframe animation y ciclos de movimiento para videojuegos.', tools: ['Blender','Maya','Rigging','Skinning','Keyframe'] }
          ]
        }
      ]
    },
    contact: {
      intro: 'Si buscas un perfil creativo, técnico y con muchas ganas de aprender, no dudes en escribirme. Estoy disponible para <strong>prácticas y oportunidades laborales</strong> en la industria del videojuego y la animación.',
      email: 'enrique@email.com',
      linkedin: 'linkedin.com/in/enriqueperrin',
      artstation: 'artstation.com/enriqueperrin',
      cvUrl: '#'
    },
    gallery: {
      categories: [
        { id: 'cat1', name: 'Modelado 3D' },
        { id: 'cat2', name: 'Game Dev' },
        { id: 'cat3', name: 'Entornos' },
        { id: 'cat4', name: 'Personajes' },
        { id: 'cat5', name: 'Arte Digital' }
      ],
      images: [
        { id: 'img1', src: 'https://cdn.b12.io/client_media/SgQdLLsD/eee193ec-3e60-11f0-b1c5-0242ac110002-png-hero_image.png', alt: 'Modelado 3D', cat: 'cat1' },
        { id: 'img2', src: 'https://cdn.b12.io/client_media/SgQdLLsD/47718c32-3e67-11f0-aac8-0242ac110002-png-hero_image.png', alt: 'Game Dev', cat: 'cat2' },
        { id: 'img3', src: 'https://cdn.b12.io/client_media/SgQdLLsD/4d8a2b9c-3e67-11f0-8bf5-0242ac110002-png-hero_image.png', alt: 'Entornos', cat: 'cat3' },
        { id: 'img4', src: 'https://cdn.b12.io/client_media/SgQdLLsD/ef3c0974-7d41-11f0-a7e3-0242ac110002-jpg-hero_image.png', alt: 'Personaje', cat: 'cat4' },
        { id: 'img5', src: 'https://cdn.b12.io/client_media/SgQdLLsD/f28cebea-3e60-11f0-b1c5-0242ac110002-png-regular_image.png', alt: 'Arte Digital', cat: 'cat5' }
      ]
    },
    projects: [
      { id: 'p1', title: 'Modelado 3D para videojuegos', desc: 'Creación de modelos 3D de alto detalle optimizados para uso en tiempo real, incluyendo topología limpia, UV mapping y texturizado PBR.', img: 'https://cdn.b12.io/client_media/SgQdLLsD/eee193ec-3e60-11f0-b1c5-0242ac110002-png-hero_image.png', tags: ['3D','Blender'], cat: '3d', link: '#', size: 'wide', order: 1 },
      { id: 'p2', title: 'Desarrollo de videojuego completo', desc: 'Proyecto de videojuego desarrollado íntegramente: mecánicas, niveles, arte y programación.', img: 'https://cdn.b12.io/client_media/SgQdLLsD/47718c32-3e67-11f0-aac8-0242ac110002-png-hero_image.png', tags: ['Game Dev','Unity'], cat: 'game', link: '#', size: 'narrow', order: 2 },
      { id: 'p3', title: 'Entorno interactivo en Unreal', desc: 'Entorno interactivo con iluminación dinámica y assets propios creados desde cero.', img: 'https://cdn.b12.io/client_media/SgQdLLsD/4d8a2b9c-3e67-11f0-8bf5-0242ac110002-png-hero_image.png', tags: ['Entornos','Unreal Engine'], cat: 'anim', link: '#', size: 'half', order: 3 },
      { id: 'p4', title: 'Sculpting de personaje en ZBrush', desc: 'Escultura digital de personaje con anatomía detallada, retopología y texturizado final.', img: 'https://cdn.b12.io/client_media/SgQdLLsD/ef3c0974-7d41-11f0-a7e3-0242ac110002-jpg-hero_image.png', tags: ['Personaje','ZBrush'], cat: '3d', link: '#', size: 'half', order: 4 }
    ],
    gameplays: {
      active: false,
      title: 'Gameplays & Demos',
      eyebrow: 'Multimedia',
      items: []
    }
  };
}

/* ── EXPORT / IMPORT ────────────────────────────── */
function exportDB() {
  const blob = new Blob([JSON.stringify(getDB(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio-backup-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
}
function importDB(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    saveDB(parsed);
    return true;
  } catch(e) { return false; }
}
