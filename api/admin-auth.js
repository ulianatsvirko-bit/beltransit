import {
  clearSessionCookie,
  createAdminSession,
  isAdminRequest,
  sessionCookie,
  verifyAdminPassword,
} from "../lib/server-auth.js";

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function clientKey(req) {
  return String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
}

function isRateLimited(req) {
  const key = clientKey(req);
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > MAX_ATTEMPTS;
}

function clearAttempts(req) {
  attempts.delete(clientKey(req));
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");

  if (req.method === "GET") {
    return res.status(isAdminRequest(req) ? 200 : 401).json({ authenticated: isAdminRequest(req) });
  }

  if (req.method === "POST") {
    if (isRateLimited(req)) {
      res.setHeader("Retry-After", "900");
      return res.status(429).json({ error: "Too many login attempts" });
    }

    try {
      if (!verifyAdminPassword(req.body?.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      clearAttempts(req);
      res.setHeader("Set-Cookie", sessionCookie(createAdminSession()));
      return res.status(200).json({ authenticated: true });
    } catch (error) {
      console.error("Admin auth configuration error", error);
      return res.status(503).json({ error: "Admin authentication is not configured" });
    }
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearSessionCookie());
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
