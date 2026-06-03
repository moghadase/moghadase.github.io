/* =========================================================
   Moghadaseh Ahmadi — shared site behaviour
   (theme + mode switcher, mobile menu, year, scroll reveal)
   Used by every page so behaviour stays identical site-wide.
   ========================================================= */

/* -------- Theme + mode switcher -------- */
(function () {
  const TKEY = 'site-theme-v2';
  const MKEY = 'site-mode-v2';
  const html = document.documentElement;
  const dots = document.querySelectorAll('.theme-dots span[data-set]');
  const toggle = document.getElementById('modeToggle');
  const themeColors = {
    'rose-light':       '#fff5f7',
    'rose-dark':        '#14080c',
    'albatross-light':  '#eef4f8',
    'albatross-dark':   '#060f18',
    'mono-light':       '#ffffff',
    'mono-dark':        '#0a0a0a'
  };

  function applyTheme(name) {
    html.setAttribute('data-theme', name);
    dots.forEach(d => d.classList.toggle('is-active', d.dataset.set === name));
    updateThemeColor();
    try { localStorage.setItem(TKEY, name); } catch (_) {}
  }
  function applyMode(mode) {
    html.setAttribute('data-mode', mode);
    updateThemeColor();
    try { localStorage.setItem(MKEY, mode); } catch (_) {}
  }
  function updateThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const key = html.getAttribute('data-theme') + '-' + html.getAttribute('data-mode');
    meta.setAttribute('content', themeColors[key] || '#060f18');
  }

  // Restore saved preferences
  try {
    const t = localStorage.getItem(TKEY);
    if (t && ['rose','albatross','mono'].includes(t)) applyTheme(t);
    const m = localStorage.getItem(MKEY);
    if (m && ['light','dark'].includes(m)) applyMode(m);
  } catch (_) {}

  // Sync the active dot even if no saved theme
  dots.forEach(d => d.classList.toggle('is-active', d.dataset.set === html.getAttribute('data-theme')));

  // Wire up
  dots.forEach(d => d.addEventListener('click', () => applyTheme(d.dataset.set)));
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = html.getAttribute('data-mode') === 'dark' ? 'light' : 'dark';
      applyMode(next);
    });
  }
})();

/* -------- Mobile menu -------- */
(function () {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
  });
  menu.querySelectorAll('[data-close]').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });
})();

/* -------- Footer year -------- */
(function () {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* -------- Scroll reveal -------- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const targets = [
    '.hero-meta', '.hero h1', '.hero-photo', '.hero-tag', '.hero-lead',
    '.hero-cta', '.hero-stat', '.section-head', '.about-lead', '.about-card',
    '.research-card', '.tl-item', '.pub', '.edu-card', '.honor-col',
    '.honor-list li', '.lang-item', '.lang-strip', '.contact h2',
    '.contact .lead', '.channel', '.footer-meta',
    /* sub-page targets */
    '.page-hero-inner', '.prose > *', '.pull-quote', '.story-stat',
    '.talk-card', '.cv-block', '.read-next', '.fig'
  ].join(',');

  const nodes = document.querySelectorAll(targets);
  nodes.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', (i % 6) * 60 + 'ms');
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  nodes.forEach(n => io.observe(n));
})();
