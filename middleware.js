/**
 * Vercel Edge Middleware — server-side SEO meta tag injection.
 *
 * Problem: the site is a React SPA. Every URL serves the same index.html,
 * so search engine bots (especially Yandex, which renders JS poorly) see
 * the same generic title/description for every page.
 *
 * Solution: this middleware intercepts every HTML request, fetches
 * index.html, injects the correct title/description/canonical/OG tags
 * for that specific URL, and returns the modified HTML — before any JS runs.
 *
 * Client-side useSEO() hook still runs in the browser for runtime updates.
 */

const BASE_URL = "https://beltransit.ru";

// Per-page SEO data — keep in sync with SEO_DATA in src/main.jsx
const SEO = {
  "/": {
    title: "BelTransit — доставка и выкуп грузов из Европы",
    description:
      "Сборные грузы от 20 кг, выкуп у европейских поставщиков, таможня, склад в Вильнюсе. Работаем с 2013 года. Срок от 11 дней. Рассчитаем стоимость за 2 часа.",
  },
  "/sbornye-gruzy/": {
    title: "Сборные грузы из Европы — доставка в Россию | BelTransit",
    description:
      "Сборные грузы из Европы в Россию от 20 кг. Консолидация на складе в Вильнюсе, фура раз в неделю. Срок 11–14 дней. Рассчитаем за 2 часа.",
  },
  "/vykup-tovarov/": {
    title: "Выкуп товаров в Европе для российских компаний | BelTransit",
    description:
      "Выкупаем товары у европейских поставщиков от имени литовской компании. Решаем проблему платежей после 2022. Доставка в Россию за 12–16 дней.",
  },
  "/tamozhnoe-oformlenie/": {
    title: "Таможенное оформление грузов из Европы под ключ | BelTransit",
    description:
      "Таможенное оформление грузов из Европы: расчёт платежей, декларация, выпуск за 2–3 дня. Работаем с любыми ТН ВЭД кодами.",
  },
  "/sklad-vilnyus/": {
    title: "Склад в Вильнюсе — консолидация грузов из Европы | BelTransit",
    description:
      "Склад в Вильнюсе для консолидации грузов из Европы. Принимаем от любых поставщиков, проверяем, маркируем. Фура в Россию раз в неделю.",
  },
  "/fury-konteynery/": {
    title: "Перевозка полных фур и контейнеров из Европы | BelTransit",
    description:
      "Полные фуры и контейнеры из Европы в Россию. Любые грузы от 10 тонн, негабарит, специальный транспорт. Срок от 8 дней.",
  },
  "/chto-vezem/": {
    title: "Что мы везём из Европы — каталог грузов | BelTransit",
    description:
      "Везём автозапчасти, технику, шины, инструменты, стройматериалы и другие товары из Европы. Узнайте условия на вашу категорию.",
  },
  "/kerhery-i-moyki/": {
    title: "Кёрхеры и моющее оборудование из Германии | BelTransit",
    description:
      "Доставка Kärcher и профессионального моющего оборудования из Германии. Выкуп у дилера, доставка в Россию за 11–14 дней. Экономия до 30%.",
  },
  "/shiny-i-avtozapchasti/": {
    title: "Шины и автозапчасти из Европы — выкуп и доставка | BelTransit",
    description:
      "Выкуп и доставка шин, автозапчастей из Германии, Польши, Чехии в Россию. Экономия до 25% от российских цен. Срок 10–14 дней.",
  },
  "/bytovaya-tehnika/": {
    title: "Бытовая техника из Европы — выкуп у поставщика | BelTransit",
    description:
      "Бытовая техника из Германии, Австрии, Италии напрямую от производителей. Выкуп от имени литовской компании, доставка в Россию за 12–15 дней.",
  },
  "/mebel-iz-evropy/": {
    title: "Мебель из Европы — доставка из Италии, Германии, Польши | BelTransit",
    description:
      "Доставка мебели из Италии, Германии, Польши в Россию. Консолидация на складе в Вильнюсе, несколько поставщиков — одна отправка.",
  },
  "/poisk-postavshchika/": {
    title: "Поиск поставщика в Европе — находим за 5–7 дней | BelTransit",
    description:
      "Найдём европейского производителя за 5–7 дней. Проверяем производителей, запрашиваем прайсы, организуем первую поставку.",
  },
  "/dlya-logistov/": {
    title: "Субподряд для логистов и экспедиторов | BelTransit",
    description:
      "Субподряд для российских логистических компаний: склад в Вильнюсе, таможенное оформление, плечо Европа–Россия. Работаем B2B.",
  },
  "/kak-my-rabotaem/": {
    title: "Как работает доставка из Европы — процесс | BelTransit",
    description:
      "Подробно о процессе доставки: от заявки до получения груза. 4 шага, прозрачное ценообразование, один менеджер на всём маршруте.",
  },
  "/o-kompanii/": {
    title: "О компании — BelTransit с 2013 года | BelTransit",
    description:
      "БелТранзит — логистическая компания с 2013 года. Склад в Вильнюсе, офисы в России и Литве. Более 10 000 доставленных грузов.",
  },
  "/kejsy/": {
    title: "Кейсы доставок из Европы — реальные истории | BelTransit",
    description:
      "Реальные примеры доставок из Европы: автозапчасти, оборудование, велосипеды, стройматериалы. Результаты, сроки, сэкономленные деньги.",
  },
  "/faq/": {
    title: "Частые вопросы о доставке грузов из Европы | BelTransit",
    description:
      "Ответы на вопросы о доставке грузов из Европы: сроки, стоимость, таможня, выкуп, минимальные объёмы. Свяжитесь если не нашли ответ.",
  },
  "/kontakty/": {
    title: "Контакты BelTransit — телефон, Telegram, email",
    description:
      "Контакты BelTransit: +7 926 547-18-94, Telegram, beltransit2012@gmail.com. Офис в Вильнюсе. Работаем 6 дней в неделю.",
  },
  "/blog/": {
    title: "Блог о доставке грузов из Европы | BelTransit",
    description:
      "Статьи о логистике, таможне, маршрутах и поставщиках. Практические гиды для тех, кто везёт товар из Европы в Россию.",
  },
  "/blog/kak-rasschitat-tamozhennye-platezhi/": {
    title: "Как рассчитать таможенные платежи в 2025 году | BelTransit",
    description:
      "Пошаговый расчёт: ввозная пошлина, НДС, таможенные сборы. Примеры для разных категорий товаров. Актуально в 2025 году.",
  },
  "/blog/marshrut-cherez-belarus/": {
    title: "Маршрут через Беларусь для доставки из Европы | BelTransit",
    description:
      "Маршрут Европа–Беларусь–Россия: особенности, документы, стоимость. Сравнение с маршрутом через страны Балтии.",
  },
  "/blog/oplata-postavshchika-iz-rossii/": {
    title: "Как оплатить европейского поставщика из России в 2025 | BelTransit",
    description:
      "Рабочие способы оплаты европейским поставщикам из России в 2025: через Литву, Армению, SWIFT, платёжные агенты.",
  },
  "/blog/sbornyy-gruz-ili-polnaya-fura/": {
    title: "Сборный груз или полная фура — что выбрать | BelTransit",
    description:
      "Сравниваем сборные грузы и полные фуры: цена, сроки, минимальный объём, риски. Как выбрать тип перевозки.",
  },
  "/blog/pervyy-import-iz-evropy/": {
    title: "Первый импорт из Европы — пошаговое руководство | BelTransit",
    description:
      "Как организовать первую поставку из Европы в Россию: поиск поставщика, оплата, таможня, документы. Пошаговый гид.",
  },
  "/blog/tnved-kody/": {
    title: "ТН ВЭД коды — что это и как найти нужный | BelTransit",
    description:
      "Что такое ТН ВЭД коды, зачем нужны при импорте, как найти правильный код для товара. Примеры и советы.",
  },
  "/spasibo/": {
    title: "Заявка принята — BelTransit",
    description: "Ваша заявка принята. Менеджер свяжется с вами в течение 2 часов.",
  },
};

