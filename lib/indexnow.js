import { SITE_URL, normalisePublicPath } from "./site-routes.js";

const INDEXNOW_KEY = "3bfca7e70101598b4915db3912fe4e39";

export async function submitIndexNow(paths) {
  const urlList = [...new Set(paths)]
    .map(normalisePublicPath)
    .filter((path) => path !== "/admin/" && !path.startsWith("/api/"))
    .map((path) => `${SITE_URL}${path}`);

  if (!urlList.length) return { submitted: 0 };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "www.beltransit.ru",
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  if (!response.ok && response.status !== 202) {
    throw new Error(`IndexNow returned ${response.status}`);
  }
  return { submitted: urlList.length, status: response.status };
}

export function changedCmsPaths(section, data, key) {
  if (section === "newArticles" || section === "blogPosts") {
    return (Array.isArray(data) ? data : [])
      .filter((post) => !post?.draft && post?.href)
      .map((post) => post.href);
  }
  if (section === "articleBody" && key) return [key];
  if (section === "faq") return ["/faq/"];
  if (section === "cases") return ["/kejsy/"];
  if (section === "contacts") return ["/kontakty/"];
  return [];
}
