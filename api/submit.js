import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const body = JSON.parse(Buffer.concat(buffers).toString());
    const { term, meaning, ts } = body;

    const fileName = `entries/${ts}-${term.replace(/\s+/g, '_')}.json`;
    const { url } = await put(fileName, JSON.stringify({ term, meaning, ts }, null, 2), {
      access: 'public',  // 👈 this fixes it
      contentType: 'application/json'
    });

    res.status(200).json({ ok: true, url });
  } catch (err) {
    console.error('Blob upload error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