// Header used to skip middleware on internal index.html fetch (prevents loops)
const SKIP_HEADER = "x-bt-mw-skip";

// Routes that should never be transformed
const ASSET_RE =
  /^\/(_vercel|api|assets)\//i;
const FILE_RE =
  /\.(js|css|json|ico|png|jpg|jpeg|webp|avif|svg|woff2?|ttf|otf|txt|xml|map)(\?.*)?$/i;
const ADMIN_RE = /^\/admin(\/.*)?$/i;

export const config = {
  matcher: ["/((?!_vercel|api).*)"],
};

export default async function middleware(request) {
  // Skip our own internal fetch to avoid infinite loop
  if (request.headers.get(SKIP_HEADER)) return;

  const url = new URL(request.url);
  const rawPath = url.pathname;

  // Pass through static assets and admin panel (no SEO injection needed)
  if (ASSET_RE.test(rawPath) || FILE_RE.test(rawPath) || ADMIN_RE.test(rawPath)) return;

  // Normalise trailing slash
  const path = rawPath.endsWith("/") ? rawPath : rawPath + "/";
  const data = SEO[path] || SEO["/"];
  const canonical = `${BASE_URL}${path}`;

  // Fetch the static index.html — skip header prevents re-entry
  let res;
  try {
    res = await fetch(new URL("/index.html", url.origin), {
      headers: { [SKIP_HEADER]: "1" },
    });
  } catch {
    return; // Network error — let Vercel serve as-is
  }

  if (!res.ok) return;

  let html = await res.text();

  const esc = (s) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const t = esc(data.title);
  const d = esc(data.description);

  // ── title ────────────────────────────────────────────────────────────────
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`);

  // ── meta description ─────────────────────────────────────────────────────
  html = html.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${d}">`,
  );

  // ── canonical ─────────────────────────────────────────────────────────────
  if (/<link\s[^>]*rel="canonical"/i.test(html)) {
    html = html.replace(
      /<link\s[^>]*rel="canonical"[^>]*>/i,
      `<link rel="canonical" href="${canonical}">`,
    );
  } else {
    html = html.replace("</head>", `  <link rel="canonical" href="${canonical}">\n</head>`);
  }

  // ── Open Graph ────────────────────────────────────────────────────────────
  html = html.replace(
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${t}">`,
  );
  html = html.replace(
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${d}">`,
  );
  html = html.replace(
    /<meta\s+property="og:url"[^>]*>/i,
    `<meta property="og:url" content="${canonical}">`,
  );

  // ── Twitter / X ───────────────────────────────────────────────────────────
  html = html.replace(
    /<meta\s+name="twitter:title"[^>]*>/i,
    `<meta name="twitter:title" content="${t}">`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${d}">`,
  );

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-robots-tag": "index, follow",
    },
  });
}
