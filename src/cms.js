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
  try { return localStorage.getItem(articleBodyKey(slug)) || null; }
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
