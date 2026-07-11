export const SITE_URL = "https://www.beltransit.ru";

export const INDEXABLE_ROUTES = [
  ["/", "1.0", "weekly"],
  ["/sbornye-gruzy/", "0.9", "monthly"],
  ["/vykup-tovarov/", "0.9", "monthly"],
  ["/tamozhnoe-oformlenie/", "0.9", "monthly"],
  ["/sankcionnye-gruzy/", "0.9", "monthly"],
  ["/stoimost-dostavki/", "0.9", "monthly"],
  ["/sklad-vilnyus/", "0.8", "monthly"],
  ["/chto-vezem/", "0.8", "monthly"],
  ["/kerhery-i-moyki/", "0.8", "monthly"],
  ["/shiny-i-avtozapchasti/", "0.8", "monthly"],
  ["/bytovaya-tehnika/", "0.8", "monthly"],
  ["/mebel-iz-evropy/", "0.8", "monthly"],
  ["/poisk-postavshchika/", "0.8", "monthly"],
  ["/dlya-logistov/", "0.7", "monthly"],
  ["/kak-my-rabotaem/", "0.7", "monthly"],
  ["/kejsy/", "0.7", "monthly"],
  ["/o-kompanii/", "0.7", "monthly"],
  ["/faq/", "0.7", "monthly"],
  ["/kontakty/", "0.6", "monthly"],
  ["/blog/", "0.8", "weekly"],
  ["/blog/kak-rasschitat-tamozhennye-platezhi/", "0.7", "monthly"],
  ["/blog/marshrut-cherez-belarus/", "0.7", "monthly"],
  ["/blog/oplata-postavshchika-iz-rossii/", "0.7", "monthly"],
  ["/blog/sbornyy-gruz-ili-polnaya-fura/", "0.7", "monthly"],
  ["/blog/pervyy-import-iz-evropy/", "0.7", "monthly"],
  ["/blog/tnved-kody/", "0.7", "monthly"],
];

export const ARTICLE_DATES = {
  "/blog/kak-rasschitat-tamozhennye-platezhi/": "2026-05-14",
  "/blog/marshrut-cherez-belarus/": "2026-04-02",
  "/blog/oplata-postavshchika-iz-rossii/": "2026-03-18",
  "/blog/sbornyy-gruz-ili-polnaya-fura/": "2026-02-27",
  "/blog/pervyy-import-iz-evropy/": "2026-02-05",
  "/blog/tnved-kody/": "2026-01-22",
};

// Only publish a lastmod value when we know the page was materially changed.
// Omitting an unknown date is more useful to search engines than a blanket date.
export const LAST_MODIFIED_DATES = {
  ...ARTICLE_DATES,
  "/": "2026-07-12",
  "/sbornye-gruzy/": "2026-07-12",
  "/vykup-tovarov/": "2026-07-12",
  "/tamozhnoe-oformlenie/": "2026-07-12",
  "/sankcionnye-gruzy/": "2026-07-12",
  "/stoimost-dostavki/": "2026-07-12",
  "/sklad-vilnyus/": "2026-07-11",
  "/chto-vezem/": "2026-07-11",
  "/kerhery-i-moyki/": "2026-07-12",
  "/shiny-i-avtozapchasti/": "2026-07-11",
  "/bytovaya-tehnika/": "2026-07-11",
  "/mebel-iz-evropy/": "2026-07-11",
  "/blog/": "2026-07-12",
  "/blog/kak-rasschitat-tamozhennye-platezhi/": "2026-07-12",
  "/blog/oplata-postavshchika-iz-rossii/": "2026-07-12",
};

export function normalisePublicPath(value) {
  if (!value || value === "/") return "/";
  const path = value.startsWith("/") ? value : `/${value}`;
  return path.endsWith("/") ? path : `${path}/`;
}
