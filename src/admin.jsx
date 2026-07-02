import React from 'react';
import {
  getCmsCases,    saveCmsCases,    resetCmsCases,
  getCmsFaq,      saveCmsFaq,      resetCmsFaq,
  getCmsContacts, saveCmsContacts, resetCmsContacts,
  getCmsBlogPosts, saveCmsBlogPosts, resetCmsBlogPosts,
  getCmsArticleBody, saveCmsArticleBody,
  getCmsNewArticles, saveCmsNewArticles,
} from './cms.js';

// ── Storage helpers ────────────────────────────────────────────────────────────
const KEYS = {
  password: 'bt_admin_password',
  session:  'bt_admin_session',
  leads:    'bt_leads',
};
const DEFAULT_PASSWORD = 'Beltransit2024!';

function getPassword() {
  return localStorage.getItem(KEYS.password) || DEFAULT_PASSWORD;
}

function isAuthenticated() {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEYS.session) || '{}');
    return s.expires > Date.now();
  } catch { return false; }
}

function login(password) {
  if (password !== getPassword()) return false;
  sessionStorage.setItem(KEYS.session, JSON.stringify({
    expires: Date.now() + 8 * 60 * 60 * 1000,
  }));
  return true;
}

function logout() {
  sessionStorage.removeItem(KEYS.session);
}

// ── API helpers ────────────────────────────────────────────────────────────────

export async function saveLead(data) {
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (_) {}
}

async function apiGetLeads(password) {
  try {
    const r = await fetch('/api/leads', { headers: { 'x-admin-password': password } });
    return r.ok ? (await r.json()) : [];
  } catch { return []; }
}

async function apiSaveLeads(leads, password) {
  try {
    await fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(leads),
    });
  } catch (_) {}
}

async function apiClearLeads(password) {
  try {
    await fetch('/api/leads', { method: 'DELETE', headers: { 'x-admin-password': password } });
  } catch (_) {}
}

function apiSaveCmsSection(section, data, key) {
  const password = getPassword();
  fetch('/api/cms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
    body: JSON.stringify({ section, data, key }),
  }).catch(() => {});
}

function hydrateCmsLocalStorage(data) {
  if (!data) return;
  if (data.cases)       saveCmsCases(data.cases);
  if (data.faq)         saveCmsFaq(data.faq);
  if (data.contacts)    saveCmsContacts(data.contacts);
  if (data.blogPosts)   saveCmsBlogPosts(data.blogPosts);
  if (data.newArticles) saveCmsNewArticles(data.newArticles);
  if (data.articleBodies) {
    Object.entries(data.articleBodies).forEach(([slug, html]) => {
      saveCmsArticleBody(slug, html || '');
    });
  }
}

// ── Design tokens (inline — fully isolated from site CSS) ─────────────────────
const C = {
  bg:       '#0f1115',
  surface:  '#161b22',
  raised:   '#1f2430',
  border:   'rgba(255,255,255,0.08)',
  orange:   '#f36b21',
  orangeD:  '#d45c18',
  text:     '#e6edf3',
  muted:    '#8b949e',
  green:    '#2ea043',
  yellow:   '#d29922',
  red:      '#da3633',
  blue:     '#388bfd',
};

const F = {
  base: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"SFMono-Regular", Consolas, monospace',
};

