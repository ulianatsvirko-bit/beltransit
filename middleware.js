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
 * Static routes are prerendered; this layer keeps route metadata fresh at the edge.
 */

import { SITE_URL as BASE_URL, ARTICLE_DATES } from "./lib/site-routes.js";
import { ROUTE_FAQS } from "./lib/generated-faq-data.js";

// Per-page SEO data is server-owned; the client no longer duplicates this map.
export const SEO = {
  "/": {
    title: "Доставка и выкуп грузов из Европы в Россию — BelTransit",
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
  "/stoimost-dostavki/": {
    title: "Стоимость доставки груза из Европы в Россию — расчёт | BelTransit",
    description:
      "Из чего складывается стоимость доставки груза из Европы: вес, тип отправки, таможня, страна поставщика. Расчёт за 2 часа, без предоплаты.",
  },
  "/sankcionnye-gruzy/": {
    title: "Доставка санкционных грузов из Европы в Россию | BelTransit",
    description:
      "Выкуп и доставка санкционных грузов из Европы в Россию. Переговоры от лица европейского юрлица без российского следа, выкуп с 0% НДС, оплата в рублях, таможня под ключ.",
  },
  "/chto-vezem/": {
    title: "Какие грузы можно заказать из Европы — каталог категорий | BelTransit",
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
    title: "Как рассчитать таможенные платежи в 2026 году | BelTransit",
    description:
      "Пошаговый расчёт: ввозная пошлина, НДС, таможенные сборы. Примеры для разных категорий товаров. Актуально в 2026 году.",
  },
  "/blog/marshrut-cherez-belarus/": {
    title: "Маршрут через Беларусь для доставки из Европы | BelTransit",
    description:
      "Маршрут Европа–Беларусь–Россия: особенности, документы, стоимость. Сравнение с маршрутом через страны Балтии.",
  },
  "/blog/oplata-postavshchika-iz-rossii/": {
    title: "Как оплатить европейского поставщика из России в 2026 | BelTransit",
    description:
      "Рабочие способы оплаты европейским поставщикам из России в 2026: через Литву, Армению, SWIFT, платёжные агенты.",
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

const SERVICE_PATHS = new Set([
  "/sbornye-gruzy/", "/vykup-tovarov/", "/tamozhnoe-oformlenie/",
  "/sklad-vilnyus/", "/stoimost-dostavki/", "/sankcionnye-gruzy/",
  "/poisk-postavshchika/", "/dlya-logistov/",
]);

const PAGE_LABELS = {
  "/sbornye-gruzy/": "Сборные грузы",
  "/vykup-tovarov/": "Выкуп товаров",
  "/tamozhnoe-oformlenie/": "Таможенное оформление",
  "/sklad-vilnyus/": "Склад в Вильнюсе",
  "/stoimost-dostavki/": "Стоимость доставки",
  "/sankcionnye-gruzy/": "Санкционные грузы",
  "/chto-vezem/": "Что мы везём",
  "/poisk-postavshchika/": "Поиск поставщика",
  "/dlya-logistov/": "Для логистов",
  "/kak-my-rabotaem/": "Как мы работаем",
  "/o-kompanii/": "О компании",
  "/kejsy/": "Кейсы",
  "/faq/": "FAQ",
  "/kontakty/": "Контакты",
  "/blog/": "Блог",
};

function organisationSchema() {
  return {
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#business`,
    name: "BelTransit",
    url: `${BASE_URL}/`,
    logo: `${BASE_URL}/og-image.png`,
    image: `${BASE_URL}/og-image.png`,
    telephone: "+79265471894",
    email: "beltransit2012@gmail.com",
    foundingDate: "2013",
    address: { "@type": "PostalAddress", addressLocality: "Вильнюс", addressCountry: "LT" },
    sameAs: ["https://t.me/beltransit"],
  };
}

export function buildJsonLd(path, data, cms) {
  const graph = [organisationSchema()];
  const canonical = `${BASE_URL}${path}`;

  if (path === "/") {
    graph.push({ "@type": "WebSite", "@id": `${BASE_URL}/#website`, url: `${BASE_URL}/`, name: "BelTransit" });
  } else {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE_URL}/` },
        ...(path.startsWith("/blog/") && path !== "/blog/"
          ? [{ "@type": "ListItem", position: 2, name: "Блог", item: `${BASE_URL}/blog/` }]
          : []),
        {
          "@type": "ListItem",
          position: path.startsWith("/blog/") && path !== "/blog/" ? 3 : 2,
          name: PAGE_LABELS[path] || data.title.replace(/\s*[|—].*$/, ""),
          item: canonical,
        },
      ],
    });
  }

  if (SERVICE_PATHS.has(path)) {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: data.title.replace(/\s*[|—].*$/, ""),
      description: data.description,
      url: canonical,
      provider: { "@id": `${BASE_URL}/#business` },
      areaServed: ["RU", "LT", "EU"],
    });
  }

  if (path.startsWith("/blog/") && path !== "/blog/") {
    graph.push({
      "@type": "BlogPosting",
      "@id": `${canonical}#article`,
      headline: data.title.replace(/\s*[|—].*$/, ""),
      description: data.description,
      url: canonical,
      mainEntityOfPage: canonical,
      image: data.image?.startsWith("http") ? data.image : `${BASE_URL}${data.image || "/og-image.png"}`,
      datePublished: data.datePublished || ARTICLE_DATES[path],
      dateModified: data.dateModified || data.datePublished || ARTICLE_DATES[path],
      author: { "@type": "Organization", name: data.author || "BelTransit" },
      publisher: { "@id": `${BASE_URL}/#business` },
    });
  }

  const questions = path === "/faq/" && Array.isArray(cms?.faq)
    ? cms.faq.flatMap((category) => category.questions || [])
    : ROUTE_FAQS[path];
  if (Array.isArray(questions)) {
    if (questions.length) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: questions.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      });
    }
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

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
  if (rawPath !== path) {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = path;
    return Response.redirect(redirectUrl, 308);
  }

  let cms = null;
  if (path === "/faq/" || (!SEO[path] && path.startsWith("/blog/"))) {
    try {
      const cmsResponse = await fetch(new URL("/api/cms", url.origin));
      if (cmsResponse.ok) cms = await cmsResponse.json();
    } catch {
      // The static routes still work when CMS is temporarily unavailable.
    }
  }

  const isStaticRoute = Boolean(SEO[path]);
  let isDynamicCmsRoute = false;
  let data = SEO[path];
  if (!data && path.startsWith("/blog/") && cms) {
    const post = [...(cms.blogPosts || []), ...(cms.newArticles || [])]
      .find((item) => !item.draft && `${item.href || ""}`.replace(/\/?$/, "/") === path);
    if (post) {
      isDynamicCmsRoute = true;
      data = {
        title: `${post.title} | BelTransit`,
        description: post.text || post.description || "Практическая статья о логистике и импорте из Европы.",
        datePublished: post.datePublished || post.date,
        dateModified: post.dateModified || post.datePublished || post.date,
        author: post.author,
        image: post.image,
      };
    }
  }

  const isKnownRoute = Boolean(data);
  data = data || {
        title: "Страница не найдена — BelTransit",
        description: "Такой страницы нет. Вернитесь на главную или выберите нужную услугу.",
      };
  const canonical = isKnownRoute ? `${BASE_URL}${path}` : null;

  // Fetch the static index.html — skip header prevents re-entry
  let res;
  try {
    const htmlPath = isDynamicCmsRoute
      ? "/shell.html"
      : isStaticRoute
        ? (path === "/" ? "/index.html" : `${path}index.html`)
        : "/404.html";
    res = await fetch(new URL(htmlPath, url.origin), {
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

  if (isDynamicCmsRoute) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><main><article class="dynamic-article-shell"><p class="eyebrow">Блог BelTransit</p><h1>${t}</h1><p>${d}</p></article></main></div>`,
    );
  }

  // ── title ────────────────────────────────────────────────────────────────
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`);

  // ── meta description ─────────────────────────────────────────────────────
  html = html.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${d}">`,
  );

  // ── canonical ─────────────────────────────────────────────────────────────
  if (!isKnownRoute) {
    html = html.replace(/\s*<link\s[^>]*rel="canonical"[^>]*>/i, "");
  } else if (/<link\s[^>]*rel="canonical"/i.test(html)) {
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
    `<meta property="og:url" content="${canonical || `${BASE_URL}/`}">`,
  );
  html = html.replace(
    /<meta\s+property="og:type"[^>]*>/i,
    `<meta property="og:type" content="${path.startsWith("/blog/") && path !== "/blog/" ? "article" : "website"}">`,
  );
  if (data.image) {
    const socialImage = data.image.startsWith("http") ? data.image : `${BASE_URL}${data.image}`;
    html = html.replace(
      /<meta\s+property="og:image"[^>]*>/i,
      `<meta property="og:image" content="${esc(socialImage)}">`,
    );
    html = html.replace(
      /<meta\s+name="twitter:image"[^>]*>/i,
      `<meta name="twitter:image" content="${esc(socialImage)}">`,
    );
  }

  // ── Twitter / X ───────────────────────────────────────────────────────────
  html = html.replace(
    /<meta\s+name="twitter:title"[^>]*>/i,
    `<meta name="twitter:title" content="${t}">`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${d}">`,
  );

  if (isKnownRoute && path !== "/spasibo/") {
    const jsonLd = JSON.stringify(buildJsonLd(path, data, cms)).replace(/</g, "\\u003c");
    const jsonLdTag = `<script id="seo-jsonld" type="application/ld+json">${jsonLd}</script>`;
    if (/<script\s+id="seo-jsonld"[^>]*>[\s\S]*?<\/script>/i.test(html)) {
      html = html.replace(/<script\s+id="seo-jsonld"[^>]*>[\s\S]*?<\/script>/i, jsonLdTag);
    } else {
      html = html.replace("</head>", `  ${jsonLdTag}\n</head>`);
    }
  }

  return new Response(html, {
    status: isKnownRoute ? 200 : 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-robots-tag": !isKnownRoute || path === "/spasibo/" ? "noindex, follow" : "index, follow",
    },
  });
}
