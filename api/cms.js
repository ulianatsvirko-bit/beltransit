// CMS content API — proxies to VPS Express server for persistent storage
// GET  /api/cms  → returns full CMS object (public)
// POST /api/cms  → updates a section (admin auth required)

const VPS_API  = process.env.VPS_API_URL  || 'http://109.199.105.77';
const VPS_SEC  = process.env.VPS_SECRET   || 'bt_vps_internal_2024';
const ADMIN_PW = process.env.ADMIN_PASSWORD || 'Beltransit2024!';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const r = await fetch(`${VPS_API}/cms`);
      const data = await r.json();
      return res.status(200).json(data);
    } catch {
      return res.status(200).json({});
    }
  }

  if (req.method === 'POST') {
    if (req.headers['x-admin-password'] !== ADMIN_PW) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const r = await fetch(`${VPS_API}/cms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-vps-secret': VPS_SEC },
        body: JSON.stringify(req.body || {}),
      });
      return res.status(200).json(await r.json());
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