// ── Utility styles ─────────────────────────────────────────────────────────────
const s = {
  root: {
    minHeight: '100vh',
    background: C.bg,
    color: C.text,
    fontFamily: F.base,
    fontSize: 14,
    lineHeight: 1.5,
    display: 'flex',
  },
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: C.surface,
    borderRight: `1px solid ${C.border}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  sidebarLogo: {
    padding: '20px 20px 16px',
    borderBottom: `1px solid ${C.border}`,
  },
  sidebarBrand: {
    fontSize: 15,
    fontWeight: 700,
    color: C.text,
    letterSpacing: '0.02em',
  },
  sidebarSub: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
  },
  navSection: {
    padding: '12px 8px',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '4px 12px 6px',
  },
  navItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    marginBottom: 2,
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    color: active ? C.text : C.muted,
    background: active ? C.raised : 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.15s',
  }),
  sidebarFooter: {
    padding: 12,
    borderTop: `1px solid ${C.border}`,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    color: C.muted,
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    minWidth: 0,
  },
  header: {
    padding: '20px 28px 0',
    borderBottom: `1px solid ${C.border}`,
    paddingBottom: 18,
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: C.text,
    margin: 0,
  },
  pageDesc: {
    fontSize: 13,
    color: C.muted,
    marginTop: 4,
  },
  main: {
    padding: '0 28px 40px',
  },
  card: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: '18px 20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 14,
    marginBottom: 28,
  },
  statCard: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: '16px 18px',
  },
  statVal: {
    fontSize: 28,
    fontWeight: 700,
    color: C.text,
    lineHeight: 1.1,
  },
  statLabel: {
    fontSize: 12,
    color: C.muted,
    marginTop: 4,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: '10px 14px',
    fontSize: 11,
    fontWeight: 600,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    borderBottom: `1px solid ${C.border}`,
    background: C.surface,
  },
  td: {
    padding: '11px 14px',
    borderBottom: `1px solid rgba(255,255,255,0.04)`,
    verticalAlign: 'top',
    color: C.text,
  },
  badge: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    background: color + '22',
    color: color,
    border: `1px solid ${color}44`,
    whiteSpace: 'nowrap',
  }),
  btn: (variant = 'default') => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: variant === 'sm' ? '4px 10px' : '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: variant === 'sm' ? 12 : 14,
    fontWeight: 500,
    border: variant === 'primary'
      ? 'none'
      : `1px solid ${C.border}`,
    background: variant === 'primary'
      ? C.orange
      : variant === 'danger'
        ? 'rgba(218,54,51,0.15)'
        : C.raised,
    color: variant === 'primary'
      ? '#fff'
      : variant === 'danger'
        ? C.red
        : C.text,
    transition: 'opacity 0.15s',
  }),
  input: {
    background: C.raised,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 14,
    color: C.text,
    outline: 'none',
    width: '100%',
    fontFamily: F.base,
    boxSizing: 'border-box',
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'block',
    marginBottom: 6,
  },
  formGroup: {
    marginBottom: 18,
  },
  divider: {
    height: 1,
    background: C.border,
    margin: '20px 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: C.muted,
    fontSize: 14,
  },
  searchRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  pillTabs: {
    display: 'flex',
    gap: 6,
  },
  pill: (active) => ({
    padding: '5px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: active ? C.orange : C.raised,
    color: active ? '#fff' : C.muted,
  }),
};

// ── Icons (simple SVG, no deps) ────────────────────────────────────────────────
const Icon = ({ d, size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  leads:     'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  content:   'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  settings:  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
  logout:    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  trash:     'M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6',
  check:     'M20 6L9 17l-5-5',
  search:    'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  download:  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  refresh:   'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  eye:       'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  close:     'M18 6L6 18M6 6l12 12',
  alert:     'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
};

// ── Status helpers ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
  new:        { label: 'Новая',     color: C.blue },
  inProgress: { label: 'В работе',  color: C.yellow },
  done:       { label: 'Выполнено', color: C.green },
};

function StatusBadge({ status }) {
  const { label, color } = STATUS_MAP[status] || STATUS_MAP.new;
  return <span style={s.badge(color)}>{label}</span>;
}

// ── Format helpers ─────────────────────────────────────────────────────────────
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } catch { return iso || '—'; }
}

const FIELD_LABELS = {
  name: 'Имя', company: 'Компания', 'company-role': 'Должность',
  contact: 'Телефон / Telegram', message: 'Сообщение', comment: 'Комментарий',
  from: 'Откуда', pickup: 'Откуда забираем', cargo: 'Груз',
  'cargo-type': 'Тип товара', weight: 'Вес', amount: 'Сумма',
  country: 'Страна', 'origin-country': 'Страна происхождения',
  'supplier-country': 'Страна поставщика', 'supplier-countries': 'Страны',
  volume: 'Объём', 'monthly-volume': 'Объём/мес.', product: 'Товар',
};

// ── Login page ─────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (login(password)) {
        onLogin();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: C.bg, fontFamily: F.base,
    }}>
      <div style={{
        width: '100%', maxWidth: 380, padding: 40,
        background: C.surface, borderRadius: 14,
        border: `1px solid ${C.border}`,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.orange}, ${C.orangeD})`,
            display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: 16,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>
            BelTransit Admin
          </h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>
            Административная панель
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={s.formGroup}>
            <label style={s.label}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Введите пароль"
              autoFocus
              style={{
                ...s.input,
                borderColor: error ? C.red : C.border,
              }}
            />
            {error && (
              <p style={{ fontSize: 12, color: C.red, marginTop: 6 }}>
                Неверный пароль. Попробуйте ещё раз.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              ...s.btn('primary'),
              width: '100%', justifyContent: 'center',
              padding: '10px 16px', fontSize: 14,
              opacity: (loading || !password) ? 0.7 : 1,
            }}
          >
            {loading ? 'Проверяем...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Lead detail modal ──────────────────────────────────────────────────────────
function LeadModal({ lead, onClose, onStatusChange, onDelete }) {
  const RESERVED = ['id', 'ts', 'status', 'source'];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: 28, width: '100%', maxWidth: 520,
        maxHeight: '80vh', overflow: 'auto',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>
              Заявка #{lead.id.slice(-6).toUpperCase()}
            </h2>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
              {formatDate(lead.ts)}
            </p>
          </div>
          <button onClick={onClose} style={{ ...s.btn(), padding: '6px', border: 'none', background: 'transparent' }}>
            <Icon d={Icons.close} size={18} color={C.muted} />
          </button>
        </div>

        <div style={{ marginBottom: 18 }}>
          <span style={{ fontSize: 11, color: C.muted, marginRight: 8 }}>Источник:</span>
          <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{lead.source || '—'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {Object.entries(lead)
            .filter(([k]) => !RESERVED.includes(k) && lead[k])
            .map(([k, v]) => (
              <div key={k} style={{
                background: C.raised, borderRadius: 8,
                padding: '10px 14px',
                gridColumn: k === 'message' || k === 'comment' ? 'span 2' : undefined,
              }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>
                  {FIELD_LABELS[k] || k}
                </div>
                <div style={{ fontSize: 13, color: C.text, wordBreak: 'break-word' }}>{String(v)}</div>
              </div>
            ))}
        </div>

        <div style={s.divider} />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: C.muted, marginRight: 4 }}>Статус:</span>
          {Object.entries(STATUS_MAP).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => onStatusChange(key)}
              style={{
                ...s.badge(color),
                cursor: 'pointer',
                opacity: lead.status === key ? 1 : 0.45,
                border: lead.status === key ? `1px solid ${color}88` : `1px solid transparent`,
              }}
            >
              {label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={onDelete}
              style={{ ...s.btn('danger'), padding: '5px 12px', fontSize: 12 }}
            >
              <Icon d={Icons.trash} size={13} /> Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard page ─────────────────────────────────────────────────────────────
function DashboardPage({ leads }) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;

  const todayLeads = leads.filter(l => new Date(l.ts).getTime() >= todayStart);
  const weekLeads  = leads.filter(l => new Date(l.ts).getTime() >= weekStart);
  const newLeads   = leads.filter(l => l.status === 'new');

  const sourceCounts = leads.reduce((acc, l) => {
    if (l.source) acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {});
  const topSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recentLeads = leads.slice(0, 8);

  return (
    <>
      <div style={s.header}>
        <h1 style={s.pageTitle}>Дашборд</h1>
        <p style={s.pageDesc}>Обзор активности сайта BelTransit</p>
      </div>
      <div style={s.main}>
        <div style={s.statsGrid}>
          {[
            { val: leads.length, label: 'Всего заявок', color: C.blue },
            { val: newLeads.length, label: 'Новые (не обработаны)', color: C.orange },
            { val: todayLeads.length, label: 'Сегодня', color: C.green },
            { val: weekLeads.length, label: 'За 7 дней', color: C.yellow },
          ].map(({ val, label, color }) => (
            <div key={label} style={{
              ...s.statCard,
              borderTop: `3px solid ${color}`,
            }}>
              <div style={{ ...s.statVal, color }}>{val}</div>
              <div style={s.statLabel}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={s.card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '0 0 14px' }}>
              Топ источников заявок
            </h3>
            {topSources.length === 0 ? (
              <p style={{ color: C.muted, fontSize: 13 }}>Нет данных</p>
            ) : topSources.map(([src, cnt]) => (
              <div key={src} style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 10,
              }}>
                <span style={{ fontSize: 12, color: C.text, flex: 1, marginRight: 12, lineHeight: 1.3 }}>{src}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: Math.max(20, Math.min(80, cnt / (topSources[0]?.[1] || 1) * 80)),
                    height: 4, background: C.orange, borderRadius: 2,
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, minWidth: 20 }}>{cnt}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={s.card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '0 0 14px' }}>
              Статусы заявок
            </h3>
            {Object.entries(STATUS_MAP).map(([key, { label, color }]) => {
              const count = leads.filter(l => (l.status || 'new') === key).length;
              const pct = leads.length > 0 ? Math.round(count / leads.length * 100) : 0;
              return (
                <div key={key} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={s.badge(color)}>{label}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 4, background: C.raised, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: color, borderRadius: 2,
                      transition: 'width 0.4s',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {recentLeads.length > 0 && (
          <div style={{ ...s.card, marginTop: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '0 0 14px' }}>
              Последние заявки
            </h3>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Дата', 'Имя', 'Контакт', 'Источник', 'Статус'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentLeads.map(lead => (
                  <tr key={lead.id}>
                    <td style={{ ...s.td, fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{formatDate(lead.ts)}</td>
                    <td style={s.td}>{lead.name || '—'}</td>
                    <td style={{ ...s.td, fontFamily: F.mono, fontSize: 12 }}>{lead.contact || '—'}</td>
                    <td style={{ ...s.td, fontSize: 12, color: C.muted }}>{lead.source || '—'}</td>
                    <td style={s.td}><StatusBadge status={lead.status || 'new'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {leads.length === 0 && (
          <div style={{ ...s.card, ...s.emptyState }}>
            <Icon d={Icons.alert} size={32} color={C.muted} />
            <p style={{ marginTop: 12 }}>Заявок пока нет.</p>
            <p style={{ fontSize: 12 }}>Они появятся здесь, когда кто-то заполнит форму на сайте.</p>
          </div>
        )}
      </div>
    </>
  );
}

// ── Leads page ─────────────────────────────────────────────────────────────────
function LeadsPage({ leads, setLeads, password }) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedLead, setSelectedLead] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const refresh = async () => {
    setLoading(true);
    const fresh = await apiGetLeads(password);
    setLeads(fresh);
    setLoading(false);
  };

  const filtered = leads.filter(l => {
    const matchStatus = statusFilter === 'all' || (l.status || 'new') === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (l.name || '').toLowerCase().includes(q) ||
      (l.contact || '').toLowerCase().includes(q) ||
      (l.source || '').toLowerCase().includes(q) ||
      (l.message || '').toLowerCase().includes(q) ||
      (l.company || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const updateStatus = async (id, status) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(updated);
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status });
    await apiSaveLeads(updated, password);
  };

  const deleteLead = async (id) => {
    if (!confirm('Удалить эту заявку?')) return;
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    setSelectedLead(null);
    await apiSaveLeads(updated, password);
  };

  const deleteAll = async () => {
    if (!confirm('Удалить все заявки? Это действие необратимо.')) return;
    setLeads([]);
    await apiClearLeads(password);
  };

  return (
    <>
      <div style={s.header}>
        <h1 style={s.pageTitle}>Заявки</h1>
        <p style={s.pageDesc}>Все заявки, поданные через формы на сайте</p>
      </div>
      <div style={s.main}>
        <div style={s.searchRow}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
              <Icon d={Icons.search} size={14} color={C.muted} />
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по имени, контакту, источнику..."
              style={{ ...s.input, paddingLeft: 32 }}
            />
          </div>
          <div style={s.pillTabs}>
            {[
              { key: 'all', label: 'Все' },
              { key: 'new', label: 'Новые' },
              { key: 'inProgress', label: 'В работе' },
              { key: 'done', label: 'Выполнено' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setStatusFilter(key)} style={s.pill(statusFilter === key)}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={refresh} disabled={loading} style={{ ...s.btn(), padding: '8px 10px', opacity: loading ? 0.5 : 1 }} title="Обновить">
            <Icon d={Icons.refresh} size={15} color={C.muted} />
          </button>
        </div>

        <div style={s.card}>
          {filtered.length === 0 ? (
            <div style={s.emptyState}>
              <Icon d={Icons.leads} size={32} color={C.muted} />
              <p style={{ marginTop: 12 }}>
                {leads.length === 0 ? 'Заявок пока нет' : 'Ничего не найдено'}
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: C.muted }}>
                  Показано {filtered.length} из {leads.length}
                </span>
                {leads.length > 0 && (
                  <button onClick={deleteAll} style={{ ...s.btn('danger'), padding: '4px 10px', fontSize: 11 }}>
                    <Icon d={Icons.trash} size={12} /> Удалить все
                  </button>
                )}
              </div>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['Дата и время', 'Имя', 'Контакт', 'Источник', 'Статус', ''].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <tr
                      key={lead.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td style={{ ...s.td, fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>
                        {formatDate(lead.ts)}
                      </td>
                      <td style={s.td}>
                        <div style={{ fontWeight: 500 }}>{lead.name || '—'}</div>
                        {lead.company && <div style={{ fontSize: 11, color: C.muted }}>{lead.company}</div>}
                      </td>
                      <td style={{ ...s.td, fontFamily: F.mono, fontSize: 12 }}>
                        {lead.contact || '—'}
                      </td>
                      <td style={{ ...s.td, fontSize: 12, color: C.muted, maxWidth: 160 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lead.source || '—'}
                        </div>
                      </td>
                      <td style={s.td}>
                        <StatusBadge status={lead.status || 'new'} />
                      </td>
                      <td style={{ ...s.td, width: 36 }}>
                        <Icon d={Icons.eye} size={15} color={C.muted} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={(status) => updateStatus(selectedLead.id, status)}
          onDelete={() => deleteLead(selectedLead.id)}
        />
      )}
    </>
  );
}

// ── Settings page ──────────────────────────────────────────────────────────────
function SettingsPage() {
  const [oldPass, setOldPass] = React.useState('');
  const [newPass, setNewPass] = React.useState('');
  const [confirmPass, setConfirmPass] = React.useState('');
  const [passMsg, setPassMsg] = React.useState(null);

  const changePassword = (e) => {
    e.preventDefault();
    setPassMsg(null);
    if (oldPass !== getPassword()) {
      return setPassMsg({ type: 'error', text: 'Неверный текущий пароль.' });
    }
    if (newPass.length < 8) {
      return setPassMsg({ type: 'error', text: 'Новый пароль должен содержать не менее 8 символов.' });
    }
    if (newPass !== confirmPass) {
      return setPassMsg({ type: 'error', text: 'Пароли не совпадают.' });
    }
    localStorage.setItem(KEYS.password, newPass);
    setPassMsg({ type: 'success', text: 'Пароль успешно изменён!' });
    setOldPass(''); setNewPass(''); setConfirmPass('');
  };

  const exportCSV = () => {
    const leads = getLeads();
    if (!leads.length) return alert('Нет заявок для экспорта.');

    const allKeys = [...new Set(leads.flatMap(Object.keys))].filter(k => k !== 'id');
    const header = allKeys.map(k => FIELD_LABELS[k] || k).join(';');
    const rows = leads.map(l =>
      allKeys.map(k => `"${String(l[k] || '').replace(/"/g, '""')}"`).join(';')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beltransit-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearLeads = () => {
    if (!confirm('Очистить все заявки? Это необратимо.')) return;
    localStorage.removeItem(KEYS.leads);
    alert('Данные удалены.');
  };

  return (
    <>
      <div style={s.header}>
        <h1 style={s.pageTitle}>Настройки</h1>
        <p style={s.pageDesc}>Управление паролем и данными</p>
      </div>
      <div style={s.main}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
          <div style={s.card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 18px' }}>
              Изменить пароль
            </h3>
            <form onSubmit={changePassword}>
              <div style={s.formGroup}>
                <label style={s.label}>Текущий пароль</label>
                <input type="password" value={oldPass}
                  onChange={e => setOldPass(e.target.value)} style={s.input} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Новый пароль</label>
                <input type="password" value={newPass}
                  onChange={e => setNewPass(e.target.value)} style={s.input}
                  placeholder="Не менее 8 символов" />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Повторите пароль</label>
                <input type="password" value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)} style={s.input} />
              </div>
              {passMsg && (
                <p style={{
                  fontSize: 12, marginBottom: 12,
                  color: passMsg.type === 'error' ? C.red : C.green,
                }}>
                  {passMsg.text}
                </p>
              )}
              <button type="submit" style={{ ...s.btn('primary'), padding: '8px 18px' }}>
                Сохранить пароль
              </button>
            </form>
          </div>

          <div style={s.card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
              Данные и экспорт
            </h3>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>
              Заявки хранятся в браузере (localStorage). Экспортируйте их в CSV, чтобы
              перенести в Excel или CRM.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={exportCSV} style={{ ...s.btn('primary'), justifyContent: 'center', padding: '9px 16px' }}>
                <Icon d={Icons.download} size={15} color="#fff" /> Экспорт в CSV
              </button>
              <button onClick={clearLeads} style={{ ...s.btn('danger'), justifyContent: 'center', padding: '9px 16px' }}>
                <Icon d={Icons.trash} size={15} /> Очистить все заявки
              </button>
            </div>

            <div style={{ ...s.divider, margin: '20px 0' }} />

            <div style={{
              background: C.raised, borderRadius: 8, padding: '12px 14px',
              fontSize: 12, color: C.muted, lineHeight: 1.7,
            }}>
              <div><strong style={{ color: C.text }}>Пароль по умолчанию:</strong> <code style={{ fontFamily: F.mono }}>Beltransit2024!</code></div>
              <div style={{ marginTop: 4 }}><strong style={{ color: C.text }}>Хранилище:</strong> localStorage (только этот браузер)</div>
              <div style={{ marginTop: 4 }}><strong style={{ color: C.text }}>Сессия:</strong> 8 часов</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Shared field components ────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={s.formGroup}>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  );
}

function Textarea({ value, onChange, rows = 3, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      style={{ ...s.input, resize: 'vertical', lineHeight: 1.5 }}
    />
  );
}

function SaveBanner({ saved }) {
  if (!saved) return null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 20,
      background: C.green + '22', color: C.green,
      border: `1px solid ${C.green}44`, fontSize: 12, fontWeight: 600,
    }}>
      <Icon d={Icons.check} size={13} /> Сохранено
    </div>
  );
}

// ── Cases editor ───────────────────────────────────────────────────────────────
const CASE_CATEGORIES = [
  'Сборные грузы', 'Выкуп', 'Полная фура', 'Сложные грузы', 'Таможня',
];

const EMPTY_CASE = {
  category: 'Сборные грузы',
  title: '', client: '', task: '', solution: '', result: '', quote: '',
  facts: ['', '', ''],
};

function CaseForm({ value, onChange, onSave, onCancel, saved }) {
  const update = (field, v) => onChange({ ...value, [field]: v });
  const updateFact = (i, v) => {
    const facts = [...value.facts];
    facts[i] = v;
    onChange({ ...value, facts });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div style={{ gridColumn: 'span 2' }}>
        <Field label="Категория">
          <select
            value={value.category}
            onChange={e => update('category', e.target.value)}
            style={{ ...s.input }}
          >
            {CASE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <Field label="Заголовок кейса">
          <input style={s.input} value={value.title}
            onChange={e => update('title', e.target.value)}
            placeholder="Автозапчасти из Германии — два поставщика, одна доставка" />
        </Field>
      </div>
      <Field label="Клиент">
        <input style={s.input} value={value.client}
          onChange={e => update('client', e.target.value)}
          placeholder="Владелец магазина, Москва" />
      </Field>
      <Field label="Цитата клиента">
        <Textarea value={value.quote} rows={2}
          onChange={e => update('quote', e.target.value)}
          placeholder="Раньше платил двум перевозчикам..." />
      </Field>
      <Field label="Задача">
        <Textarea value={value.task}
          onChange={e => update('task', e.target.value)}
          placeholder="Что нужно было сделать" />
      </Field>
      <Field label="Решение">
        <Textarea value={value.solution}
          onChange={e => update('solution', e.target.value)}
          placeholder="Что мы сделали" />
      </Field>
      <div style={{ gridColumn: 'span 2' }}>
        <Field label="Результат">
          <Textarea value={value.result} rows={2}
            onChange={e => update('result', e.target.value)}
            placeholder="Срок, экономия, итог" />
        </Field>
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <label style={s.label}>Факты (3 числа/тезиса)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[0, 1, 2].map(i => (
            <input key={i} style={s.input} value={value.facts[i] || ''}
              onChange={e => updateFact(i, e.target.value)}
              placeholder={['11 дней', '-25%', '2 поставщика'][i]} />
          ))}
        </div>
      </div>
      <div style={{ gridColumn: 'span 2', display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
        <button onClick={onSave} style={{ ...s.btn('primary'), padding: '8px 20px' }}>
          <Icon d={Icons.check} size={14} color="#fff" /> Сохранить
        </button>
        <button onClick={onCancel} style={s.btn()}>Отмена</button>
        <SaveBanner saved={saved} />
      </div>
    </div>
  );
}

function CasesEditor({ defaultCases }) {
  const [cases, setCases] = React.useState(() => getCmsCases(defaultCases) || defaultCases);
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState(null);
  const [saved, setSaved] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [newDraft, setNewDraft] = React.useState(null);

  const save = (updated) => {
    setCases(updated);
    saveCmsCases(updated);
    apiSaveCmsSection('cases', updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const startEdit = (idx) => {
    setEditing(idx);
    setDraft({ ...cases[idx], facts: [...(cases[idx].facts || ['', '', ''])] });
    setAdding(false);
  };

  const commitEdit = () => {
    const updated = cases.map((c, i) => i === editing ? draft : c);
    save(updated);
    setEditing(null);
  };

  const deleteCase = (idx) => {
    if (!confirm('Удалить этот кейс?')) return;
    save(cases.filter((_, i) => i !== idx));
    setEditing(null);
  };

  const startAdd = () => {
    setAdding(true);
    setNewDraft({ ...EMPTY_CASE, facts: ['', '', ''] });
    setEditing(null);
  };

  const commitAdd = () => {
    save([...cases, newDraft]);
    setAdding(false);
  };

  const resetAll = () => {
    if (!confirm('Сбросить все кейсы к исходным?')) return;
    resetCmsCases();
    setCases(defaultCases);
    apiSaveCmsSection('cases', defaultCases);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <button onClick={startAdd} style={{ ...s.btn('primary'), padding: '7px 16px' }}>
          + Добавить кейс
        </button>
        <span style={{ fontSize: 12, color: C.muted }}>{cases.length} кейсов</span>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={resetAll} style={{ ...s.btn('danger'), padding: '5px 12px', fontSize: 12 }}>
            Сбросить к исходным
          </button>
        </div>
      </div>

      {adding && (
        <div style={{ ...s.card, marginBottom: 16, borderColor: C.orange + '66' }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: C.orange, margin: '0 0 16px' }}>Новый кейс</h4>
          <CaseForm value={newDraft} onChange={setNewDraft} onSave={commitAdd}
            onCancel={() => setAdding(false)} saved={false} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cases.map((c, idx) => (
          <div key={idx} style={{
            ...s.card,
            borderColor: editing === idx ? C.orange + '88' : C.border,
          }}>
            {editing === idx ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: C.orange, margin: 0 }}>
                    Редактирование кейса #{idx + 1}
                  </h4>
                  <button onClick={() => deleteCase(idx)}
                    style={{ ...s.btn('danger'), padding: '3px 10px', fontSize: 11 }}>
                    <Icon d={Icons.trash} size={12} /> Удалить кейс
                  </button>
                </div>
                <CaseForm value={draft} onChange={setDraft}
                  onSave={commitEdit} onCancel={() => setEditing(null)} saved={saved} />
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={s.badge(C.orange)}>{c.category}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>#{idx + 1}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{c.client}</div>
                </div>
                <button onClick={() => startEdit(idx)} style={{ ...s.btn(), padding: '5px 12px', fontSize: 12, flexShrink: 0 }}>
                  Редактировать
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FAQ editor ─────────────────────────────────────────────────────────────────
function FaqEditor({ defaultFaq }) {
  const [cats, setCats] = React.useState(() => getCmsFaq(defaultFaq) || defaultFaq);
  const [saved, setSaved] = React.useState(false);
  const [openCat, setOpenCat] = React.useState(0);
  const [editingQ, setEditingQ] = React.useState(null);
  const [draft, setDraft] = React.useState(['', '']);
  const [addingCat, setAddingCat] = React.useState(null);
  const [newQ, setNewQ] = React.useState(['', '']);

  const persist = (updated) => {
    setCats(updated);
    saveCmsFaq(updated);
    apiSaveCmsSection('faq', updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const startEdit = (catIdx, qIdx) => {
    setEditingQ({ catIdx, qIdx });
    setDraft([...cats[catIdx].questions[qIdx]]);
  };

  const commitEdit = () => {
    const updated = cats.map((cat, ci) =>
      ci === editingQ.catIdx
        ? { ...cat, questions: cat.questions.map((q, qi) => qi === editingQ.qIdx ? draft : q) }
        : cat
    );
    persist(updated);
    setEditingQ(null);
  };

  const deleteQ = (catIdx, qIdx) => {
    if (!confirm('Удалить вопрос?')) return;
    const updated = cats.map((cat, ci) =>
      ci === catIdx ? { ...cat, questions: cat.questions.filter((_, qi) => qi !== qIdx) } : cat
    );
    persist(updated);
    setEditingQ(null);
  };

  const commitAdd = (catIdx) => {
    if (!newQ[0].trim()) return;
    const updated = cats.map((cat, ci) =>
      ci === catIdx ? { ...cat, questions: [...cat.questions, [...newQ]] } : cat
    );
    persist(updated);
    setAddingCat(null);
    setNewQ(['', '']);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <SaveBanner saved={saved} />
        <button onClick={() => { if (!confirm('Сбросить FAQ к исходному?')) return; resetCmsFaq(); setCats(defaultFaq); apiSaveCmsSection('faq', defaultFaq); }}
          style={{ ...s.btn('danger'), padding: '5px 12px', fontSize: 12, marginLeft: 'auto' }}>
          Сбросить к исходному
        </button>
      </div>

      {cats.map((cat, catIdx) => (
        <div key={catIdx} style={{ ...s.card, marginBottom: 10 }}>
          <button
            onClick={() => setOpenCat(openCat === catIdx ? -1 : catIdx)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              padding: 0, color: C.text,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>{cat.title}</span>
            <span style={{ fontSize: 12, color: C.muted }}>
              {cat.questions.length} вопр. {openCat === catIdx ? '▲' : '▼'}
            </span>
          </button>

          {openCat === catIdx && (
            <div style={{ marginTop: 14 }}>
              {cat.questions.map(([q, a], qIdx) => (
                <div key={qIdx} style={{
                  background: C.raised, borderRadius: 8, padding: '10px 14px', marginBottom: 8,
                  border: (editingQ?.catIdx === catIdx && editingQ?.qIdx === qIdx) ? `1px solid ${C.orange}66` : `1px solid transparent`,
                }}>
                  {editingQ?.catIdx === catIdx && editingQ?.qIdx === qIdx ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Field label="Вопрос">
                        <input style={s.input} value={draft[0]} onChange={e => setDraft([e.target.value, draft[1]])} />
                      </Field>
                      <Field label="Ответ">
                        <Textarea rows={3} value={draft[1]} onChange={e => setDraft([draft[0], e.target.value])} />
                      </Field>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={commitEdit} style={{ ...s.btn('primary'), padding: '5px 14px', fontSize: 12 }}>
                          <Icon d={Icons.check} size={12} color="#fff" /> Сохранить
                        </button>
                        <button onClick={() => setEditingQ(null)} style={{ ...s.btn(), padding: '5px 12px', fontSize: 12 }}>
                          Отмена
                        </button>
                        <button onClick={() => deleteQ(catIdx, qIdx)}
                          style={{ ...s.btn('danger'), padding: '5px 10px', fontSize: 12, marginLeft: 'auto' }}>
                          <Icon d={Icons.trash} size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{q}</div>
                        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{a}</div>
                      </div>
                      <button onClick={() => startEdit(catIdx, qIdx)}
                        style={{ ...s.btn(), padding: '4px 10px', fontSize: 11, flexShrink: 0 }}>
                        Изменить
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {addingCat === catIdx ? (
                <div style={{ background: C.raised, borderRadius: 8, padding: '12px 14px', border: `1px solid ${C.orange}44` }}>
                  <Field label="Вопрос">
                    <input style={s.input} value={newQ[0]} onChange={e => setNewQ([e.target.value, newQ[1]])}
                      placeholder="Новый вопрос..." autoFocus />
                  </Field>
                  <Field label="Ответ">
                    <Textarea rows={3} value={newQ[1]} onChange={e => setNewQ([newQ[0], e.target.value])}
                      placeholder="Ответ..." />
                  </Field>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => commitAdd(catIdx)} style={{ ...s.btn('primary'), padding: '5px 14px', fontSize: 12 }}>
                      Добавить
                    </button>
                    <button onClick={() => { setAddingCat(null); setNewQ(['', '']); }}
                      style={{ ...s.btn(), padding: '5px 12px', fontSize: 12 }}>
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setAddingCat(catIdx); setEditingQ(null); setNewQ(['', '']); }}
                  style={{ ...s.btn(), padding: '5px 14px', fontSize: 12, marginTop: 4 }}>
                  + Добавить вопрос
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Contacts editor ────────────────────────────────────────────────────────────
const DEFAULT_CONTACTS = {
  telegram: 'beltransit',
  phone: '+7 926 547-18-94',
  phoneRaw: '+79265471894',
  email: 'beltransit2012@gmail.com',
  whatsapp: '79265471894',
  hours: 'Пн–Сб, 9:00–20:00 МСК',
  address: 'Вильнюс, Литва',
};

function ContactsEditor() {
  const [form, setForm] = React.useState(() => getCmsContacts() || DEFAULT_CONTACTS);
  const [saved, setSaved] = React.useState(false);

  const update = (field, v) => setForm(f => ({ ...f, [field]: v }));

  const handleSave = () => {
    saveCmsContacts(form);
    apiSaveCmsSection('contacts', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (!confirm('Сбросить контакты к исходным?')) return;
    resetCmsContacts();
    setForm(DEFAULT_CONTACTS);
    apiSaveCmsSection('contacts', DEFAULT_CONTACTS);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Telegram (без @)">
          <input style={s.input} value={form.telegram}
            onChange={e => update('telegram', e.target.value)} placeholder="beltransit" />
        </Field>
        <Field label="WhatsApp (только цифры)">
          <input style={s.input} value={form.whatsapp}
            onChange={e => update('whatsapp', e.target.value)} placeholder="79265471894" />
        </Field>
        <Field label="Телефон (для отображения)">
          <input style={s.input} value={form.phone}
            onChange={e => update('phone', e.target.value)} placeholder="+7 926 547-18-94" />
        </Field>
        <Field label="Телефон (для ссылки tel:)">
          <input style={s.input} value={form.phoneRaw}
            onChange={e => update('phoneRaw', e.target.value)} placeholder="+79265471894" />
        </Field>
        <div style={{ gridColumn: 'span 2' }}>
          <Field label="Email">
            <input style={s.input} value={form.email}
              onChange={e => update('email', e.target.value)} placeholder="beltransit2012@gmail.com" />
          </Field>
        </div>
        <Field label="Часы работы">
          <input style={s.input} value={form.hours}
            onChange={e => update('hours', e.target.value)} placeholder="Пн–Сб, 9:00–20:00 МСК" />
        </Field>
        <Field label="Адрес">
          <input style={s.input} value={form.address}
            onChange={e => update('address', e.target.value)} placeholder="Вильнюс, Литва" />
        </Field>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
        <button onClick={handleSave} style={{ ...s.btn('primary'), padding: '8px 20px' }}>
          <Icon d={Icons.check} size={14} color="#fff" /> Сохранить
        </button>
        <button onClick={handleReset} style={{ ...s.btn('danger'), padding: '7px 14px', fontSize: 13 }}>
          Сбросить
        </button>
        <SaveBanner saved={saved} />
      </div>
    </div>
  );
}

// ── Blog editor ────────────────────────────────────────────────────────────────
const BLOG_CATEGORIES = ['Таможня', 'Маршруты', 'Платежи и выкуп', 'Сборные грузы', 'ВЭД для новичков', 'Другое'];

const EMPTY_POST = {
  category: 'Другое', title: '', text: '', time: '5 минут чтения',
  date: '', href: '', isNew: true, draft: false,
};

const EMPTY_TEMPLATE = () => ({
  intro: '',
  sections: [],
  summary: [],
  cta: { eyebrow: '', heading: '', description: '', btnText: 'Получить консультацию' },
});

const EMPTY_SECTION = () => ({ heading: '', paragraphs: [''], callout: '', list: [] });

function TemplateEditor({ value, onChange }) {
  const tmpl = value || EMPTY_TEMPLATE();
  const { intro = '', sections = [], summary = [], cta = {} } = tmpl;

  const set = (field, v) => onChange({ ...tmpl, [field]: v });

  const addSection = () => set('sections', [...sections, EMPTY_SECTION()]);
  const removeSection = (i) => set('sections', sections.filter((_, j) => j !== i));
  const moveUp = (i) => {
    if (i === 0) return;
    const arr = [...sections];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    set('sections', arr);
  };
  const moveDown = (i) => {
    if (i === sections.length - 1) return;
    const arr = [...sections];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    set('sections', arr);
  };
  const updateSec = (i, field, v) =>
    set('sections', sections.map((s, j) => j === i ? { ...s, [field]: v } : s));

  const setPara = (si, pi, v) =>
    updateSec(si, 'paragraphs', (sections[si].paragraphs || []).map((p, j) => j === pi ? v : p));
  const addPara = (si) =>
    updateSec(si, 'paragraphs', [...(sections[si].paragraphs || ['']), '']);
  const removePara = (si, pi) =>
    updateSec(si, 'paragraphs', (sections[si].paragraphs || []).filter((_, j) => j !== pi));

  const setListItem = (si, li, v) =>
    updateSec(si, 'list', (sections[si].list || []).map((x, j) => j === li ? v : x));
  const addListItem = (si) =>
    updateSec(si, 'list', [...(sections[si].list || []), '']);
  const removeListItem = (si, li) =>
    updateSec(si, 'list', (sections[si].list || []).filter((_, j) => j !== li));

  const setSummaryItem = (i, v) => set('summary', summary.map((x, j) => j === i ? v : x));
  const addSummary = () => set('summary', [...summary, '']);
  const removeSummaryItem = (i) => set('summary', summary.filter((_, j) => j !== i));

  const setCta = (field, v) => set('cta', { ...cta, [field]: v });

  const blockLabel = { fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, display: 'block' };
  const row = { display: 'flex', gap: 8, marginBottom: 8 };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ ...s.card, marginBottom: 12 }}>
        <span style={blockLabel}>Вступление</span>
        <Textarea rows={3} value={intro}
          onChange={e => set('intro', e.target.value)}
          placeholder="Первый абзац статьи — краткое введение в тему..." />
      </div>

      <span style={{ ...blockLabel, marginTop: 16, marginBottom: 8 }}>Разделы статьи</span>
      {sections.map((sec, si) => (
        <div key={si} style={{ ...s.card, marginBottom: 10, borderColor: C.orange + '44' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.orange }}>Раздел {si + 1}</span>
            <button onClick={() => moveUp(si)} disabled={si === 0}
              style={{ ...s.btn(), padding: '2px 8px', fontSize: 11 }}>↑</button>
            <button onClick={() => moveDown(si)} disabled={si === sections.length - 1}
              style={{ ...s.btn(), padding: '2px 8px', fontSize: 11 }}>↓</button>
            <button onClick={() => removeSection(si)}
              style={{ ...s.btn('danger'), padding: '2px 10px', fontSize: 11, marginLeft: 'auto' }}>
              ✕ Удалить раздел
            </button>
          </div>

          <Field label="Заголовок раздела (H2, необязательно)">
            <input style={s.input} value={sec.heading || ''}
              onChange={e => updateSec(si, 'heading', e.target.value)}
              placeholder="Как это работает на практике" />
          </Field>

          <div style={{ marginTop: 12 }}>
            <span style={blockLabel}>Абзацы</span>
            {(sec.paragraphs || ['']).map((para, pi) => (
              <div key={pi} style={row}>
                <Textarea rows={3} value={para}
                  onChange={e => setPara(si, pi, e.target.value)}
                  placeholder={`Текст абзаца ${pi + 1}...`}
                  style={{ flex: 1 }} />
                {(sec.paragraphs || []).length > 1 && (
                  <button onClick={() => removePara(si, pi)}
                    style={{ ...s.btn('danger'), padding: '4px 8px', alignSelf: 'flex-start' }}>✕</button>
                )}
              </div>
            ))}
            <button onClick={() => addPara(si)}
              style={{ ...s.btn(), padding: '4px 12px', fontSize: 12 }}>+ Абзац</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <span style={blockLabel}>Список (необязательно)</span>
            {(sec.list || []).map((item, li) => (
              <div key={li} style={row}>
                <input style={{ ...s.input, flex: 1 }} value={item}
                  onChange={e => setListItem(si, li, e.target.value)}
                  placeholder={`Пункт ${li + 1}`} />
                <button onClick={() => removeListItem(si, li)}
                  style={{ ...s.btn('danger'), padding: '4px 8px' }}>✕</button>
              </div>
            ))}
            <button onClick={() => addListItem(si)}
              style={{ ...s.btn(), padding: '4px 12px', fontSize: 12 }}>+ Пункт</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <Field label="Врезка / выделение (необязательно)">
              <Textarea rows={2} value={sec.callout || ''}
                onChange={e => updateSec(si, 'callout', e.target.value)}
                placeholder="Важный момент, который нужно выделить..." />
            </Field>
          </div>
        </div>
      ))}

      <button onClick={addSection}
        style={{ ...s.btn('primary'), padding: '8px 18px', marginBottom: 20 }}>
        + Добавить раздел
      </button>

      <div style={{ ...s.card, marginBottom: 12 }}>
        <span style={blockLabel}>«Коротко о главном» — ключевые тезисы</span>
        {summary.map((item, i) => (
          <div key={i} style={row}>
            <input style={{ ...s.input, flex: 1 }} value={item}
              onChange={e => setSummaryItem(i, e.target.value)}
              placeholder={`Тезис ${i + 1}`} />
            <button onClick={() => removeSummaryItem(i)}
              style={{ ...s.btn('danger'), padding: '4px 8px' }}>✕</button>
          </div>
        ))}
        <button onClick={addSummary}
          style={{ ...s.btn(), padding: '4px 12px', fontSize: 12, marginTop: 4 }}>+ Тезис</button>
      </div>

      <div style={s.card}>
        <span style={blockLabel}>Призыв к действию (в конце статьи)</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Надпись над заголовком">
            <input style={s.input} value={cta.eyebrow || ''}
              onChange={e => setCta('eyebrow', e.target.value)}
              placeholder="Нужна помощь?" />
          </Field>
          <Field label="Текст кнопки">
            <input style={s.input} value={cta.btnText || ''}
              onChange={e => setCta('btnText', e.target.value)}
              placeholder="Получить консультацию" />
          </Field>
          <div style={{ gridColumn: 'span 2' }}>
            <Field label="Заголовок">
              <input style={s.input} value={cta.heading || ''}
                onChange={e => setCta('heading', e.target.value)}
                placeholder="Рассчитаем стоимость вашей доставки" />
            </Field>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Field label="Описание">
              <Textarea rows={2} value={cta.description || ''}
                onChange={e => setCta('description', e.target.value)}
                placeholder="Кратко о том, что получит клиент..." />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogPostForm({ value, onChange, onSave, onCancel, saved, isNew }) {
  const update = (f, v) => onChange({ ...value, [f]: v });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div style={{ gridColumn: 'span 2' }}>
        <Field label="Заголовок статьи">
          <input style={s.input} value={value.title}
            onChange={e => update('title', e.target.value)}
            placeholder="Как рассчитать таможенные платежи в 2026" />
        </Field>
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <Field label="Описание (анонс на странице блога)">
          <Textarea rows={2} value={value.text}
            onChange={e => update('text', e.target.value)}
            placeholder="Пошлины, НДС, сборы — разбираем по порядку..." />
        </Field>
      </div>
      <Field label="Категория">
        <select style={s.input} value={value.category} onChange={e => update('category', e.target.value)}>
          {BLOG_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Время чтения">
        <input style={s.input} value={value.time}
          onChange={e => update('time', e.target.value)} placeholder="8 минут чтения" />
      </Field>
      <Field label="Дата публикации">
        <input style={s.input} value={value.date}
          onChange={e => update('date', e.target.value)} placeholder="14 мая 2026" />
      </Field>
      <Field label={isNew ? 'URL-slug (напр. moya-statya)' : 'URL статьи'}>
        {isNew ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>/blog/</span>
            <input style={{ ...s.input, flex: 1 }} value={(value.href || '').replace('/blog/', '').replace(/\/$/, '')}
              onChange={e => update('href', `/blog/${e.target.value.replace(/^\/|\/$/g, '')}/`)}
              placeholder="url-stati" />
          </div>
        ) : (
          <input style={{ ...s.input, color: C.muted }} value={value.href} readOnly />
        )}
      </Field>
      {isNew && (
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!value.draft} onChange={e => update('draft', e.target.checked)} />
            <span style={{ fontSize: 13, color: C.muted }}>Черновик (не показывать в блоге)</span>
          </label>
        </div>
      )}
      <div style={{ gridColumn: 'span 2', display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
        <button onClick={onSave} style={{ ...s.btn('primary'), padding: '8px 20px' }}>
          <Icon d={Icons.check} size={14} color="#fff" /> Сохранить
        </button>
        <button onClick={onCancel} style={s.btn()}>Отмена</button>
        <SaveBanner saved={saved} />
      </div>
    </div>
  );
}

function ArticleBodyEditor({ slug, title }) {
  const [html, setHtml] = React.useState(() => getCmsArticleBody(slug) || '');
  const [saved, setSaved] = React.useState(false);
  const [preview, setPreview] = React.useState(false);

  const handleSave = () => {
    saveCmsArticleBody(slug, html);
    apiSaveCmsSection('articleBody', html, slug);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClear = () => {
    if (!confirm('Сбросить кастомный текст? Статья вернётся к исходному содержимому.')) return;
    saveCmsArticleBody(slug, '');
    apiSaveCmsSection('articleBody', '', slug);
    setHtml('');
  };

  const toolbarBtns = [
    { label: 'H2', action: () => setHtml(h => h + '\n<h2>Заголовок раздела</h2>\n') },
    { label: 'H3', action: () => setHtml(h => h + '\n<h3>Подзаголовок</h3>\n') },
    { label: 'P',  action: () => setHtml(h => h + '\n<p>Текст абзаца</p>\n') },
    { label: 'B',  action: () => setHtml(h => h + '<strong>жирный</strong>') },
    { label: 'UL', action: () => setHtml(h => h + '\n<ul>\n  <li>Пункт 1</li>\n  <li>Пункт 2</li>\n</ul>\n') },
    { label: 'OL', action: () => setHtml(h => h + '\n<ol>\n  <li>Пункт 1</li>\n  <li>Пункт 2</li>\n</ol>\n') },
    { label: '💡', action: () => setHtml(h => h + '\n<div class="article-callout"><strong>Важно:</strong> текст подсказки</div>\n') },
    { label: 'HR', action: () => setHtml(h => h + '\n<hr>\n') },
  ];

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>Тело статьи (HTML)</h4>
        {html ? (
          <span style={s.badge(C.orange)}>Кастомный контент</span>
        ) : (
          <span style={s.badge(C.muted)}>Исходный код сайта</span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => setPreview(p => !p)} style={{ ...s.btn(), padding: '4px 12px', fontSize: 12 }}>
            {preview ? 'Код' : 'Предпросмотр'}
          </button>
          {slug && (
            <a href={`/blog/${slug.replace('/blog/', '').replace(/\/$/, '')}/`} target="_blank"
              rel="noopener noreferrer"
              style={{ ...s.btn(), padding: '4px 12px', fontSize: 12, textDecoration: 'none' }}>
              ↗ Открыть
            </a>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {toolbarBtns.map(({ label, action }) => (
          <button key={label} onClick={action}
            style={{ ...s.btn(), padding: '3px 10px', fontSize: 12, fontFamily: F.mono }}>
            {label}
          </button>
        ))}
      </div>

      {preview ? (
        <div
          style={{
            minHeight: 300, background: '#fff', borderRadius: 8, padding: '24px 28px',
            border: `1px solid ${C.border}`, color: '#111',
            fontSize: 15, lineHeight: 1.7,
          }}
          dangerouslySetInnerHTML={{ __html: html || '<p style="color:#999">Нет контента — статья показывает исходный текст</p>' }}
        />
      ) : (
        <textarea
          value={html}
          onChange={e => setHtml(e.target.value)}
          placeholder={'<p>Введите HTML-содержимое статьи...</p>\n<h2>Раздел 1</h2>\n<p>Текст...</p>'}
          rows={18}
          style={{
            ...s.input, resize: 'vertical', fontFamily: F.mono,
            fontSize: 12, lineHeight: 1.6,
          }}
        />
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
        <button onClick={handleSave} style={{ ...s.btn('primary'), padding: '8px 20px' }}>
          <Icon d={Icons.check} size={14} color="#fff" /> Сохранить
        </button>
        {html && (
          <button onClick={handleClear} style={{ ...s.btn('danger'), padding: '7px 14px', fontSize: 13 }}>
            Сбросить к оригиналу
          </button>
        )}
        <SaveBanner saved={saved} />
      </div>
      <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
        Если поле пустое — статья отображает оригинальный текст из кода сайта. Кастомный HTML полностью заменяет тело статьи.
      </p>
    </div>
  );
}

function BlogEditor({ defaultPosts }) {
  const [posts, setPosts] = React.useState(() => getCmsBlogPosts(defaultPosts) || defaultPosts);
  const [newArticles, setNewArticles] = React.useState(getCmsNewArticles);
  const [editing, setEditing] = React.useState(null);
  const [editDraft, setEditDraft] = React.useState(null);
  const [editSaved, setEditSaved] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [newDraft, setNewDraft] = React.useState(null);
  const [bodySlug, setBodySlug] = React.useState(null);
  const [templateDraft, setTemplateDraft] = React.useState(null);
  const [templateSaved, setTemplateSaved] = React.useState(false);

  const persistPosts = (updated) => {
    setPosts(updated);
    saveCmsBlogPosts(updated);
    apiSaveCmsSection('blogPosts', updated);
  };

  const persistNew = (updated) => {
    setNewArticles(updated);
    saveCmsNewArticles(updated);
    apiSaveCmsSection('newArticles', updated);
  };

  const startEdit = (idx, isNew) => {
    if (isNew) {
      setEditing({ idx, isNew: true });
      setEditDraft({ ...newArticles[idx] });
    } else {
      setEditing({ idx, isNew: false });
      setEditDraft({ ...posts[idx] });
    }
    setBodySlug(null);
    setAdding(false);
  };

  const commitEdit = () => {
    if (editing.isNew) {
      const updated = newArticles.map((p, i) => i === editing.idx ? editDraft : p);
      persistNew(updated);
    } else {
      const updated = posts.map((p, i) => i === editing.idx ? editDraft : p);
      persistPosts(updated);
    }
    setEditSaved(true);
    setTimeout(() => setEditSaved(false), 2500);
    setEditing(null);
  };

  const deletePost = (idx, isNew) => {
    if (!confirm('Удалить статью?')) return;
    if (isNew) {
      persistNew(newArticles.filter((_, i) => i !== idx));
    } else {
      persistPosts(posts.filter((_, i) => i !== idx));
    }
    setEditing(null);
  };

  const startAdd = () => {
    setAdding(true);
    setNewDraft({ ...EMPTY_POST, date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) });
    setEditing(null);
    setBodySlug(null);
  };

  const commitAdd = () => {
    if (!newDraft.title.trim()) return alert('Введите заголовок');
    if (!newDraft.href.trim()) return alert('Введите URL статьи');
    const article = { ...newDraft, id: Date.now().toString(36), template: EMPTY_TEMPLATE() };
    persistNew([...newArticles, article]);
    setAdding(false);
  };

  const toggleBodyEditor = (post) => {
    const slug = typeof post === 'string' ? post : post.href;
    if (bodySlug === slug) {
      setBodySlug(null);
      setTemplateDraft(null);
    } else {
      setBodySlug(slug);
      if (post._isNew) setTemplateDraft(post.template || EMPTY_TEMPLATE());
      setEditing(null);
      setAdding(false);
    }
  };

  const saveTemplate = (post) => {
    const updated = newArticles.map(a => a.href === post.href ? { ...a, template: templateDraft } : a);
    persistNew(updated);
    setTemplateSaved(true);
    setTimeout(() => setTemplateSaved(false), 2500);
  };

  const allPosts = [
    ...posts.map((p, i) => ({ ...p, _idx: i, _isNew: false })),
    ...newArticles.map((p, i) => ({ ...p, _idx: i, _isNew: true })),
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <button onClick={startAdd} style={{ ...s.btn('primary'), padding: '7px 16px' }}>
          + Новая статья
        </button>
        <span style={{ fontSize: 12, color: C.muted }}>{allPosts.length} статей</span>
        <button onClick={() => { if (!confirm('Сбросить метаданные к исходным?')) return; resetCmsBlogPosts(); setPosts(defaultPosts); apiSaveCmsSection('blogPosts', defaultPosts); }}
          style={{ ...s.btn('danger'), padding: '5px 12px', fontSize: 12, marginLeft: 'auto' }}>
          Сбросить метаданные
        </button>
      </div>

      {adding && (
        <div style={{ ...s.card, marginBottom: 14, borderColor: C.orange + '66' }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: C.orange, margin: '0 0 16px' }}>Новая статья</h4>
          <BlogPostForm value={newDraft} onChange={setNewDraft}
            onSave={commitAdd} onCancel={() => setAdding(false)} saved={false} isNew />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {allPosts.map((post) => {
          const isEditingThis = editing && editing.idx === post._idx && editing.isNew === post._isNew;
          const isBodyOpen = bodySlug === post.href;
          const hasCustomBody = !!getCmsArticleBody(post.href);

          return (
            <div key={post.href || post._idx} style={{
              ...s.card,
              borderColor: isEditingThis || isBodyOpen ? C.orange + '88' : C.border,
            }}>
              {isEditingThis ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: C.orange, margin: 0 }}>
                      Редактирование статьи
                    </h4>
                    <button onClick={() => deletePost(post._idx, post._isNew)}
                      style={{ ...s.btn('danger'), padding: '3px 10px', fontSize: 11 }}>
                      <Icon d={Icons.trash} size={12} /> Удалить
                    </button>
                  </div>
                  <BlogPostForm value={editDraft} onChange={setEditDraft}
                    onSave={commitEdit} onCancel={() => setEditing(null)} saved={editSaved} isNew={post._isNew} />
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                        <span style={s.badge(C.orange)}>{post.category}</span>
                        {post._isNew && <span style={s.badge(C.green)}>Новая</span>}
                        {post.draft && <span style={s.badge(C.muted)}>Черновик</span>}
                        {hasCustomBody && <span style={s.badge(C.blue)}>Кастомный текст</span>}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>
                        {post.title || <span style={{ color: C.muted }}>Без заголовка</span>}
                      </div>
                      <div style={{ fontSize: 12, color: C.muted }}>{post.date} · {post.time}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => toggleBodyEditor(post)}
                        style={{ ...s.btn(), padding: '5px 12px', fontSize: 12 }}>
                        {isBodyOpen ? 'Свернуть' : (post._isNew ? 'Содержание' : 'Текст')}
                      </button>
                      <button onClick={() => startEdit(post._idx, post._isNew)}
                        style={{ ...s.btn(), padding: '5px 12px', fontSize: 12 }}>
                        Инфо
                      </button>
                    </div>
                  </div>

                  {isBodyOpen && post._isNew && (
                    <div>
                      <TemplateEditor value={templateDraft} onChange={setTemplateDraft} />
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12 }}>
                        <button onClick={() => saveTemplate(post)}
                          style={{ ...s.btn('primary'), padding: '8px 20px' }}>
                          <Icon d={Icons.check} size={14} color="#fff" /> Сохранить
                        </button>
                        <SaveBanner saved={templateSaved} />
                      </div>
                    </div>
                  )}
                  {isBodyOpen && !post._isNew && (
                    <ArticleBodyEditor slug={post.href} title={post.title} />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Content page (wrapper with sub-tabs) ──────────────────────────────────────
function ContentPage({ defaultCases, defaultFaq, defaultPosts }) {
  const [tab, setTab] = React.useState('blog');

  const tabs = [
    { id: 'blog',     label: 'Блог' },
    { id: 'cases',    label: 'Кейсы' },
    { id: 'faq',      label: 'FAQ' },
    { id: 'contacts', label: 'Контакты' },
  ];

  return (
    <>
      <div style={s.header}>
        <h1 style={s.pageTitle}>Контент</h1>
        <p style={s.pageDesc}>Редактирование статей блога, кейсов, FAQ и контактов</p>
      </div>
      <div style={s.main}>
        <div style={{ ...s.pillTabs, marginBottom: 20 }}>
          {tabs.map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              ...s.pill(tab === id),
              padding: '6px 18px', fontSize: 13,
            }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'blog'     && <BlogEditor defaultPosts={defaultPosts} />}
        {tab === 'cases'    && <CasesEditor defaultCases={defaultCases} />}
        {tab === 'faq'      && <FaqEditor defaultFaq={defaultFaq} />}
        {tab === 'contacts' && <ContactsEditor />}
      </div>
    </>
  );
}

// ── Main admin app ─────────────────────────────────────────────────────────────
export function AdminPanel({ defaultCases = [], defaultFaq = [], defaultPosts = [] }) {
  const [authed, setAuthed] = React.useState(isAuthenticated);
  const [page, setPage] = React.useState('dashboard');
  const [leads, setLeads] = React.useState([]);
  const [cmsKey, setCmsKey] = React.useState(0);

  // On login: load leads from API + hydrate CMS from API into localStorage
  React.useEffect(() => {
    if (!authed) return;
    const pw = getPassword();
    apiGetLeads(pw).then(data => setLeads(data || []));
    fetch('/api/cms')
      .then(r => r.ok ? r.json() : {})
      .then(data => {
        hydrateCmsLocalStorage(data);
        setCmsKey(k => k + 1); // re-mount content editors with fresh data
      })
      .catch(() => {});
  }, [authed]);

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  const newLeadsCount = leads.filter(l => (l.status || 'new') === 'new').length;

  const navItems = [
    { id: 'dashboard', label: 'Дашборд',  icon: Icons.dashboard },
    { id: 'leads',     label: `Заявки${newLeadsCount > 0 ? ` (${newLeadsCount})` : ''}`, icon: Icons.leads },
    { id: 'content',   label: 'Контент',   icon: Icons.content },
    { id: 'settings',  label: 'Настройки', icon: Icons.settings },
  ];

  return (
    <div style={s.root}>
      <nav style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <div style={s.sidebarBrand}>BelTransit</div>
          <div style={s.sidebarSub}>Панель управления</div>
        </div>

        <div style={s.navSection}>
          <div style={s.navLabel}>Навигация</div>
          {navItems.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setPage(id)} style={s.navItem(page === id)}>
              <Icon d={icon} size={16} color={page === id ? C.orange : C.muted} />
              {label}
            </button>
          ))}
        </div>

        <div style={s.sidebarFooter}>
          <a href="/" style={{ ...s.logoutBtn, textDecoration: 'none', marginBottom: 4 }}>
            <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" size={15} color={C.muted} />
            На сайт
          </a>
          <button onClick={handleLogout} style={s.logoutBtn}>
            <Icon d={Icons.logout} size={15} color={C.muted} />
            Выйти
          </button>
        </div>
      </nav>

      <div style={s.content}>
        {page === 'dashboard' && <DashboardPage leads={leads} />}
        {page === 'leads'     && <LeadsPage leads={leads} setLeads={setLeads} password={getPassword()} />}
        {page === 'content'   && <ContentPage key={cmsKey} defaultCases={defaultCases} defaultFaq={defaultFaq} defaultPosts={defaultPosts} />}
        {page === 'settings'  && <SettingsPage />}
      </div>
    </div>
  );
}
