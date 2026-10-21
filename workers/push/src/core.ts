// Pure logic, kept separate from the Worker so it can be tested on its own.

export interface Stored {
  subscription: { endpoint: string }
  tz: string
  items: string[]
  lastSent?: string // local date (YYYY-MM-DD) of the last Saturday notification
  updated: number
}

/** The date, weekday and hour on a clock in the given timezone. */
export function localParts(now: Date, tz: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', hourCycle: 'h23',
    }).formatToParts(now).map((p) => [p.type, p.value]),
  )
  return { weekday: parts.weekday, hour: Number(parts.hour), date: `${parts.year}-${parts.month}-${parts.day}` }
}

/**
 * True from 12:00 to 13:59 local time on a Saturday, once per Saturday.
 * The two-hour window means one missed hourly run is retried the next hour.
 */
export function isSendTime(now: Date, tz: string, lastSent?: string): boolean {
  try {
    const { weekday, hour, date } = localParts(now, tz)
    return weekday === 'Sat' && hour >= 12 && hour < 14 && lastSent !== date
  } catch {
    return false // unknown timezone name
  }
}

const b64u = (data: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(data))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const text = (s: string) => new TextEncoder().encode(s)

/** Headers that prove to Apple/Google that this server is allowed to push to the subscription (VAPID, RFC 8292). */
export async function vapidHeaders(endpoint: string, publicKey: string, privateJwk: JsonWebKey, subject: string, nowMs = Date.now()) {
  const header = b64u(text(JSON.stringify({ typ: 'JWT', alg: 'ES256' })))
  const claims = b64u(text(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(nowMs / 1000) + 12 * 3600, sub: subject })))
  const key = await crypto.subtle.importKey('jwk', privateJwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, text(`${header}.${claims}`))
  return { Authorization: `vapid t=${header}.${claims}.${b64u(sig)}, k=${publicKey}`, TTL: '86400', Urgency: 'normal' }
}

const PUSH_HOSTS = [/^web\.push\.apple\.com$/, /^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /\.notify\.windows\.com$/]

/** Only real browser push services are accepted, so this Worker can't be used to call arbitrary addresses. */
export function isPushEndpoint(endpoint: unknown): endpoint is string {
  try {
    const u = new URL(String(endpoint))
    return u.protocol === 'https:' && PUSH_HOSTS.some((re) => re.test(u.hostname))
  } catch {
    return false
  }
}

export const cleanItems = (items: unknown): string[] =>
  Array.isArray(items) ? items.filter((i): i is string => typeof i === 'string').slice(0, 150).map((i) => i.slice(0, 120)) : []

// ---------- Online recipe search (TheMealDB) ----------

export interface WebRecipe {
  webId: string
  name: string
  image: string
  area: string
  category: string
  cuisine: string // one of the app's cuisine ids, or 'world'
  ingredients: string[]
  steps: string[]
  source?: string
  video?: string
}

// TheMealDB's "area" names -> the app's cuisines (nearest match; anything else becomes 'world').
const AREA_GROUPS: Record<string, string[]> = {
  italian: ['Italian', 'Italy', 'Sammarinese'],
  mexican: ['Mexican', 'Mexico'],
  chinese: ['Chinese', 'China', 'Taiwanese', 'Hong Konger'],
  japanese: ['Japanese', 'Japan'],
  thai: ['Thai', 'Thailand', 'Vietnamese', 'Malaysian', 'Indonesian', 'Singaporean', 'Cambodian', 'Laotian', 'Burmese'],
  indian: ['Indian', 'India', 'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Nepalese'],
  korean: ['Korean', 'Korea', 'South Korean', 'North Korean'],
  filipino: ['Filipino', 'Philippines'],
  american: ['American', 'USA', 'Canadian'],
  mediterranean: ['Greek', 'Turkish', 'Moroccan', 'Tunisian', 'Egyptian', 'Croatian', 'Spanish', 'Portuguese', 'Lebanese',
    'Israeli', 'Cypriot', 'Maltese', 'Syrian', 'Palestinian', 'Jordanian', 'Algerian', 'Libyan', 'Albanian', 'Montenegrin'],
}
const AREA_TO_CUISINE: Record<string, string> = Object.fromEntries(
  Object.entries(AREA_GROUPS).flatMap(([cuisine, areas]) => areas.map((a) => [a, cuisine])),
)

/** Turns one block of instructions into short, clean steps. */
export function splitSteps(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(step\s*\d+[:.)-]?|\d+[.)]|[•\-*])\s*/i, '').trim())
    .filter((l) => l.length > 2 && !/^step\s*\d+$/i.test(l))
  if (lines.length > 1) return lines
  // one long paragraph: split into sentences, two per step
  const sentences = (lines[0] ?? '').match(/[^.!?]+[.!?]+(\s|$)/g)?.map((s) => s.trim()) ?? lines
  const steps: string[] = []
  for (let i = 0; i < sentences.length; i += 2) steps.push(sentences.slice(i, i + 2).join(' '))
  return steps
}

export function normalizeMeal(m: Record<string, string | null>): WebRecipe {
  const ingredients: string[] = []
  for (let i = 1; i <= 20; i++) {
    const ing = (m[`strIngredient${i}`] ?? '').trim()
    const measure = (m[`strMeasure${i}`] ?? '').trim()
    if (ing) ingredients.push(measure ? `${measure} ${ing}` : ing)
  }
  const area = m.strArea ?? ''
  return {
    webId: `mealdb-${m.idMeal}`,
    name: (m.strMeal ?? '').trim(),
    image: m.strMealThumb ?? '',
    area,
    category: m.strCategory ?? '',
    cuisine: AREA_TO_CUISINE[area] ?? 'world',
    ingredients,
    steps: splitSteps(m.strInstructions ?? ''),
    source: m.strSource || undefined,
    video: m.strYoutube || undefined,
  }
}
