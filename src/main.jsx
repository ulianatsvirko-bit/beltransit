import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Bike,
  Building2,
  Check,
  ClipboardCheck,
  Container,
  Factory,
  Handshake,
  MapPin,
  Menu,
  Package,
  Phone,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sofa,
  Store,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import logoMark from "./assets/beltransit-logo-mark.png";
import "./styles.css";

const services = [
  {
    icon: Package,
    title: "Сборные грузы",
    text: "Консолидация от 500 кг, склад Вильнюс и доставка в РФ.",
    href: "/sbornye-gruzy/",
  },
  {
    icon: ShoppingCart,
    title: "Выкуп товаров в Европе",
    text: "Оплачиваем поставщику, проверяем документы и везём дальше.",
    href: "/vykup-tovarov/",
  },
  {
    icon: Building2,
    title: "Склад в Вильнюсе",
    text: "Принимаем, храним, маркируем и собираем партии в Литве.",
    href: "/sklad-vilnyus/",
  },
  {
    icon: ClipboardCheck,
    title: "Таможенное оформление",
    text: "Готовим документы, декларации и сопровождаем выпуск.",
    href: "/tamozhnoe-oformlenie/",
  },
  {
    icon: Truck,
    title: "Фуры и контейнеры",
    text: "FTL, контейнеры и прямые машины под срочные задачи.",
    href: "/fury-konteynery/",
  },
  {
    icon: Search,
    title: "Поиск поставщика",
    text: "Находим европейских поставщиков и проверяем условия сделки.",
    href: "/poisk-postavshchika/",
  },
];

const cargo = [
  ["Автозапчасти", Settings],
  ["Велосипеды", Bike],
  ["Бытовая техника", Zap],
  ["Инструменты", Wrench],
  ["Стройматериалы", Factory],
  ["Сантехника", ShieldCheck],
  ["Мебель", Sofa],
  ["Другие товары", Package],
];

const cases = [
  {
    title: "Автозапчасти из Германии, 2 тонны",
    meta: "12 дней",
    text: "Выкуп + доставка + растаможка. Работаем с клиентом уже 3 года, ни разу не подвели.",
  },
  {
    title: "Велосипеды из Польши, 800 кг",
    meta: "Сборный груз",
    text: "Забрали у поставщика, приняли на склад в Вильнюсе и доставили в Москву.",
  },
  {
    title: "Бытовая техника из Италии, 1.5 тонны",
    meta: "14 дней",
    text: "Выкупили у поставщика, собрали документы и довезли до двери получателя.",
  },
];

const advantages = [
  "Склад в Вильнюсе — физический актив, не посредник",
  "Сами выкупаем у поставщика — одно окно",
  "12 лет в логистике — знаем всех на рынке",
  "Работаем с малым бизнесом — берём от 500 кг",
];

const groupageStats = [
  ["от 500 кг", "минимальный вес"],
  ["7 дней", "срок доставки"],
  ["1 склад", "в Вильнюсе"],
  ["1 окно", "выкуп + доставка + таможня"],
];

const groupageSteps = [
  ["1", "Заявка", "Оставляете запрос"],
  ["2", "Расчёт", "За 2 часа считаем цену"],
  ["3", "Забираем", "У поставщика в любой стране Европы"],
  ["4", "Склад", "Вильнюс — консолидация"],
  ["5", "Доставка", "До двери в РФ + таможня"],
];

const groupageAudiences = [
  {
    icon: ShoppingCart,
    title: "Wildberries и маркетплейсы",
    text: "Везёте товар из Европы для продажи онлайн. Небольшие партии, регулярно.",
  },
  {
    icon: Store,
    title: "Рыночники и оптовики",
    text: "Закупаете товар в Европе для продажи на рынках и в магазинах Москвы и регионов.",
  },
  {
    icon: Building2,
    title: "Малый бизнес",
    text: "Нужны запчасти, оборудование или материалы из Европы — но целая фура не нужна.",
  },
];

const groupageAdvantages = [
  "Свой склад в Вильнюсе — не перекупщики",
  "Сами выкупаем у поставщика — не нужно ехать в Европу",
  "Фура раз в неделю — не ждёте месяц",
  "Берём от 500 кг — не отказываем малому бизнесу",
  "Таможня включена — никаких сюрпризов на границе",
];

