// CMS localStorage utilities — shared between admin.jsx and main.jsx

const K = {
  cases:       'bt_cms_cases',
  faq:         'bt_cms_faq',
  contacts:    'bt_cms_contacts',
  blogPosts:   'bt_cms_blog_posts',
  newArticles: 'bt_cms_new_articles',
};

function articleBodyKey(slug) { return `bt_cms_body_${slug}`; }

function read(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}

function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) {}
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

// Hydrates the browser cache from the persistent CMS response. The response is
// authoritative: empty arrays/objects are valid values, and article bodies that
// disappeared from the server must also disappear from localStorage.
export function hydrateCmsStorage(data) {
  if (!data || typeof data !== 'object') return false;

  const sections = [
    ['cases', K.cases],
    ['faq', K.faq],
    ['contacts', K.contacts],
    ['blogPosts', K.blogPosts],
    ['newArticles', K.newArticles],
  ];
  let changed = false;

  for (const [section, key] of sections) {
    if (!hasOwn(data, section)) continue;
    try {
      const next = JSON.stringify(data[section]);
      if (localStorage.getItem(key) !== next) {
        localStorage.setItem(key, next);
        changed = true;
      }
    } catch (_) {}
  }

  if (hasOwn(data, 'articleBodies') && data.articleBodies && typeof data.articleBodies === 'object') {
    const bodies = data.articleBodies;
    const expectedKeys = new Set(
      Object.entries(bodies)
        .filter(([, html]) => typeof html === 'string' && html.trim())
        .map(([slug]) => articleBodyKey(slug)),
    );

    try {
      for (let index = localStorage.length - 1; index >= 0; index -= 1) {
        const key = localStorage.key(index);
        if (key?.startsWith('bt_cms_body_') && !expectedKeys.has(key)) {
          localStorage.removeItem(key);
          changed = true;
        }
      }

      for (const [slug, html] of Object.entries(bodies)) {
        if (typeof html !== 'string' || !html.trim()) continue;
        const key = articleBodyKey(slug);
        if (localStorage.getItem(key) !== html) {
          localStorage.setItem(key, html);
          changed = true;
        }
      }
    } catch (_) {}
  }

  return changed;
}

// Cases
export function getCmsCases(fallback) {
  const v = read(K.cases);
  return v ?? fallback ?? null;
}
export function saveCmsCases(data) { write(K.cases, data); }
export function resetCmsCases()    { localStorage.removeItem(K.cases); }

// FAQ (generalFaqCategories — array of { title, questions: [[q,a],...] })
export function getCmsFaq(fallback) {
  const v = read(K.faq);
  return v ?? fallback ?? null;
}
export function saveCmsFaq(data) { write(K.faq, data); }
export function resetCmsFaq()    { localStorage.removeItem(K.faq); }

// Contacts
export function getCmsContacts() { return read(K.contacts); }
export function saveCmsContacts(data) { write(K.contacts, data); }
export function resetCmsContacts()    { localStorage.removeItem(K.contacts); }

// Blog post metadata list (replaces/extends blogPosts on blog listing)
export function getCmsBlogPosts(fallback) {
  const v = read(K.blogPosts);
  return v ?? fallback ?? null;
}
export function saveCmsBlogPosts(data) { write(K.blogPosts, data); }
export function resetCmsBlogPosts()    { localStorage.removeItem(K.blogPosts); }

// Article body HTML overrides (keyed by slug)
export function getCmsArticleBody(slug) {
  try {
    // ?bt_original=1 — служебный флаг админки: страница рендерит исходный
    // текст из кода, игнорируя CMS-версию (нужно для загрузки оригинала в редактор)
    if (typeof window !== 'undefined' && window.location.search.includes('bt_original')) return null;
    return localStorage.getItem(articleBodyKey(slug)) || null;
  }
  catch { return null; }
}
export function saveCmsArticleBody(slug, html) {
  try {
    if (html.trim()) localStorage.setItem(articleBodyKey(slug), html);
    else localStorage.removeItem(articleBodyKey(slug));
  } catch (_) {}
}

// New articles created entirely in admin (not hardcoded in code)
export function getCmsNewArticles() { return read(K.newArticles) || []; }
export function saveCmsNewArticles(data) { write(K.newArticles, data); }
