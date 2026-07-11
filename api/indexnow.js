import { isAdminRequest } from "../lib/server-auth.js";
import { submitIndexNow } from "../lib/indexnow.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAdminRequest(req)) return res.status(401).json({ error: "Unauthorized" });

  try {
    const paths = Array.isArray(req.body?.paths) ? req.body.paths : [];
    return res.status(200).json(await submitIndexNow(paths));
  } catch (error) {
    console.error("IndexNow submission failed", error);
    return res.status(502).json({ error: "IndexNow submission failed" });
  }
}
