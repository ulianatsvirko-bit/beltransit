import { INDEXABLE_ROUTES, SITE_URL, ARTICLE_DATES, DEFAULT_LASTMOD, normalisePublicPath } from "../lib/site-routes.js";

const escapeXml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const routes = new Map(
    INDEXABLE_ROUTES.map(([path, priority, changefreq]) => [
      path,
      [path, priority, changefreq, ARTICLE_DATES[path] || DEFAULT_LASTMOD],
    ]),
  );
  const cmsUrl = process.env.VPS_API_URL;
  if (cmsUrl?.startsWith("https://") || process.env.ALLOW_INSECURE_VPS_HTTP === "true") {
    try {
      const response = await fetch(`${cmsUrl.replace(/\/$/, "")}/cms`);
      if (response.ok) {
        const cms = await response.json();
        for (const post of cms.newArticles || []) {
          if (!post?.draft && post?.href) {
            const path = normalisePublicPath(post.href);
            const lastmod = post.dateModified || post.datePublished || post.date || DEFAULT_LASTMOD;
            routes.set(path, [path, "0.7", "monthly", lastmod]);
          }
        }
      }
    } catch (error) {
      console.error("Sitemap CMS fetch failed", error);
    }
  }

  const urls = [...routes.values()]
    .map(([path, priority, changefreq, lastmod]) =>
      `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority><changefreq>${changefreq}</changefreq></url>`,
    )
    .join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
