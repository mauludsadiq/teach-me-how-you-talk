// /api/submit.js — Vercel Edge Function: save to Blob Storage
import { put } from '@vercel/blob';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    if (!Array.isArray(body.entries)) {
      return new Response('Bad Request', { status: 400 });
    }

    const filename = `tmhyt/${Date.now()}.json`;
    await put(filename, JSON.stringify({
      entries: body.entries,
      ts: body.ts || Date.now()
    }, null, 2), { access: 'private' });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (e) {
    return new Response('Server Error', { status: 500 });
  }
}
