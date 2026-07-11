// CMS content API — proxies to VPS Express server for persistent storage
// GET  /api/cms  → returns full CMS object (public)
// POST /api/cms  → updates a section (admin auth required)

import { isAdminRequest, requireVpsConfig } from '../lib/server-auth.js';
import { changedCmsPaths, submitIndexNow } from '../lib/indexnow.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', req.method === 'GET' ? 'public, s-maxage=60, stale-while-revalidate=300' : 'private, no-store');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  let vps;
  try {
    vps = requireVpsConfig();
  } catch (error) {
    console.error('CMS API configuration error', error);
    return res.status(503).json({ error: 'Service is not configured' });
  }

  if (req.method === 'GET') {
    try {
      const r = await fetch(`${vps.baseUrl}/cms`);
      const data = await r.json();
      return res.status(200).json(data);
    } catch {
      return res.status(200).json({});
    }
  }

  if (req.method === 'POST') {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const r = await fetch(`${vps.baseUrl}/cms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-vps-secret': vps.secret },
        body: JSON.stringify(req.body || {}),
      });
      const result = await r.json();
      if (!r.ok) return res.status(r.status).json(result);

      const { section, data, key } = req.body || {};
      const paths = changedCmsPaths(section, data, key);
      if (paths.length) {
        try {
          await submitIndexNow(paths);
        } catch (error) {
          console.error('IndexNow publish hook failed', error);
        }
      }
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
