// Leads API — proxies to VPS Express server for persistent storage
// GET    /api/leads  → list all leads (admin auth)
// POST   /api/leads  → add one lead (public — from contact forms)
// PUT    /api/leads  → replace all leads (admin auth — for status updates)
// DELETE /api/leads  → clear all leads (admin auth)

const VPS_API  = process.env.VPS_API_URL  || 'http://109.199.105.77';
const VPS_SEC  = process.env.VPS_SECRET   || 'bt_vps_internal_2024';
const ADMIN_PW = process.env.ADMIN_PASSWORD || 'Beltransit2024!';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authed = req.headers['x-admin-password'] === ADMIN_PW;

  if (req.method === 'GET') {
    if (!authed) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const r = await fetch(`${VPS_API}/leads`, {
        headers: { 'x-vps-secret': VPS_SEC },
      });
      return res.status(200).json(await r.json());
    } catch {
      return res.status(200).json([]);
    }
  }

  if (req.method === 'POST') {
    try {
      const r = await fetch(`${VPS_API}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body || {}),
      });
      return res.status(200).json(await r.json());
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  if (req.method === 'PUT') {
    if (!authed) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const r = await fetch(`${VPS_API}/leads`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-vps-secret': VPS_SEC },
        body: JSON.stringify(req.body || []),
      });
      return res.status(200).json(await r.json());
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  if (req.method === 'DELETE') {
    if (!authed) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const r = await fetch(`${VPS_API}/leads`, {
        method: 'DELETE',
        headers: { 'x-vps-secret': VPS_SEC },
      });
      return res.status(200).json(await r.json());
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
