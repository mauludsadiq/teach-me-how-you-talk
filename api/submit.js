import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { text, consent } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing or invalid text' });
    }

    if (consent !== true) {
      return res.status(400).json({ ok: false, error: 'Consent required' });
    }

    const entry = { text, consent, timestamp: new Date().toISOString() };
    const blob = await put(`entries/${Date.now()}.json`, JSON.stringify(entry), {
      access: 'public',
      addRandomSuffix: true
    });

    res.status(200).json({ ok: true, url: blob.url });
  } catch (err) {
    console.error('Blob upload error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
