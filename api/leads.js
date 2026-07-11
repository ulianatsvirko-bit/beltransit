// Leads API — proxies to VPS Express server for persistent storage
// GET    /api/leads  → list all leads (admin auth)
// POST   /api/leads  → add one lead (public — from contact forms)
// PUT    /api/leads  → replace all leads (admin auth — for status updates)
// DELETE /api/leads  → clear all leads (admin auth)

import { isAdminRequest, requireVpsConfig } from '../lib/server-auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authed = isAdminRequest(req);

  let vps;
  try {
    vps = requireVpsConfig();
  } catch (error) {
    console.error('Leads API configuration error', error);
    return res.status(503).json({ error: 'Service is not configured' });
  }

  if (req.method === 'GET') {
    if (!authed) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const r = await fetch(`${vps.baseUrl}/leads`, {
        headers: { 'x-vps-secret': vps.secret },
      });
      return res.status(200).json(await r.json());
    } catch {
      return res.status(200).json([]);
    }
  }

  if (req.method === 'POST') {
    try {
      const r = await fetch(`${vps.baseUrl}/leads`, {
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
      const r = await fetch(`${vps.baseUrl}/leads`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-vps-secret': vps.secret },
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
      const r = await fetch(`${vps.baseUrl}/leads`, {
        method: 'DELETE',
        headers: { 'x-vps-secret': vps.secret },
      });
      return res.status(200).json(await r.json());
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
