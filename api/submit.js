import { put } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const { term, meaning, ts } = req.body;
    if (!term || !meaning)
      return res.status(400).json({ ok: false, error: "Missing term or meaning" });

    const filename = `entries/${Date.now()}-${term.replace(/[^a-z0-9]/gi, '_')}.json`;
    const data = JSON.stringify({ term, meaning, ts: ts || Date.now() }, null, 2);

    const { url } = await put(filename, data, { access: 'private' });
    res.status(200).json({ ok: true, url });
  } catch (err) {
    console.error("Blob upload error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
