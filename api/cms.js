// CMS content API — backed by Vercel KV (Upstash Redis)
// GET  /api/cms  → returns full CMS object (public)
// POST /api/cms  → updates a section (admin auth required)

const KV_URL   = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const ADMIN_PW = process.env.ADMIN_PASSWORD || 'Beltransit2024!';
const KV_KEY   = 'bt_cms';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const cms = await kvGet(KV_KEY) || {};
    return res.status(200).json(cms);
  }

  if (req.method === 'POST') {
    if (req.headers['x-admin-password'] !== ADMIN_PW) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { section, data, key } = req.body || {};
    const cms = await kvGet(KV_KEY) || {};

    if (section === 'articleBody') {
      cms.articleBodies = cms.articleBodies || {};
      if (data) cms.articleBodies[key] = data;
      else delete cms.articleBodies[key];
    } else if (section) {
      cms[section] = data;
    }

    await kvSet(KV_KEY, cms);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
