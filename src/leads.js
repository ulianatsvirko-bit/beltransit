// Public lead persistence is kept separate from the admin bundle.
export async function saveLead(data) {
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // Telegram delivery is handled separately; the public form must stay usable.
  }
}
