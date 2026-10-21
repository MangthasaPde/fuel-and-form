import { cleanItems, isPushEndpoint, isSendTime, localParts, normalizeMeal, vapidHeaders, type Stored } from './core.ts'

export interface Env {
  SUBS: KVNamespace
  ALLOWED_ORIGIN: string
  VAPID_PUBLIC: string
  VAPID_SUBJECT: string
  VAPID_PRIVATE_JWK: string // secret
  MEALDB_KEY?: string // optional secret; TheMealDB's free test key '1' is used if not set
}

const ID = /^[a-f0-9]{64}$/
const key = (id: string) => `sub:${id}`

/** Sends an empty "wake-up" push. The app's service worker then fetches the list and shows the notification. */
async function sendPush(env: Env, stored: Stored): Promise<number> {
  const headers = await vapidHeaders(stored.subscription.endpoint, env.VAPID_PUBLIC, JSON.parse(env.VAPID_PRIVATE_JWK), env.VAPID_SUBJECT)
  const res = await fetch(stored.subscription.endpoint, { method: 'POST', headers })
  return res.status
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    // the published app, plus the app running on your Mac while developing
    const origin = req.headers.get('Origin') ?? ''
    const allowed = origin === env.ALLOWED_ORIGIN || /^http:\/\/localhost:\d+$/.test(origin) ? origin : env.ALLOWED_ORIGIN
    const cors = {
      'Access-Control-Allow-Origin': allowed,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    }
    const json = (data: unknown, status = 200) =>
      new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    const url = new URL(req.url)

    if (req.method === 'GET' && url.pathname === '/api/recipes') {
      const q = (url.searchParams.get('q') ?? '').trim()
      if (q.length < 2 || q.length > 60) return json({ error: 'search for 2–60 characters' }, 400)
      const res = await fetch(`https://www.themealdb.com/api/json/v1/${env.MEALDB_KEY || '1'}/search.php?s=${encodeURIComponent(q)}`, {
        cf: { cacheTtl: 86400, cacheEverything: true }, // the same search is answered from Cloudflare's cache for a day
      })
      if (!res.ok) return json({ error: 'recipe service unavailable' }, 502)
      const data = (await res.json()) as { meals: Record<string, string | null>[] | null }
      return json({ results: (data.meals ?? []).slice(0, 24).map(normalizeMeal) })
    }

    if (req.method === 'GET' && url.pathname === '/api/list') {
      const id = url.searchParams.get('id') ?? ''
      if (!ID.test(id)) return json({ error: 'bad id' }, 400)
      const stored = await env.SUBS.get<Stored>(key(id), 'json')
      return stored ? json({ items: stored.items }) : json({ error: 'not found' }, 404)
    }

    if (req.method !== 'POST') return json({ error: 'not found' }, 404)
    const raw = await req.text()
    if (raw.length > 30_000) return json({ error: 'too large' }, 413)
    let body: any
    try {
      body = JSON.parse(raw)
    } catch {
      return json({ error: 'bad json' }, 400)
    }
    const id = String(body.id ?? '')
    if (!ID.test(id)) return json({ error: 'bad id' }, 400)

    if (url.pathname === '/api/subscribe') {
      if (!isPushEndpoint(body.subscription?.endpoint)) return json({ error: 'bad subscription' }, 400)
      const old = await env.SUBS.get<Stored>(key(id), 'json')
      const stored: Stored = {
        subscription: { endpoint: body.subscription.endpoint },
        tz: typeof body.tz === 'string' ? body.tz : 'UTC',
        items: old?.items ?? [],
        lastSent: old?.lastSent,
        updated: Date.now(),
      }
      await env.SUBS.put(key(id), JSON.stringify(stored))
      return json({ ok: true })
    }

    const stored = await env.SUBS.get<Stored>(key(id), 'json')
    if (!stored) return json({ error: 'not subscribed' }, 404)

    if (url.pathname === '/api/list') {
      await env.SUBS.put(key(id), JSON.stringify({ ...stored, items: cleanItems(body.items), updated: Date.now() }))
      return json({ ok: true })
    }
    if (url.pathname === '/api/unsubscribe') {
      await env.SUBS.delete(key(id))
      return json({ ok: true })
    }
    if (url.pathname === '/api/test') {
      const status = await sendPush(env, stored)
      if (status === 404 || status === 410) await env.SUBS.delete(key(id))
      return json({ ok: status >= 200 && status < 300, status })
    }
    return json({ error: 'not found' }, 404)
  },

  async scheduled(_event: ScheduledController, env: Env): Promise<void> {
    const now = new Date()
    let cursor: string | undefined
    do {
      const page = await env.SUBS.list({ prefix: 'sub:', cursor })
      for (const { name } of page.keys) {
        const stored = await env.SUBS.get<Stored>(name, 'json')
        if (!stored || !isSendTime(now, stored.tz, stored.lastSent)) continue
        const status = await sendPush(env, stored)
        if (status === 404 || status === 410) await env.SUBS.delete(name) // subscription no longer exists
        else if (status >= 200 && status < 300) await env.SUBS.put(name, JSON.stringify({ ...stored, lastSent: localParts(now, stored.tz).date }))
      }
      cursor = page.list_complete ? undefined : page.cursor
    } while (cursor)
  },
}
