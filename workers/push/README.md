# Saturday grocery reminder service

A tiny free Cloudflare Worker. Every hour it checks whose local time is Saturday 12:00–13:59 and sends them a
"wake-up" push; the app's service worker (`public/push-handler.js`) then fetches next week's grocery list from
this Worker and shows it as a notification.

What this service stores (Cloudflare KV): your phone's push address, your timezone, and next week's ingredient
list. Nothing else leaves your phone.

## One-time setup

You need: the app published over HTTPS (e.g. GitHub Pages) and a free Cloudflare account.

1. **Keys** (already done on this Mac): `node scripts/generate-vapid.mjs`
   Public key is in `wrangler.toml` and `/.env`. Private key is in `.vapid-private.json` (git-ignored).
2. **Log in to Cloudflare** (opens your browser): `npx wrangler login`
3. **Create storage**: `npx wrangler kv namespace create SUBS`, then paste the printed `id` into `wrangler.toml`.
4. **Fill in `wrangler.toml`**: set `ALLOWED_ORIGIN` and `VAPID_SUBJECT` to your app's address,
   e.g. `https://yourname.github.io` (no path, no trailing slash).
5. **Upload the private key as a secret**: `npx wrangler secret put VAPID_PRIVATE_JWK < .vapid-private.json`
6. **Publish the service**: `npx wrangler deploy` — it prints an address like
   `https://fuel-and-form-push.<you>.workers.dev`.
7. **Tell the app where it is**: add `VITE_API_URL=https://fuel-and-form-push.<you>.workers.dev` to `/.env`,
   then rebuild and republish the app.

## On your iPhone (iOS 16.4+)

1. Open the published app in **Safari** → Share → **Add to Home Screen**.
2. Open it **from the Home Screen icon** (notifications only work there).
3. Today → gear → **Reminders** → switch on **Saturday grocery list** → Allow.
4. Tap **Send a test notification** to check it works.

## Development

- `npm test` — unit tests for the schedule, signing and validation logic.
- `npm run typecheck`
- `npx wrangler dev --local` — run the service on your Mac.
