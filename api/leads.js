// Leads API — backed by Vercel KV (Upstash Redis)
// GET    /api/leads  → list all leads (admin auth)
// POST   /api/leads  → add one lead (public — from contact forms)
// PUT    /api/leads  → replace all leads (admin auth — for status updates)
// DELETE /api/leads  → clear all leads (admin auth)

const KV_URL   = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const ADMIN_PW = process.env.ADMIN_PASSWORD || 'Beltransit2024!';
const KV_KEY   = 'bt_leads';

async function kvGet(key) {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const r = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const json = await r.json();
    if (!json.result) return null;
    return JSON.parse(json.result);
  } catch { return null; }
}

async function kvSet(key, value) {
  if (!KV_URL || !KV_TOKEN) return;
  await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([['SET', key, JSON.stringify(value)]]),
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authed = req.headers['x-admin-password'] === ADMIN_PW;

  if (req.method === 'GET') {
    if (!authed) return res.status(401).json({ error: 'Unauthorized' });
    const leads = await kvGet(KV_KEY) || [];
    return res.status(200).json(leads);
  }

  if (req.method === 'POST') {
    // Public endpoint — called from contact forms on the site
    const leads = await kvGet(KV_KEY) || [];
    const lead = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ts: new Date().toISOString(),
      status: 'new',
      ...(req.body || {}),
    };
    leads.unshift(lead);
    await kvSet(KV_KEY, leads);
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'PUT') {
    // Admin: replace full leads array (used when updating statuses)
    if (!authed) return res.status(401).json({ error: 'Unauthorized' });
    await kvSet(KV_KEY, req.body || []);
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    if (!authed) return res.status(401).json({ error: 'Unauthorized' });
    await kvSet(KV_KEY, []);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
