// CMS localStorage utilities — shared between admin.jsx and main.jsx

const K = {
  cases:    'bt_cms_cases',
  faq:      'bt_cms_faq',
  contacts: 'bt_cms_contacts',
};

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
