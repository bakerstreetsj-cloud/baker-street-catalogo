/* ============================================================
   BAKER STREET — SHARED.JS
   Lógica compartida por todas las páginas:
   - Inyección de header y footer
   - Toggle de menú mobile
   - Lógica de portadas (Open Library)
   - Lógica de modal
   - Helpers globales
   ============================================================ */

// ── CONFIGURACIÓN GLOBAL ─────────────────────────────────────
const BS = {
  WSP_NUMBER: '5492644000000', // Reemplazar con número real
  INSTAGRAM:  'https://instagram.com/bakerstreet.sj',
  OPEN_LIB:   'https://openlibrary.org/search.json',
  COVER_BASE: 'https://covers.openlibrary.org/b',
};

// ── SVG DEL LOGO (Sherlock silueta) ──────────────────────────
const LOGO_SVG = `<svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M62 11C50 8 37 15 32 26 27 35 30 47 37 53 29 57 24 65 22 74L19 88C18 93 23 97 28 97L72 97C77 97 82 93 81 88L78 74C76 65 71 57 63 53 70 47 73 35 68 26 63 17 74 14 62 11ZM46 55C39 52 33 45 35 37 37 28 46 22 55 23 64 24 70 32 69 41 68 48 61 55 54 55ZM38 67C40 60 47 56 55 56 63 56 70 60 72 67L74 83 26 83Z"/>
</svg>`;

// ── INYECTAR HEADER ──────────────────────────────────────────
function injectHeader(activePage) {
  const nav = [
    { href: '/index.html',          label: 'Inicio',           key: 'home' },
    { href: '/pedidos/index.html',  label: 'Libros a Pedido',  key: 'pedidos' },
    { href: '/stock/index.html',    label: 'Stock Inmediato',  key: 'stock',  soon: true },
    { href: '/quienes-somos/index.html', label: 'Quiénes Somos', key: 'quienes', soon: true },
  ];

  const links = nav.map(item => {
    const isActive  = item.key === activePage;
    const isSoon    = item.soon && !isActive;
    const cls = [
      'bs-nav__link',
      isActive ? 'bs-nav__link--active' : '',
      isSoon   ? 'bs-nav__link--disabled bs-nav__link--soon' : '',
    ].filter(Boolean).join(' ');
    return `<a href="${item.href}" class="${cls}">${item.label}</a>`;
  }).join('');

  const html = `
    <header class="bs-header" id="bs-header">
      <div class="bs-header__inner">
        <a class="bs-logo" href="/index.html">
          <div class="bs-logo__circle">${LOGO_SVG.replace('currentColor','#0A0A0A')}</div>
          <div class="bs-logo__text">
            <span class="bs-logo__name">Baker Street</span>
            <span class="bs-logo__sub">Librería · San Juan</span>
          </div>
        </a>
        <nav class="bs-nav" id="bs-nav">${links}</nav>
        <button class="bs-nav__toggle" id="bs-nav-toggle" aria-label="Menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        </button>
      </div>
    </header>`;

  document.body.insertAdjacentHTML('afterbegin', html);

  // Toggle mobile
  const toggle = document.getElementById('bs-nav-toggle');
  const navEl  = document.getElementById('bs-nav');
  toggle?.addEventListener('click', () => {
    navEl.classList.toggle('bs-nav--open');
  });
  // Cerrar al hacer clic en un link
  navEl?.querySelectorAll('.bs-nav__link').forEach(l => {
    l.addEventListener('click', () => navEl.classList.remove('bs-nav--open'));
  });
}

