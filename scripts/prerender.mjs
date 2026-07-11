import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INDEXABLE_ROUTES } from "../lib/site-routes.js";
import { render } from "../dist-ssr/entry-server.js";
import { SEO, buildJsonLd } from "../middleware.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const template = await readFile(path.join(root, "dist/index.html"), "utf8");
await writeFile(path.join(root, "dist/shell.html"), template);

const escapeAttribute = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

function injectSeo(html, route, { noindex = false } = {}) {
  const data = SEO[route];
  if (!data) return html;
  const title = escapeAttribute(data.title);
  const description = escapeAttribute(data.description);
  const canonical = `https://www.beltransit.ru${route}`;
  let output = html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${description}">`)
    .replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${title}">`)
    .replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${description}">`)
    .replace(/<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${title}">`)
    .replace(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${description}">`);
  const additions = [`<link rel="canonical" href="${canonical}">`];
  if (noindex) additions.push('<meta name="robots" content="noindex, follow">');
  else {
    const jsonLd = JSON.stringify(buildJsonLd(route, data, null)).replace(/</g, "\\u003c");
    additions.push(`<script id="seo-jsonld" type="application/ld+json">${jsonLd}</script>`);
  }
  return output.replace("</head>", `  ${additions.join("\n  ")}\n</head>`);
}

for (const [route] of INDEXABLE_ROUTES) {
  const appHtml = render(route);
  const html = injectSeo(
    template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
    route,
  );
  const directory = route === "/"
    ? path.join(root, "dist")
    : path.join(root, "dist", route.replace(/^\//, ""));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
}

const standalonePages = [
  ["/spasibo/", path.join(root, "dist/spasibo/index.html")],
  ["/__not-found__/", path.join(root, "dist/404.html")],
];
for (const [route, destination] of standalonePages) {
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(
    destination,
    route === "/spasibo/"
      ? injectSeo(template.replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`), route, { noindex: true })
      : template
          .replace(/<title>[^<]*<\/title>/, '<title>Страница не найдена — BelTransit</title>')
          .replace("</head>", '  <meta name="robots" content="noindex, follow">\n</head>')
          .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`),
  );
}

const adminDirectory = path.join(root, "dist/admin");
await mkdir(adminDirectory, { recursive: true });
await writeFile(
  path.join(adminDirectory, "index.html"),
  template
    .replace("</head>", '  <meta name="robots" content="noindex, nofollow">\n</head>')
    .replace('<div id="root"></div>', '<div id="root"><div class="admin-loading" role="status">Загружаем панель…</div></div>'),
);

console.log(`Prerendered ${INDEXABLE_ROUTES.length} indexable routes and 3 utility pages.`);
