import { put } from '@vercel/blob';

export default async function handler(req, res) {
export const config = { runtime: "@vercel/node@3.0.0" };
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const body = await readJson(req);
    if (!Array.isArray(body.entries)) {
      return res.status(400).send('Bad Request');
    }

    const filename = `tmhyt/${Date.now()}.json`;
    await put(
      filename,
      JSON.stringify({ entries: body.entries, ts: body.ts || Date.now() }, null, 2),
      { access: 'private' }
    );

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).send('Server Error');
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}