// ── INYECTAR FOOTER ──────────────────────────────────────────
function injectFooter() {
  const html = `
    <footer class="bs-footer">
      <div class="bs-footer__inner">
        <div class="bs-footer__brand">
          <a class="bs-logo" href="/index.html">
            <div class="bs-logo__circle" style="width:36px;height:36px">
              ${LOGO_SVG.replace('currentColor','#0A0A0A')}
            </div>
            <div class="bs-logo__text">
              <span class="bs-logo__name" style="font-size:15px">Baker Street</span>
              <span class="bs-logo__sub">Librería · San Juan</span>
            </div>
          </a>
          <p class="bs-footer__tagline">Libros nuevos y originales a precios accesibles.</p>
          <p class="bs-footer__desc">Desde 2020 llevando la lectura a San Juan en ferias, eventos y ahora también a tu puerta.</p>
        </div>
        <div>
          <p class="bs-footer__col-title">Catálogo</p>
          <div class="bs-footer__links">
            <a class="bs-footer__link" href="/pedidos/index.html">Libros a Pedido</a>
            <a class="bs-footer__link bs-footer__link--disabled" href="#">Stock Inmediato</a>
          </div>
        </div>
        <div>
          <p class="bs-footer__col-title">Baker Street</p>
          <div class="bs-footer__links">
            <a class="bs-footer__link bs-footer__link--disabled" href="#">Quiénes Somos</a>
            <a class="bs-footer__link bs-footer__link--disabled" href="#">Slam Reloj de Arena</a>
            <a class="bs-footer__link" href="${BS.INSTAGRAM}" target="_blank">Instagram</a>
          </div>
        </div>
      </div>
      <div class="bs-footer__bottom">
        <span class="bs-footer__copy">© 2025 Baker Street · San Juan, Argentina · Solo libros nuevos y originales</span>
        <div class="bs-footer__social">
          <a class="bs-footer__social-link" href="${BS.INSTAGRAM}" target="_blank" title="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a class="bs-footer__social-link" href="https://wa.me/${BS.WSP_NUMBER}" target="_blank" title="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.524 5.837L.057 23.012a.75.75 0 00.931.931l5.175-1.467A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22A10 10 0 112.144 7.387l-.27-.479.867-3.06 3.06.867-.48-.27A10 10 0 0112 22z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>`;

  document.body.insertAdjacentHTML('beforeend', html);
}

// ── PORTADAS: OPEN LIBRARY ────────────────────────────────────
const coverCache = {};

async function fetchCover(titulo, autor, isbn) {
  const key = isbn || `${titulo}|${autor}`;
  if (coverCache[key] !== undefined) return coverCache[key];
  coverCache[key] = null; // marca en progreso

  try {
    // Si tiene ISBN, directo al CDN de Open Library
    if (isbn) {
      const url = `${BS.COVER_BASE}/isbn/${isbn}-M.jpg`;
      coverCache[key] = url;
      return url;
    }

    // Buscar por título + autor
    const q = encodeURIComponent(`${titulo} ${autor.split(',')[0]}`);
    const res  = await fetch(`${BS.OPEN_LIB}?q=${q}&limit=1&fields=cover_i,title`);
    const data = await res.json();
    const coverId = data.docs?.[0]?.cover_i;

    if (coverId) {
      const url = `${BS.COVER_BASE}/id/${coverId}-M.jpg`;
      coverCache[key] = url;
      return url;
    }
  } catch(e) { /* silencioso */ }

  coverCache[key] = '';
  return '';
}

