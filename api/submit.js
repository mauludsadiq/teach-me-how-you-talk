import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const body = await readJson(req); // raw parse: no framework
    const { term, meaning, ts } = body || {};
    if (!term || !meaning) {
      return res.status(400).json({ ok: false, error: "Missing term or meaning" });
    }

    const safe = String(term).replace(/[^a-z0-9]/gi, "_");
    const filename = `entries/${Date.now()}-${safe}.json`;
    const data = JSON.stringify({ term, meaning, ts: ts || Date.now() }, null, 2);

    await put(filename, data, { access: "private" });

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ ok: true, file: filename });
  } catch (err) {
    console.error("Blob upload error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (c) => (buf += c));
    req.on("end", () => {
      try { resolve(buf ? JSON.parse(buf) : {}); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}