const groupageFaq = [
  [
    "Какой минимальный вес для сборного груза?",
    "Обычно берём партии от 500 кг. Если груз легче, всё равно напишите: иногда можно объединить его с регулярной отправкой.",
  ],
  [
    "Сколько стоит доставка сборного груза из Европы?",
    "Цена зависит от страны, веса, объёма, типа товара и документов. Первичный расчёт готовим за 2 часа в рабочее время.",
  ],
  [
    "Как вы выкупаете товар у поставщика?",
    "Проверяем счёт и условия, оплачиваем поставщику, забираем груз и дальше ведём перевозку, склад и таможню в одном окне.",
  ],
  [
    "Что если поставщик не хочет работать с посредником?",
    "Мы можем выступить понятной стороной сделки, согласовать документы и забрать груз так, чтобы поставщику не пришлось разбираться в логистике в РФ.",
  ],
  [
    "Какие товары вы не везёте?",
    "Не берём запрещённые к перевозке товары, опасные грузы без документов и позиции, которые нельзя легально оформить на таможне.",
  ],
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="BelTransit главная">
        <span className="brand-mark">
          <img src={logoMark} alt="" />
        </span>
        <span>
          <strong>BelTransit</strong>
          <small>Europe freight desk</small>
        </span>
      </a>
      <nav className="main-nav" aria-label="Основная навигация">
        <div className="nav-service">
          <a href="/sbornye-gruzy/">Услуги</a>
          <div className="service-menu">
            {services.map((service) => (
              <a key={service.title} href={service.href}>
                {service.title}
              </a>
            ))}
          </div>
        </div>
        <a href="/o-kompanii/">О компании</a>
        <a href="/kejsy/">Кейсы</a>
        <a href="/blog/">Блог</a>
        <a href="/kontakty/">Контакты</a>
      </nav>
      <a className="button button-primary header-cta" href="/kalkulyator/">
        Рассчитать стоимость
      </a>
      <button className="mobile-menu" aria-label="Открыть меню">
        <Menu size={22} />
      </button>
    </header>
  );
}

function RouteMap() {
  return (
    <div className="route-map" aria-hidden="true">
      <svg viewBox="0 0 760 430" role="img">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="760" height="430" fill="url(#grid)" />
        <path
          className="map-line ghost"
          d="M98 291 C174 214 222 169 310 184 C382 196 416 104 482 128 C552 153 579 234 638 203"
        />
        <path
          className="map-line live"
          d="M98 291 C174 214 222 169 310 184 C382 196 416 104 482 128 C552 153 579 234 638 203"
        />
        <g className="map-node node-eu" filter="url(#glow)">
          <circle cx="98" cy="291" r="9" />
          <text x="76" y="326">Европа</text>
        </g>
        <g className="map-node node-vilnius" filter="url(#glow)">
          <circle cx="482" cy="128" r="10" />
          <text x="434" y="100">Вильнюс</text>
        </g>
        <g className="map-node node-ru" filter="url(#glow)">
          <circle cx="638" cy="203" r="9" />
          <text x="598" y="238">Россия</text>
        </g>
        <path className="landmark" d="M271 118 l56 21 -19 48 -72 13 -38 -35z" />
        <path className="landmark" d="M522 210 l82 15 30 61 -76 39 -69 -42z" />
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <RouteMap />
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">Склад в Вильнюсе · выкуп · таможня · РФ</span>
          <h1>
            <span className="hero-title-accent">Доставка и выкуп грузов</span>
            <span>из Европы под ключ</span>
            <small>без головной боли</small>
          </h1>
          <p>
            Везём тогда, когда другие говорят "невозможно". Сборные грузы, выкуп у поставщика,
            таможня, склад в Вильнюсе. От 500 кг. Работаем с 2014 года.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/kalkulyator/">
              Рассчитать стоимость <ArrowRight size={18} />
            </a>
            <a className="button button-secondary" href="/kak-my-rabotaem/">
              Как мы работаем
            </a>
          </div>
        </div>
      </div>
      <HeroTicker />
    </section>
  );
}

