import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import middleware from "../middleware.js";
import sitemapHandler from "../api/sitemap.js";
import { INDEXABLE_ROUTES } from "../lib/site-routes.js";
import { createAdminSession, isAdminRequest, requireVpsConfig } from "../lib/server-auth.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cmsFixture = {
  faq: [{ title: "Доставка", questions: [["Тестовый вопрос?", "Тестовый ответ."]] }],
  newArticles: [{
    title: "Новая CMS статья",
    text: "Описание новой статьи.",
    href: "/blog/novaya-cms-statya/",
    datePublished: "2026-07-11",
    dateModified: "2026-07-11",
    author: "BelTransit",
    draft: false,
  }],
};

globalThis.fetch = async (input) => {
  const target = input instanceof URL ? input.href : (typeof input === "string" ? input : input.url);
  const url = new URL(target);
  if (url.pathname === "/api/cms" || url.pathname === "/cms") {
    return Response.json(cmsFixture);
  }
  const file = path.join(root, "dist", url.pathname.replace(/^\//, ""));
  try {
    return new Response(await readFile(file), { status: 200, headers: { "content-type": "text/html" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};

for (const [route] of INDEXABLE_ROUTES) {
  const file = route === "/"
    ? path.join(root, "dist/index.html")
    : path.join(root, "dist", route.replace(/^\//, ""), "index.html");
  const html = await readFile(file, "utf8");
  assert.match(html, /<h1[\s>]/, `${route} must contain a prerendered H1`);
}

const redirect = await middleware(new Request("https://www.beltransit.ru/sbornye-gruzy?from=test"));
assert.equal(redirect.status, 308);
assert.equal(redirect.headers.get("location"), "https://www.beltransit.ru/sbornye-gruzy/?from=test");

const service = await middleware(new Request("https://www.beltransit.ru/sbornye-gruzy/"));
const serviceHtml = await service.text();
assert.equal(service.status, 200);
assert.equal(service.headers.get("x-robots-tag"), "index, follow");
assert.match(serviceHtml, /rel="canonical" href="https:\/\/www\.beltransit\.ru\/sbornye-gruzy\/"/);
assert.match(serviceHtml, /"@type":"Service"/);
assert.match(serviceHtml, /"@type":"FAQPage"/);
assert.match(serviceHtml, /"openingHours":"Mo-Su 10:00-22:00"/);
assert.match(serviceHtml, /<h1[\s>]/);
assert.equal((serviceHtml.match(/id="seo-jsonld"/g) || []).length, 1);

const missing = await middleware(new Request("https://www.beltransit.ru/this-page-does-not-exist/"));
const missingHtml = await missing.text();
assert.equal(missing.status, 404);
assert.equal(missing.headers.get("x-robots-tag"), "noindex, follow");
assert.doesNotMatch(missingHtml, /rel="canonical"/);
assert.match(missingHtml, /Похоже, этот маршрут/);

const thankYou = await middleware(new Request("https://www.beltransit.ru/spasibo/"));
assert.equal(thankYou.status, 200);
assert.equal(thankYou.headers.get("x-robots-tag"), "noindex, follow");
assert.match(await thankYou.text(), />Спасибо!</);

const dynamicArticle = await middleware(new Request("https://www.beltransit.ru/blog/novaya-cms-statya/"));
const dynamicHtml = await dynamicArticle.text();
assert.equal(dynamicArticle.status, 200);
assert.match(dynamicHtml, /Новая CMS статья/);
assert.match(dynamicHtml, /"@type":"BlogPosting"/);

process.env.VPS_API_URL = "https://cms.example";
process.env.VPS_SECRET = "test-vps-secret";
process.env.ADMIN_PASSWORD = "test-admin-password";
process.env.SESSION_SECRET = "test-session-secret-that-is-long-enough";

const token = createAdminSession();
assert.equal(isAdminRequest({ headers: { cookie: `bt_admin_session=${token}` } }), true);
assert.equal(isAdminRequest({ headers: { cookie: "bt_admin_session=invalid" } }), false);
assert.equal(requireVpsConfig().baseUrl, "https://cms.example");
process.env.VPS_API_URL = "http://109.199.105.77";
process.env.ALLOW_INSECURE_VPS_HTTP = "true";
assert.equal(requireVpsConfig().baseUrl, "http://109.199.105.77");
process.env.VPS_API_URL = "https://cms.example";

const sitemapResponse = {
  headers: {}, statusCode: 200, body: "",
  setHeader(key, value) { this.headers[key] = value; },
  status(code) { this.statusCode = code; return this; },
  send(value) { this.body = value; return this; },
  end() { return this; },
};
await sitemapHandler({ method: "GET" }, sitemapResponse);
assert.equal(sitemapResponse.statusCode, 200);
assert.match(sitemapResponse.body, /https:\/\/www\.beltransit\.ru\/blog\/novaya-cms-statya\//);
assert.doesNotMatch(sitemapResponse.body, /<loc>https:\/\/beltransit\.ru/);

const vercel = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
assert.equal(
  vercel.rewrites.some((rewrite) => rewrite.source === "/(.*)"),
  false,
  "A catch-all SPA rewrite would turn missing assets into cacheable HTML responses",
);
const allHeaders = vercel.headers.flatMap((rule) => rule.headers).map((header) => header.key);
for (const required of ["X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "Strict-Transport-Security"]) {
  assert.ok(allHeaders.includes(required), `${required} header is required`);
}

console.log("Technical verification passed: SSG, canonical, redirects, 404, JSON-LD, CMS SEO, sitemap and auth.");
