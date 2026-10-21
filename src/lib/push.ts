import type { MealPlanEntry, Recipe } from '../types'
import { addDays, today, weekDates } from './date'
import { groceryFor } from './grocery'

// Where the reminder service lives and its public key. Both are set when the app is published (see workers/push/README.md).
const API = import.meta.env.VITE_PUSH_API as string | undefined
const VAPID = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined

export type PushState = 'unconfigured' | 'unsupported' | 'blocked' | 'off' | 'on'

const supported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window

export async function getPushState(): Promise<PushState> {
  if (!API || !VAPID) return 'unconfigured'
  if (!supported()) return 'unsupported' // on iPhone this means: not opened from the Home Screen yet
  if (Notification.permission === 'denied') return 'blocked'
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  return sub && Notification.permission === 'granted' ? 'on' : 'off'
}

/** Both sides derive the same id from the subscription's address, so no login is needed. */
async function idFor(endpoint: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const keyBytes = (b64: string) => {
  const raw = atob(b64.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(b64.length / 4) * 4, '='))
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

async function post(path: string, body: unknown) {
  const res = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`Reminder service error (${res.status})`)
}

async function currentSub() {
  const reg = await navigator.serviceWorker.ready
  return reg.pushManager.getSubscription()
}

export async function enablePush() {
  if (!API || !VAPID) throw new Error('Reminders are not set up yet.')
  if ((await Notification.requestPermission()) !== 'granted') throw new Error('Notifications were not allowed.')
  const reg = await navigator.serviceWorker.ready
  const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(VAPID) }))
  // the service worker can't see this file's settings, so leave the service address where it can read it
  await (await caches.open('ff-config')).put('/ff-config', new Response(JSON.stringify({ api: API })))
  await post('/api/subscribe', { id: await idFor(sub.endpoint), subscription: sub.toJSON(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone })
}

export async function disablePush() {
  const sub = await currentSub()
  if (!sub) return
  const id = await idFor(sub.endpoint)
  await sub.unsubscribe()
  await post('/api/unsubscribe', { id }).catch(() => {})
}

export async function sendTestPush() {
  const sub = await currentSub()
  if (!sub) throw new Error('Turn the reminder on first.')
  await post('/api/test', { id: await idFor(sub.endpoint) })
}

/** Next week's shopping list (Mon–Sun, anything you haven't ticked off) — what the Saturday notification shows. */
export function nextWeekItems(plan: MealPlanEntry[], recipes: Recipe[], grocery: Record<string, string[]>): string[] {
  const days = weekDates(addDays(today(), 7))
  const checked = grocery[days[0]] ?? []
  return groceryFor(plan, new Map(recipes.map((r) => [r.id, r])), days, days[0])
    .map(([item]) => item)
    .filter((item) => !checked.includes(item))
}

/** Keeps the service's copy of next week's list up to date. Does nothing if reminders are off. */
export async function syncNextWeek(plan: MealPlanEntry[], recipes: Recipe[], grocery: Record<string, string[]>) {
  if ((await getPushState()) !== 'on') return
  const sub = await currentSub()
  if (!sub) return
  await post('/api/list', { id: await idFor(sub.endpoint), items: nextWeekItems(plan, recipes, grocery) }).catch(() => {})
}
