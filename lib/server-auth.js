import crypto from "node:crypto";

const COOKIE_NAME = "bt_admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sign(payload) {
  return crypto
    .createHmac("sha256", requiredEnv("SESSION_SECRET"))
    .update(payload)
    .digest("base64url");
}

function readCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf("=");
        return separator === -1
          ? [part, ""]
          : [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
      }),
  );
}

export function verifyAdminPassword(password) {
  return safeEqual(password || "", requiredEnv("ADMIN_PASSWORD"));
}

export function createAdminSession() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isAdminRequest(req) {
  try {
    const token = readCookies(req)[COOKIE_NAME];
    if (!token) return false;
    const [payload, signature] = token.split(".");
    if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number(data.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function sessionCookie(token) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

export function requireVpsConfig() {
  const baseUrl = requiredEnv("VPS_API_URL");
  const temporaryHttpException = process.env.ALLOW_INSECURE_VPS_HTTP === "true";
  if (!baseUrl.startsWith("https://") && !temporaryHttpException) {
    throw new Error("VPS_API_URL must use HTTPS unless the temporary HTTP exception is explicitly enabled");
  }
  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    secret: requiredEnv("VPS_SECRET"),
  };
}
