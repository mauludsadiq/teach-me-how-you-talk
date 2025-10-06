import { put } from "@vercel/blob";

export const config = {
  runtime: "nodejs18.x",
  maxDuration: 10,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const body = await req.json();
    const fileName = `entries/${Date.now()}-${body.term?.replace(/\s+/g, "_") || "entry"}.json`;

    const { url } = await put(fileName, JSON.stringify(body, null, 2), {
      access: "private",
    });

    return res.status(200).json({ ok: true, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