function HeroTicker() {
  const items = [
    ["12 лет", "на рынке"],
    ["10 000+", "грузов доставлено"],
    ["100%", "успешно доставленных грузов"],
    ["0", "задержек по вине оформления"],
    ["1 окно", "выкуп + перевозка + таможня"],
    ["от 500 кг", "сборные грузы из Европы"],
    ["Вильнюс", "свой склад и консолидация"],
    ["2 часа", "на первичный расчёт"],
    ["FTL", "фуры и контейнеры"],
    ["выкуп", "оплата поставщику в Европе"],
  ];
  const tickerItems = [...items, ...items];

  return (
    <div className="hero-ticker" aria-label="Показатели и услуги BelTransit">
      <div className="ticker-track">
        {tickerItems.map(([value, label], index) => (
          <div className="ticker-item" key={`${value}-${label}-${index}`}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function AudienceSplit() {
  return (
    <section className="section split-section">
      <div className="section-heading">
        <span className="eyebrow">Маршрут начинается с роли</span>
        <h2>Кто вы?</h2>
      </div>
      <div className="audience-grid">
        <article className="audience-card audience-card-primary">
          <Package size={34} />
          <h3>Я везу товар</h3>
          <p>Малый и средний бизнес, рыночники, Wildberries-предприниматели.</p>
          <a className="button button-dark" href="/sbornye-gruzy/">
            Рассчитать сборный груз
          </a>
        </article>
        <article className="audience-card">
          <Handshake size={34} />
          <h3>Я логист / посредник</h3>
          <p>Транспортные компании и экспедиторы из РФ, которым нужен партнёр в РБ/Литве.</p>
          <a className="button button-plain" href="/dlya-logistov/">
            Обсудить партнёрство
          </a>
        </article>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section section-ink">
      <div className="section-heading section-heading-row">
        <div>
          <span className="eyebrow">Один контур ответственности</span>
          <h2>Что мы делаем</h2>
        </div>
        <a className="text-link" href="/sbornye-gruzy/">
          Все услуги <ArrowRight size={17} />
        </a>
      </div>
      <div className="service-grid">
        {services.map(({ icon: Icon, title, text, href }) => (
          <article className="service-card" key={title}>
            <Icon size={28} />
            <h3>{title}</h3>
            <p>{text}</p>
            <a href={href}>Подробнее</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ["1", "Заявка", "Оставляете запрос"],
    ["2", "Расчёт", "Считаем цену за 2 часа"],
    ["3", "Забираем", "Груз у вашего поставщика"],
    ["4", "Доставка", "До двери в РФ + таможня"],
  ];

  return (
    <section className="section process-section">
      <div className="section-heading">
        <span className="eyebrow">Прозрачный маршрут</span>
        <h2>Как это работает — 4 шага</h2>
      </div>
      <div className="process-track">
        {steps.map(([num, title, text]) => (
          <article className="process-step" key={num}>
            <span>{num}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <a className="button button-primary" href="#request">
        Оставить заявку
      </a>
    </section>
  );
}

function CargoGrid() {
  return (
    <section className="section cargo-section">
      <div className="section-heading">
        <span className="eyebrow">Категории</span>
        <h2>Везём всё что продаётся на рынках и Wildberries</h2>
      </div>
      <div className="cargo-grid">
        {cargo.map(([name, Icon]) => (
          <a className="cargo-tile" href="/chto-vezem/" key={name}>
            <Icon size={25} />
            <span>{name}</span>
          </a>
        ))}
      </div>
      <a className="text-link centered" href="/chto-vezem/">
        Смотреть полный список <ArrowRight size={17} />
      </a>
    </section>
  );
}

function CaseStudies() {
  return (
    <section className="section cases-section">
      <div className="section-heading section-heading-row">
        <div>
          <span className="eyebrow">Практика, не обещания</span>
          <h2>Реальные доставки</h2>
        </div>
        <a className="text-link" href="/kejsy/">
          Смотреть все кейсы <ArrowRight size={17} />
        </a>
      </div>
      <div className="case-grid">
        {cases.map((item, index) => (
          <article className="case-card" key={item.title}>
            <span className="case-number">0{index + 1}</span>
            <h3>{item.title}</h3>
            <strong>{item.meta}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="section why-section">
      <div className="section-heading">
        <span className="eyebrow">Почему мы</span>
        <h2>Почему выбирают БелТранзит</h2>
      </div>
      <div className="advantage-list">
        {advantages.map((item) => (
          <div className="advantage-item" key={item}>
            <span>
              <Check size={18} />
            </span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RequestForm() {
  return (
    <section className="section request-section" id="request">
      <div className="request-copy">
        <span className="eyebrow">Расчёт</span>
        <h2>Рассчитайте стоимость за 2 минуты</h2>
        <p>Укажите базовые данные по грузу. Менеджер проверит маршрут, вес, документы и вернётся с расчётом.</p>
      </div>
      <form className="request-form">
        <label>
          <span>Откуда везём</span>
          <input type="text" name="from" placeholder="Страна / город" />
        </label>
        <label>
          <span>Что везём</span>
          <input type="text" name="cargo" placeholder="Тип товара" />
        </label>
        <label>
          <span>Примерный вес</span>
          <input type="number" name="weight" min="0" placeholder="кг" />
        </label>
        <label>
          <span>Телефон / Telegram</span>
          <input type="text" name="contact" placeholder="+7..." />
        </label>
        <button className="button button-primary" type="submit">
          Получить расчёт <Send size={18} />
        </button>
        <small>Ответим в течение 2 часов в рабочее время</small>
      </form>
    </section>
  );
}

function ServicePageHero() {
  return (
    <section className="page-hero">
      <RouteMap />
      <div className="page-hero-inner">
        <span className="eyebrow">Сборные грузы · Европа → Вильнюс → Россия</span>
        <h1>Сборные грузы из Европы в Россию — от 500 кг, склад в Вильнюсе</h1>
        <p>
          Собираем грузы от разных поставщиков на нашем складе в Вильнюсе и везём одной машиной.
          Быстро, дёшево, под ключ.
        </p>
        <a className="button button-primary" href="#groupage-request">
          Рассчитать стоимость <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}

function ServiceStats() {
  return (
    <section className="service-stats" aria-label="Показатели сборных грузов">
      {groupageStats.map(([value, label]) => (
        <div className="service-stat" key={value}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}

function GroupageExplainer() {
  return (
    <section className="section explainer-section">
      <div className="section-heading">
        <span className="eyebrow">Простыми словами</span>
        <h2>Что такое сборный груз и зачем он вам</h2>
      </div>
      <div className="explainer-copy">
        <p>
          Сборный груз — это когда несколько клиентов делят одну фуру. Вы платите только за свою
          часть, а не за всю машину. Идеально если у вас 500 кг — 3 тонны товара.
        </p>
        <p>
          У нас есть склад в Вильнюсе где мы собираем грузы от разных поставщиков из разных стран
          Европы. Когда машина заполнена — отправляем в Россию.
        </p>
      </div>
    </section>
  );
}

function GroupageProcess() {
  return (
    <section className="section process-section groupage-process">
      <div className="section-heading">
        <span className="eyebrow">Маршрут партии</span>
        <h2>Как это работает — 5 шагов</h2>
      </div>
      <div className="process-track process-track-five">
        {groupageSteps.map(([num, title, text]) => (
          <article className="process-step" key={num}>
            <span>{num}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function GroupageAudience() {
  return (
    <section className="section audience-service-section">
      <div className="section-heading">
        <span className="eyebrow">Для кого</span>
        <h2>Кому подходит</h2>
      </div>
      <div className="service-audience-grid">
        {groupageAudiences.map(({ icon: Icon, title, text }) => (
          <article className="service-audience-card" key={title}>
            <Icon size={30} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function GroupageWhy() {
  return (
    <section className="section why-section groupage-why">
      <div className="section-heading">
        <span className="eyebrow">Почему именно мы</span>
        <h2>Почему именно мы</h2>
      </div>
      <div className="advantage-list">
        {groupageAdvantages.map((item) => (
          <div className="advantage-item" key={item}>
            <span>
              <Check size={18} />
            </span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FrequentCargo() {
  return (
    <section className="section cargo-section frequent-cargo">
      <div className="section-heading">
        <span className="eyebrow">Категории</span>
        <h2>Что чаще всего везут наши клиенты</h2>
      </div>
      <div className="cargo-grid">
        {cargo.map(([name, Icon]) => (
          <a className="cargo-tile" href="/chto-vezem/" key={name}>
            <Icon size={25} />
            <span>{name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function GroupageCase() {
  return (
    <section className="section featured-case-section">
      <div className="section-heading">
        <span className="eyebrow">Кейс</span>
        <h2>Пример реальной доставки</h2>
      </div>
      <article className="featured-case">
        <div>
          <span className="case-number">01</span>
          <h3>Автозапчасти из Германии, 1.8 тонны</h3>
        </div>
        <p>
          Клиент — оптовик из Москвы. Нашёл поставщика в Германии, но не знал как привезти. Мы
          выкупили товар, собрали на складе в Вильнюсе вместе с другими грузами, растаможили и
          доставили за 11 дней.
        </p>
        <blockquote>Думал это будет сложно — оказалось проще чем заказать на Авито</blockquote>
      </article>
    </section>
  );
}

function GroupageFaq() {
  return (
    <section className="section faq-section">
      <div className="section-heading">
        <span className="eyebrow">FAQ</span>
        <h2>Частые вопросы</h2>
      </div>
      <div className="faq-list">
        {groupageFaq.map(([question, answer], index) => (
          <details className="faq-item" key={question} open={index === 0}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function GroupageFinalCta() {
  return (
    <section className="section request-section" id="groupage-request">
      <div className="request-copy">
        <span className="eyebrow">Заявка</span>
        <h2>Готовы везти ваш груз</h2>
        <p>Оставьте данные по партии. Мы проверим маршрут, вес, склад и документы, затем вернёмся с расчётом.</p>
      </div>
      <form className="request-form">
        <label>
          <span>Откуда везём</span>
          <input type="text" name="from" placeholder="Страна / город" />
        </label>
        <label>
          <span>Что везём</span>
          <input type="text" name="cargo" placeholder="Тип товара" />
        </label>
        <label>
          <span>Примерный вес</span>
          <input type="number" name="weight" min="0" placeholder="кг" />
        </label>
        <label>
          <span>Телефон / Telegram</span>
          <input type="text" name="contact" placeholder="+7..." />
        </label>
        <button className="button button-primary" type="submit">
          Получить расчёт <Send size={18} />
        </button>
        <small>Ответим в течение 2 часов</small>
      </form>
    </section>
  );
}

function GroupagePage() {
  return (
    <>
      <ServicePageHero />
      <ServiceStats />
      <GroupageExplainer />
      <GroupageProcess />
      <GroupageAudience />
      <GroupageWhy />
      <FrequentCargo />
      <GroupageCase />
      <GroupageFaq />
      <GroupageFinalCta />
    </>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <AudienceSplit />
      <Services />
      <Process />
      <CargoGrid />
      <CaseStudies />
      <WhyUs />
      <RequestForm />
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <a className="brand" href="/">
          <span className="brand-mark">
            <img src={logoMark} alt="" />
          </span>
          <span>
            <strong>BelTransit</strong>
            <small>Europe freight desk</small>
          </span>
        </a>
        <p>Доставка, выкуп и таможенное сопровождение грузов из Европы через Вильнюс.</p>
      </div>
      <div>
        <h3>Услуги</h3>
        <a href="/sbornye-gruzy/">Сборные грузы</a>
        <a href="/vykup-tovarov/">Выкуп товаров</a>
        <a href="/tamozhnoe-oformlenie/">Таможенное оформление</a>
        <a href="/sklad-vilnyus/">Склад в Вильнюсе</a>
      </div>
      <div>
        <h3>Контакты</h3>
        <a href="tel:+375000000000">
          <Phone size={15} /> +375 00 000-00-00
        </a>
        <a href="https://t.me/beltransit">
          <Send size={15} /> Telegram
        </a>
        <a href="mailto:info@beltransit.by">info@beltransit.by</a>
        <span>
          <MapPin size={15} /> Вильнюс · Минск · Москва
        </span>
      </div>
      <div>
        <h3>Документы</h3>
        <a href="/o-kompanii/">О компании</a>
        <a href="/faq/">FAQ</a>
        <a href="/kontakty/">Юридическая информация</a>
        <span>© 2026 BelTransit</span>
      </div>
    </footer>
  );
}

function App() {
  const path = window.location.pathname;
  const isGroupagePage = path === "/sbornye-gruzy/" || path === "/sbornye-gruzy";

  React.useEffect(() => {
    document.title = isGroupagePage
      ? "Сборные грузы из Европы — BelTransit"
      : "BelTransit — доставка и выкуп грузов из Европы";
  }, [isGroupagePage]);

  return (
    <>
      <Header />
      <main>{isGroupagePage ? <GroupagePage /> : <HomePage />}</main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
