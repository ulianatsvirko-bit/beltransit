const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const FIELD_LABELS = {
  name: "Имя",
  company: "Компания",
  "company-role": "Компания / должность",
  contact: "Телефон / Telegram",
  message: "Сообщение",
  comment: "Комментарий",
  from: "Откуда везём",
  pickup: "Откуда забираем",
  cargo: "Груз",
  "cargo-type": "Тип товара",
  weight: "Вес",
  amount: "Сумма закупки",
  country: "Страна",
  "origin-country": "Страна происхождения",
  "supplier-country": "Страна поставщика",
  "supplier-countries": "Страны поставщиков",
  volume: "Объём",
  "monthly-volume": "Объём в месяц",
  product: "Товар",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram env vars not set");
    return res.status(500).json({ error: "Bot not configured" });
  }

  const fields = req.body || {};

  const lines = [
    `📦 *Новая заявка — BelTransit*`,
    fields.source ? `📍 ${fields.source}` : "",
    "",
  ].filter((l) => l !== undefined);

  for (const [key, value] of Object.entries(fields)) {
    if (key === "source" || !value || String(value).trim() === "") continue;
    const label = FIELD_LABELS[key] || key;
    lines.push(`*${label}:* ${String(value).trim()}`);
  }

  const text = lines.join("\n");

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!tgRes.ok) {
      const err = await tgRes.text();
      console.error("Telegram error:", err);
      return res.status(502).json({ error: err });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: String(err) });
  }
}