// ── PLACEHOLDER HTML ─────────────────────────────────────────
function placeholderHTML(titulo) {
  const escaped = (titulo || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `
    <div class="book-card__placeholder">
      <div class="book-card__placeholder-logo">
        ${LOGO_SVG.replace('currentColor','#0A0A0A')}
      </div>
      <span class="book-card__placeholder-title">${escaped}</span>
    </div>`;
}

// ── MODAL ─────────────────────────────────────────────────────
let modalOverlay = null;

function initModal() {
  modalOverlay = document.createElement('div');
  modalOverlay.className = 'bs-modal-overlay';
  modalOverlay.id = 'bs-modal-overlay';
  modalOverlay.innerHTML = `
    <div class="bs-modal" id="bs-modal" role="dialog" aria-modal="true">
      <button class="bs-modal__close" id="bs-modal-close" aria-label="Cerrar">×</button>
      <div class="bs-modal__cover" id="bs-modal-cover"></div>
      <div class="bs-modal__info" id="bs-modal-info"></div>
    </div>`;
  document.body.appendChild(modalOverlay);

  document.getElementById('bs-modal-close').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function closeModal() {
  modalOverlay?.classList.remove('bs-modal-overlay--open');
  document.body.style.overflow = '';
}

async function openModal(book) {
  if (!modalOverlay) initModal();
  const overlay   = document.getElementById('bs-modal-overlay');
  const coverEl   = document.getElementById('bs-modal-cover');
  const infoEl    = document.getElementById('bs-modal-info');

  overlay.classList.add('bs-modal-overlay--open');
  document.body.style.overflow = 'hidden';

  // Portada
  const coverSrc = book.portadaUrl || await fetchCover(book.titulo, book.autor, book.isbn);
  coverEl.innerHTML = coverSrc
    ? `<img src="${coverSrc}" alt="${esc(book.titulo)}" onerror="this.parentElement.innerHTML=placeholderHTML('${esc(book.titulo)}')">`
    : placeholderHTML(book.titulo);

  // Precio
  const precio = fmt(book.precio);

  // Mensaje WhatsApp pre-llenado
  const wspMsg = encodeURIComponent(
    `Hola Baker Street, quiero encargar:\n*${book.titulo}* — ${book.autor}\nPrecio: ${precio}\n\n¿Está disponible?`
  );

  // Meta extras
  const metaItems = [
    book.editorial ? metaItem('Editorial', book.editorial) : '',
    book.paginas   ? metaItem('Páginas',   book.paginas)   : '',
    book.genero    ? metaItem('Género',     book.genero)    : '',
  ].filter(Boolean).join('');

  infoEl.innerHTML = `
    <span class="tag tag--genre">${esc(book.genero)}</span>
    <h2 class="bs-modal__title">${esc(book.titulo)}</h2>
    <p class="bs-modal__author">${esc(book.autor)}</p>
    ${metaItems ? `<div class="bs-modal__meta">${metaItems}</div>` : ''}
    <div class="bs-modal__price-block">
      <span class="bs-modal__price-label">Precio Baker Street</span>
      <span class="bs-modal__price">${precio}</span>
    </div>
    <div id="modal-desc" class="bs-modal__desc bs-modal__desc--loading">Buscando descripción…</div>
    <div class="bs-modal__actions">
      <a class="btn btn--wsp btn--lg"
         href="https://wa.me/${BS.WSP_NUMBER}?text=${wspMsg}"
         target="_blank">
        ${wspIcon()}
        Encargar este libro
      </a>
    </div>`;

  // Buscar descripción en Open Library
  loadDesc(book, document.getElementById('modal-desc'));
}

async function loadDesc(book, el) {
  if (!el) return;

  // Si tiene reseña manual, usarla
  if (book.resena) {
    el.textContent = book.resena;
    el.classList.remove('bs-modal__desc--loading');
    return;
  }

  try {
    const q = encodeURIComponent(`${book.titulo} ${book.autor.split(',')[0]}`);
    const res  = await fetch(`${BS.OPEN_LIB}?q=${q}&limit=1&fields=key,first_sentence`);
    const data = await res.json();
    const desc = data.docs?.[0]?.first_sentence?.value
              || data.docs?.[0]?.first_sentence;

    el.textContent = desc
      ? String(desc).substring(0, 500) + (String(desc).length > 500 ? '…' : '')
      : 'Sin descripción disponible.';
  } catch {
    el.textContent = 'Sin descripción disponible.';
  }
  el.classList.remove('bs-modal__desc--loading');
}

function metaItem(label, value) {
  return `
    <div class="bs-modal__meta-item">
      <span class="bs-modal__meta-label">${label}</span>
      <span class="bs-modal__meta-value">${esc(String(value))}</span>
    </div>`;
}

// ── HELPERS ───────────────────────────────────────────────────
function fmt(n) {
  return '$' + Math.round(n || 0).toLocaleString('es-AR');
}

function esc(s) {
  return String(s || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function wspIcon() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.524 5.837L.057 23.012a.75.75 0 00.931.931l5.175-1.467A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22A10 10 0 112.144 7.387l-.27-.479.867-3.06 3.06.867-.48-.27A10 10 0 0112 22z"/>
  </svg>`;
}

// ── LEER GOOGLE SHEETS ────────────────────────────────────────
async function loadSheet(sheetId, sheetName, colMap) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res  = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substring(47, text.length - 2));

  return json.table.rows
    .slice(2) // saltar header y hints
    .map(r => {
      const get = i => {
        try { return r.c[i]?.v?.toString().trim() || ''; }
        catch { return ''; }
      };
      return {
        titulo:     get(colMap.titulo),
        autor:      get(colMap.autor),
        genero:     get(colMap.genero),
        precio:     parseFloat(get(colMap.precio).replace(/[^0-9.]/g,'')) || 0,
        disponible: !['false','no','0'].includes(get(colMap.disponible).toLowerCase()),
        isbn:       get(colMap.isbn)       || '',
        portadaUrl: get(colMap.portadaUrl) || '',
        resena:     get(colMap.resena)     || '',
      };
    })
    .filter(b => b.titulo && b.disponible && b.precio > 0);
}
