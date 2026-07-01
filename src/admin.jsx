import React from 'react';

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

export function getLeads() {
  try { return JSON.parse(localStorage.getItem(KEYS.leads) || '[]'); }
  catch { return []; }
}

function saveLeads(leads) {
  localStorage.setItem(KEYS.leads, JSON.stringify(leads));
}

export function saveLead(data) {
  try {
    const leads = getLeads();
    leads.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ts: new Date().toISOString(),
      status: 'new',
      ...data,
    });
    saveLeads(leads);
  } catch (_) {}
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
function DashboardPage() {
  const leads = getLeads();
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
function LeadsPage() {
  const [leads, setLeads] = React.useState(getLeads);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedLead, setSelectedLead] = React.useState(null);

  const refresh = () => setLeads(getLeads());

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

  const updateStatus = (id, status) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    saveLeads(updated);
    setLeads(updated);
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status });
  };

  const deleteLead = (id) => {
    if (!confirm('Удалить эту заявку?')) return;
    const updated = leads.filter(l => l.id !== id);
    saveLeads(updated);
    setLeads(updated);
    setSelectedLead(null);
  };

  const deleteAll = () => {
    if (!confirm('Удалить все заявки? Это действие необратимо.')) return;
    saveLeads([]);
    setLeads([]);
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
          <button onClick={refresh} style={{ ...s.btn(), padding: '8px 10px' }} title="Обновить">
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

// ── Main admin app ─────────────────────────────────────────────────────────────
export function AdminPanel() {
  const [authed, setAuthed] = React.useState(isAuthenticated);
  const [page, setPage] = React.useState('dashboard');

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  const newLeadsCount = getLeads().filter(l => (l.status || 'new') === 'new').length;

  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: Icons.dashboard },
    { id: 'leads',     label: `Заявки${newLeadsCount > 0 ? ` (${newLeadsCount})` : ''}`, icon: Icons.leads },
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
          <a
            href="/"
            style={{ ...s.logoutBtn, textDecoration: 'none', marginBottom: 4 }}
          >
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
        {page === 'dashboard' && <DashboardPage />}
        {page === 'leads'     && <LeadsPage />}
        {page === 'settings'  && <SettingsPage />}
      </div>
    </div>
  );
}
