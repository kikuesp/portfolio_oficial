/* =====================================================
   SHARED.JS — JavaScript compartido — Versión fusión
   ===================================================== */

/* ─── CURSOR PERSONALIZADO (solo desktop con ratón) ─── */
function initCursor() {
  // Solo activar si el dispositivo tiene puntero de precisión (ratón, no táctil)
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cur  = document.getElementById('cur');
  const curR = document.getElementById('cur-r');
  if (!cur || !curR) return;
  cur.style.display  = 'block';
  curR.style.display = 'block';
  document.body.style.cursor = 'none';
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function tick() {
    cur.style.left  = mx + 'px';
    cur.style.top   = my + 'px';
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    curR.style.left = rx + 'px';
    curR.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();
  function addHover(els) {
    els.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }
  addHover(document.querySelectorAll('a, button, .proj-card, .gal-item, .exp-card, .tool-chip'));
  // Observer para elementos añadidos dinámicamente
  new MutationObserver(() => {
    addHover(document.querySelectorAll('a:not([data-hovered]), button:not([data-hovered])'));
  }).observe(document.body, { childList: true, subtree: true });
}

/* ─── NAVEGACIÓN ─── */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  const btn  = document.getElementById('navHamburger');
  const menu = document.getElementById('navMobile');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const open = btn.classList.toggle('open');
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  // Marcar enlace activo
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
}

/* ─── REVEAL AL SCROLL ─── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }, i * 60);
      }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => obs.observe(el));
}

/* ─── BARRAS DE HABILIDAD ─── */
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(b => {
          b.style.width = b.dataset.w + '%';
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.skills-section').forEach(el => obs.observe(el));
}

/* ─── FORMULARIO CONTACTO ─── */
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  const txt = document.getElementById('submitTxt');
  if (!txt || !btn) return;
  txt.textContent = '¡Enviado correctamente! ✓';
  btn.style.background = 'var(--accent2)';
  btn.disabled = true;
  setTimeout(() => {
    txt.textContent = 'Enviar mensaje';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3500);
}

/* ─── FOOTER DINÁMICO ─── */
function renderFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  const db = getDB();
  const cfg = db.config || {};
  const links = cfg.socialLinks || [];
  const visibleLinks = links.filter(l => l.visible !== false);

  // Contenedor de enlaces
  let linksContainer = footer.querySelector('.footer-links');
  if (!linksContainer) {
    linksContainer = document.createElement('div');
    linksContainer.className = 'footer-links';
    linksContainer.style.cssText = 'display:flex;gap:1.5rem;flex-wrap:wrap;justify-content:center;';
    footer.appendChild(linksContainer);
  }
  linksContainer.innerHTML = visibleLinks.map(l =>
    `<a href="${l.url}" ${l.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${l.label}</a>`
  ).join('');
}

/* ─── INIT GLOBAL ─── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCursor();
  initReveal();
  initSkillBars();
  renderFooter();

  // Sincronizar desde nube si está configurada (en background, sin bloquear)
  if (typeof loadFromCloud === 'function' && typeof isCloudEnabled === 'function' && isCloudEnabled()) {
    loadFromCloud(
      function(db) {
        // Refrescar el footer con los datos de la nube
        renderFooter();
        // Disparar evento por si las páginas quieren re-renderizar
        document.dispatchEvent(new CustomEvent('dbSynced', { detail: db }));
      },
      function(err) { console.warn('[Cloud sync]', err); }
    );
  }
});
