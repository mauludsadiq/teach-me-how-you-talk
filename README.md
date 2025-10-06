# Teach Me How You Talk — Vercel Starter

A one-file front end + one serverless function to collect **consented** language data. Simple for users: they type a word/phrase + meaning → click **Yes** to "Teach the Teacher."

## What’s inside
```
index.html          # minimal UI (no clutter)
api/submit.js       # Vercel Edge Function that writes JSON to Vercel Blob storage
vercel.json         # CORS headers (so you can embed if needed)
package.json        # adds @vercel/blob dependency
```

---

## Use in VS Code
1. Unzip the project and open the folder in **VS Code**.
2. (Optional) Live preview locally:
   - Install the **Live Server** extension (Ritwick Dey).
   - Right-click `index.html` → **Open with Live Server**.
   - The "Copy Shareable Link" button will still work locally; data stays in your browser.

> Local server won't call `/api/submit` unless you deploy to Vercel (that's fine for classroom demos).

---

## Deploy to Vercel (free)

### A) Quick deploy by upload
1. Go to **vercel.com → New Project → Deploy**.
2. Drag-and-drop this folder.
3. After deploy, your site is live at a URL like:
   `https://teach-me-how-you-talk-xyz.vercel.app`

### B) Rename the link
- In your project → **Settings → General → Name** → change it (e.g., `tmhyt`).
- Your link becomes: `https://tmhyt.vercel.app`.

### C) Enable storage (to collect data)
- In Vercel → **Storage → Blob** → create a store for the project.
- Re-deploy (or trigger a redeploy). That’s it.

Submissions will write JSON files under `tmhyt/<timestamp>.json` in Blob storage. You can browse and download them in Vercel.

> If you want KV or Postgres instead of Blob, swap `/api/submit.js` and I’ll give you that version.

---

## How to use the app
1. User types a **word/phrase** and **what it means** → **Add**.
2. Click **Yes** on **Do You Want To Teach The Teacher?**
3. The app generates a copyable explanation (semantics, syntax frame, POS guess, morphology hint).
4. If **consent** is checked, it also **sends a private JSON** to `/api/submit`.
5. Use **Export JSON** or **Copy Dataset** to save/share your own copy anytime.

---

## Privacy & Consent
- Everything stays **local** unless the user exports, shares, or checks consent to submit.
- “Teach the Teacher” is descriptive, not prescriptive.
- You can remove Blob files in Vercel at any time; you control access.

---

## Custom domain (optional)
- In Vercel → Project → **Settings → Domains** → add `teachmehowyoutalk.org` (or any domain you own).

---

## Need help?
Tell me which storage you prefer (Blob/KV/Postgres), and I’ll provide the exact `/api/submit` you need.
